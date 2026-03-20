CC = gcc
CFLAGS = -O3 -Wall -fPIC
TARGET = tile_storage
LIB_TARGET = libtilestorage.so

all: $(TARGET) $(LIB_TARGET)

$(TARGET): tile_storage.c
	$(CC) $(CFLAGS) -DTEST_MAIN -o $(TARGET) tile_storage.c

$(LIB_TARGET): tile_storage.c
	$(CC) $(CFLAGS) -shared -o $(LIB_TARGET) tile_storage.c

clean:
	rm -f $(TARGET) $(LIB_TARGET) tile_storage.bin

.PHONY: all clean
