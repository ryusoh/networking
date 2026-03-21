CC      ?= gcc
CFLAGS  ?= -O3 -Wall -Wextra
LDFLAGS  = -lpthread

TARGETS = lan_scanner wol netmon

all: $(TARGETS)

lan_scanner: lan_scanner.c
	$(CC) $(CFLAGS) -o $@ $< $(LDFLAGS)

wol: wol.c
	$(CC) $(CFLAGS) -o $@ $<

netmon: netmon.c
	$(CC) $(CFLAGS) -o $@ $< -lm

clean:
	rm -f $(TARGETS)

.PHONY: all clean
