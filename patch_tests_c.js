const fs = require('fs');

let content = fs.readFileSync('nas_proxy/tests.c', 'utf8');

content = content.replace(`    fetch_tile_to_mmap("http://example.com/404", dummy_mmap, 0, &out_len);
    fetch_tile_to_mmap("invalid://schema", dummy_mmap, 0, &out_len);
    fetch_tile_to_mmap("http://example.com", dummy_mmap, 1024 * 1024, &out_len);
    add_tile_from_url(999, "http://example.com/tile");`, `    fetch_tile_to_mmap("http://example.com/404", dummy_mmap, 0, &out_len);
    fetch_tile_to_mmap("invalid://schema", dummy_mmap, 0, &out_len);
    fetch_tile_to_mmap("http://example.com", dummy_mmap, 1024 * 1024, &out_len);
    add_tile_from_url(999, "http://example.com/tile");
    // Actually curl_easy_perform on http://example.com works but might fail if internet is down.
    // To cover the failure case of curl_easy_perform reliably, we did invalid schema.
    // To cover success, we need to hit a reliable target that returns some data, or intercept it.
    // Localhost or just http://example.com. Wait, curl_easy_perform on http://example.com returns 0.
    // Why did it say "curl_easy_perform() failed: Unsupported protocol"?
    // Ah, because "invalid://schema" is unsupported!
    // And for "http://example.com", it worked, but what about write callback?
    // Wait, let's see if there is any other missing coverage in C files?
    `);

fs.writeFileSync('nas_proxy/tests.c', content);
