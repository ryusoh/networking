CC = gcc
CFLAGS = -O3 -Wall -fPIC
LDFLAGS = -lcurl
TARGET = tile_storage
SCRAPER_TARGET = proxy_scraper
POOL_TARGET = conn_pool
MONITOR_TARGET = proxy_monitor
TEST_TARGET = tests
LIB_TARGET = libtilestorage.so

all: $(TARGET) $(LIB_TARGET) $(SCRAPER_TARGET) $(POOL_TARGET) $(MONITOR_TARGET)

$(TARGET): tile_storage.c tile_fetcher.c
	$(CC) $(CFLAGS) -DBUILD_TILE_STORAGE_TEST -o $(TARGET) tile_storage.c tile_fetcher.c $(LDFLAGS)
	chmod +x $(TARGET)

$(LIB_TARGET): tile_storage.c tile_fetcher.c
	$(CC) $(CFLAGS) -shared -o $(LIB_TARGET) tile_storage.c tile_fetcher.c $(LDFLAGS)

$(SCRAPER_TARGET): proxy_scraper.c
	$(CC) $(CFLAGS) -o $(SCRAPER_TARGET) proxy_scraper.c $(LDFLAGS) -lpthread
	chmod +x $(SCRAPER_TARGET)

$(POOL_TARGET): conn_pool.c
	$(CC) $(CFLAGS) -o $(POOL_TARGET) conn_pool.c -lpthread
	chmod +x $(POOL_TARGET)

$(MONITOR_TARGET): proxy_monitor.c
	$(CC) $(CFLAGS) -o $(MONITOR_TARGET) proxy_monitor.c -lpthread
	chmod +x $(MONITOR_TARGET)

$(TEST_TARGET): tests.c tile_storage.c tile_fetcher.c
	$(CC) $(CFLAGS) -DTEST_MAIN -o $(TEST_TARGET) tests.c tile_storage.c tile_fetcher.c $(LDFLAGS)
	chmod +x $(TEST_TARGET)

test: $(TEST_TARGET)
	@./$(TEST_TARGET)

clean:
	rm -f $(TARGET) $(LIB_TARGET) $(SCRAPER_TARGET) $(POOL_TARGET) $(MONITOR_TARGET) $(TEST_TARGET) tile_storage.bin

.PHONY: all clean test
