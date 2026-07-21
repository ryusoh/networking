CC      ?= gcc
CFLAGS  ?= -O3 -Wall -Wextra
LDFLAGS  = -lpthread

TARGETS = lan_scanner wol netmon speedtest

all: $(TARGETS)

lan_scanner: lan_scanner.c
	$(CC) $(CFLAGS) -o $@ $< $(LDFLAGS)
	chmod +x $@

wol: wol.c
	$(CC) $(CFLAGS) -o $@ $<
	chmod +x $@

netmon: netmon.c
	$(CC) $(CFLAGS) -o $@ $< -lm
	chmod +x $@

speedtest: speedtest.c
	$(CC) $(CFLAGS) -o $@ $< $(LDFLAGS)
	chmod +x $@

clean:
	rm -f $(TARGETS)

.PHONY: all clean
