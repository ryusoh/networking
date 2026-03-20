#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

/**
 * NAS Proxy Scraper
 * -----------------
 * Bypasses 403 Forbidden and CORS errors by fetching 
 * proxy lists from the NAS backend instead of the browser.
 */

struct MemoryStruct {
  char *memory;
  size_t size;
};

static size_t WriteMemoryCallback(void *contents, size_t size, size_t nmemb, void *userp) {
  size_t realsize = size * nmemb;
  struct MemoryStruct *mem = (struct MemoryStruct *)userp;

  char *ptr = realloc(mem->memory, mem->size + realsize + 1);
  if(!ptr) return 0;

  mem->memory = ptr;
  memcpy(&(mem->memory[mem->size]), contents, realsize);
  mem->size += realsize;
  mem->memory[mem->size] = 0;

  return realsize;
}

int fetch_proxy_list(const char *url) {
    CURL *curl_handle;
    CURLcode res;
    struct MemoryStruct chunk;

    chunk.memory = malloc(1);
    chunk.size = 0;

    curl_handle = curl_easy_init();
    if (curl_handle) {
        curl_easy_setopt(curl_handle, CURLOPT_URL, url);
        curl_easy_setopt(curl_handle, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);
        curl_easy_setopt(curl_handle, CURLOPT_WRITEDATA, (void *)&chunk);
        
        // Mimic a real browser precisely
        curl_easy_setopt(curl_handle, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
        curl_easy_setopt(curl_handle, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(curl_handle, CURLOPT_SSL_VERIFYPEER, 0L); // Bypass SSL cert issues common on NAS

        res = curl_easy_perform(curl_handle);

        if (res != CURLE_OK) {
            fprintf(stderr, "[ERROR] Fetch failed: %s\n", curl_easy_strerror(res));
        } else {
            printf("[SUCCESS] Retrieved %lu bytes from %s\n", (long)chunk.size, url);
            
            // Save to file for extension to read
            FILE *fp = fopen("proxies.html", "w");
            if (fp) {
                fwrite(chunk.memory, 1, chunk.size, fp);
                fclose(fp);
                printf("[*] Saved proxy list to nas_proxy/proxies.html\n");
            } else {
                perror("Error saving file");
            }
        }

        curl_easy_cleanup(curl_handle);
        free(chunk.memory);
    }
    return 0;
}

int main() {
    curl_global_init(CURL_GLOBAL_ALL);
    
    printf("[*] Running NAS Proxy Scraper...\n");
    fetch_proxy_list("https://www.freeproxy.world/?type=&anonymity=&country=CN&speed=1500");
    
    curl_global_cleanup();
    return 0;
}
