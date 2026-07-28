# [Investigation] HLS Streaming Stalls Through a VMess Proxy (Criterion Channel / JustMySocks)

**Date:** 2026-07-28
**Status:** concluded — network-path diagnosis confirmed by measurement; player-side
mechanisms sourced from specs and browser internals where available.
**Scope:** Criterion Channel (HLS, Vimeo-based player, Widevine DRM) watched through a
JustMySocks (JMS) VMess endpoint via mihomo/Clash Verge on macOS.

## The question

Four observations needed one explanation:

1. Why does playback stall frequently when a multi-connection speedtest shows
   "enough bandwidth"?
2. Why does it still stall after locking quality to 540p?
3. Why does the progress bar show buffered video ahead while playback is stuck?
4. What fixes it — and does Shadowrocket support the QUIC-based proxy protocols
   (Hysteria2, TUIC) that are supposed to tolerate lossy paths better?

## Short answer

The stalls are **freeze-driven, not bandwidth-driven**. The tunnel path between this
machine and the JMS exit stops delivering bytes entirely for 7–14 seconds at a time;
between freezes the average throughput (4–9.5 Mbps single-stream) is comfortably above
the ~2 Mbps a 540p HLS rendition needs. A speedtest does not see this because speedtests
saturate the link with many parallel connections to multiple servers and report the
aggregate (Ookla methodology, see citations below); an HLS player fetches segments
sequentially over effectively one TCP stream, and that stream freezes dead.

During the measurement window the setup also had **two VPN clients stacked** (system
VPN Shadowrocket plus mihomo), so the VMess flow was likely TCP-over-TCP squared —
the classic "TCP meltdown" configuration, where nested retransmission timers turn
small packet loss into multi-second stalls. The buffered-bar paradox is a separate,
player-side set of mechanisms: buffer holes, rendition-switch boundaries, demuxed
audio/video tracks, and DRM key waits — all of which show "buffered" ranges that the
decoder cannot actually play through.

Remedies, in order of leverage: de-stack the VPN clients, benchmark nodes and
time-of-day with a single-stream freeze detector (`bin/stream-check --watch`), test
the JMS Shadowsocks endpoints against the VMess ones, and — if the path stays lossy —
move to a QUIC-based protocol (Hysteria2/TUIC) on your own VPS, which converts loss
into fast probes instead of multi-second freezes. Shadowrocket supports both
Hysteria2 and TUIC (verified on the developer's page).

## The evidence

All measurements taken 2026-07-28 on macOS; cited as "session measurement, 2026-07-28".
The tool that produced the throughput/freeze numbers is `bin/stream-check` in this repo.

| #   | Measurement                                                                                                    | Result                                                                                                | Interpretation                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Single TCP stream through local VMess proxy (mihomo, port 7897), 20MB object from speed.cloudflare.com, 3 runs | ~7.5–9.5 Mbps                                                                                         | Raw single-stream capacity is above every relevant HLS bitrate up to 1080p                                      |
| 2   | 8 parallel streams through the same proxy                                                                      | Aggregate ~5 Mbps; several runs timed out at 90s                                                      | **No scaling with parallelism** — the bottleneck is the tunnel path itself, not per-connection TCP dynamics     |
| 3   | TTFB to criterionchannel.com via proxy                                                                         | 1.1–1.9s (vs ~0.7s through the other tunnel)                                                          | High and variable latency on the VMess path                                                                     |
| 4   | Freeze sampling (1s granularity, 40MB download), run A                                                         | 8 Mbps avg, zero seconds below the ~0.3MB/s 540p threshold                                            | Path can be clean                                                                                               |
| 5   | Freeze sampling, run B (same day, later)                                                                       | 26 of 73 seconds below the 540p threshold; longest stretch 14s; avg 4 Mbps                            | **Stalls are freezes** — flow stops dead for 7–14s while the average stays fine                                 |
| 6   | DNS state during the session                                                                                   | `scutil --dns` showed Shadowrocket's fake-ip resolver 198.18.0.2 active while mihomo was also running | The "direct" path was itself tunneled; the VMess flow was likely **double-encapsulated** (TCP-over-TCP squared) |

(session measurements 1–6, 2026-07-28; measurement 7 below: Shadowrocket bundle ID
`com.liguangming.Shadowrocket` confirmed via `scutil --nc list`.)

Conclusion from the table: average throughput was never the problem. Run B's average
(4 Mbps) is double what 540p needs, yet more than a third of the seconds could not
sustain 540p, with a single 14-second dead stretch. No player buffer of reasonable
size survives a 14-second hole.

## Why it happens

### 1. Speedtests measure aggregate parallel throughput; video needs one steady stream

Ookla's own methodology states that Speedtest "dynamically scales the number of
connections to multiple servers, in order to saturate" the link and overcome effects
like TCP slow start ([Ookla Speedtest Methodology](https://www.ookla.com/resources/guides/speedtest-methodology)).
That design is correct for measuring _capacity_, but it hides exactly the failure mode
that breaks streaming: a path that delivers 50 Mbps in aggregate across 16 connections
can still freeze any single connection for seconds at a time. HLS, by contrast, is
sequential: the client downloads the playlist, then "downloads and plays each Media
Segment declared within it" ([RFC 8216, Section 2](https://www.rfc-editor.org/rfc/rfc8216.html#section-2)).
A freeze in the active segment download translates directly into a stall once the
buffer drains. Session measurement #2 confirms the proxy path gains nothing from
parallelism, so a parallel speedtest of it is doubly misleading.

### 2. TCP-over-TCP ("TCP meltdown"): nested retransmission turns small loss into freezes

VMess over TCP tunnels the browser's TCP connections inside another TCP connection.
OpenVPN's documentation names the resulting pathology directly: "TCP Meltdown occurs
when TCP traffic is tunneled over TCP," producing "performance issues due to
overcompensating retransmissions," and its remedy is "use UDP for the tunnel"
([OpenVPN FAQ: What is TCP meltdown?](https://openvpn.net/faq/what-is-tcp-meltdown/)).
Mechanism: when a packet is lost on the tunneled path, the _outer_ TCP retransmits on
its own timer; the _inner_ TCP only sees an RTT spike and eventually fires its own,
independent retransmission of the same data. The two layers back off independently and
pile delay on delay, so a single-digit loss rate becomes multi-second delivery stalls
on the inner flow — the 7–14s freezes in session measurement #5. During the session
the VMess client traffic was itself routed through a second system VPN (measurement
#6), plausibly nesting the encapsulation one level deeper and compounding the effect.

### 3. TLP is sender-side — no browser extension can add it to the player

TCP's modern answer to tail freezes is the Tail Loss Probe: instead of waiting out a
full retransmission timeout, "the sender schedules a loss probe timeout (PTO) to
transmit a segment" and uses the returning ACK to trigger fast recovery
([RFC 8985, Section 7.2](https://www.rfc-editor.org/rfc/rfc8985.html#section-7.2)).
Every sentence of RFC 8985's TLP algorithm (Section 7) is about what _the sender_ does.
The receiver of the video flow — the CDN's TCP stack on the far side of the tunnel —
is outside local control, and the browser's own receiving stack does not send probes.
A Chrome extension sits even further away: the MV3 extension API surface
([Chrome extension API reference](https://developer.chrome.com/docs/extensions/reference/api))
exposes DOM, declarativeNetRequest, storage, and similar page-level APIs — nothing
that tunes TCP retransmission behavior for media connections. So the stall-recovery
extension built here (`stall_guard/`) works at the only layer it can: the
HTMLMediaElement.

### 4. QUIC's PTO is the same idea, but both endpoints are in userspace — and replaceable

QUIC replaced RTO and TLP with a single Probe Timeout mechanism: "Probe Timeout
Replaces RTO and TLP" ([RFC 9002, Section 4.7](https://www.rfc-editor.org/rfc/rfc9002.html#section-4.7)).
A PTO "triggers the sending of one or two probe datagrams" when an acknowledgment is
overdue, and a PTO expiry does not collapse the congestion window
([RFC 9002, Section 6.2](https://www.rfc-editor.org/rfc/rfc9002.html#section-6.2)).
The operational consequence for proxying: QUIC runs over UDP and its loss recovery
lives in the proxy client and server processes themselves, so a QUIC-based proxy
protocol converts path loss into fast probes at tunnel scope instead of letting an
outer TCP connection freeze every inner flow. This is the transport-level argument
for Hysteria2/TUIC over VMess-TCP on a lossy path.

### 5. Hysteria2: QUIC/UDP, "Brutal" congestion control, masquerade and obfuscation

From the official docs ([Hysteria 2](https://v2.hysteria.network/),
[Full Client Config](https://v2.hysteria.network/docs/advanced/Full-Client-Config/)):

- QUIC-based over UDP (`transport: type: udp`), explicitly "designed to deliver
  unparalleled performance over unreliable and lossy networks"; the protocol
  "masquerades as standard HTTP/3 traffic."
- The optional **Brutal** congestion control sends at a user-declared bandwidth
  (`bandwidth: up/down`) rather than probing for capacity. The docs warn to
  "be very careful not to exceed the maximum bandwidth that your current network
  can support" — an inflated value "will backfire, causing network congestion and
  unstable connections." So the bandwidth value must be set honestly on both ends.
- Anti-censorship extras: Salamander obfuscation, which "scrambles every packet
  into seemingly random bytes," and port hopping (`hopInterval`).

### 6. TUIC v5: QUIC-based, 0-RTT, no aggressive congestion control, no obfuscation layer

From the official protocol repo ([EAimTY/tuic](https://github.com/EAimTY/tuic)):
TUIC is a standardized proxy protocol for relaying TCP and UDP over QUIC, with
"Proxying TCP and UDP traffic in 0-RTT" as a stated design goal and "Bidirectional
user-space congestion control" among the QUIC features it leverages. The spec and
README define no custom aggressive congestion controller (contrast Hysteria2's
Brutal) and no obfuscation/masquerade layer — TUIC is the gentler, simpler option;
Hysteria2 is the one with the loss-defying send rate and the censorship armor.

### 7. Client support: Shadowrocket speaks Hysteria2 and TUIC

The developer's page lists supported protocols: "Shadowsocks, ShadowsocksR, Snell,
Relay, GFW.Press, Vmess, VLESS, Lua, Socks5, SSocks5, HTTP, HTTPS, Trojan, HTTP2,
Brook, Hysteria, **Hysteria2, TUIC, Juicity, WireGuard**"
([liguangming.com/Shadowrocket](https://liguangming.com/Shadowrocket)). The machine
in question runs Shadowrocket (bundle ID `com.liguangming.Shadowrocket`, session
measurement #7), so no client change is needed to trial QUIC-based protocols. mihomo
(the Clash Verge core already in use) also implements both — it appears in the TUIC
repo's server and client implementation tables ([EAimTY/tuic](https://github.com/EAimTY/tuic)).

### 8. JustMySocks protocol offerings — **not verified**

The claim under test was "JMS only offers Shadowsocks and VMess endpoints." This could
not be confirmed from a primary source this session. Fetching the JMS portal
(https://justmysocks.net/, 2026-07-28) returned only an announcement that s3 servers
were switched to **VLESS/Reality**, which if anything contradicts the simple version
of the claim. See Open questions.

### 9. Astrill's protocols (OpenVPN, StealthVPN, WireGuard) vs QUIC

None of Astrill's three tunnel protocols uses QUIC — but WireGuard already avoids
the meltdown mechanism (§2) for a different reason:

- **OpenVPN** speaks its own protocol over TCP or UDP; no QUIC transport exists
  upstream as of OpenVPN 2.7.0 (2026-02). That release adds epoch data keys and an
  updated packet format — groundwork toward a future QUIC transport — but no QUIC
  itself ([Help Net Security release coverage](https://www.helpnetsecurity.com/2026/02/12/openvpn-releases-version-2-7-0/)).
- **StealthVPN** is Astrill-proprietary and publicly described as an obfuscation
  layer on top of OpenVPN, so it inherits OpenVPN's transports (secondary source
  only; Astrill publishes no protocol spec — see Open questions).
- **WireGuard** is UDP-based by design and deliberately minimal: no reliable
  transport, no retransmission, no streams ([wireguard.com protocol overview](https://www.wireguard.com/protocol/)).
  Because the outer transport never retransmits, there is no outer TCP to nest
  retransmissions with — loss is handled solely by the inner (video) flow. That is
  the same anti-freeze property QUIC's PTO provides (§4), reached by subtraction
  rather than addition. What WireGuard lacks relative to QUIC (PTO probes, 0-RTT,
  connection migration, stream multiplexing) matters less for a VPN tunnel than
  for a proxy protocol.

Practical implication: for _smoothness_ (freeze behavior), Astrill WireGuard is
architecturally preferable to VMess-over-TCP; raw route quality and ISP UDP
throttling decide the outcome in practice, and both are time-varying — measure
with `bin/stream-check --watch` per Remedies rather than assuming.

### 10. Why the progress bar shows buffered video while playback is stuck

`video.buffered` (the gray bar) reports buffered _time ranges_, not playability. Four
distinct mechanisms produce "buffered but stuck":

- **Rendition-switch boundaries.** HLS Master Playlists offer Variant Streams at
  different bitrates, and "clients should switch between different Variant Streams to
  adapt to network conditions" ([RFC 8216, Section 2](https://www.rfc-editor.org/rfc/rfc8216.html#section-2);
  tags in [Section 4.3.4](https://www.rfc-editor.org/rfc/rfc8216.html#section-4.3.4)).
  After an ABR down-switch (e.g., to 540p under freezes), media already buffered from
  the _old_ rendition still shows in the bar, but the player must fetch the _new_
  rendition's segment for the current position before it can continue. If that fetch
  is mid-freeze, the bar lies to you.
- **Demuxed audio and video.** HLS allows alternate Renditions in Rendition Groups
  ([RFC 8216, Section 4.3.4.1.1](https://www.rfc-editor.org/rfc/rfc8216.html#section-4.3.4.1.1)),
  and MSE players append audio and video into separate track buffers
  ([W3C Media Source Extensions, Section 2 (definitions) and 5.3 (Track Buffers)](https://w3c.github.io/media-source/)).
  The video track can hold minutes of buffered data while the _audio_ track starves at
  the playhead — and playback waits for both.
- **Buffer holes from failed segment fetches.** A segment that failed or timed out
  during a freeze leaves a gap between buffered ranges; the ranges after the gap still
  render as "buffered" in the bar. The MSE buffered model explicitly tolerates
  discontinuous ranges and starts a new coded frame group at discontinuities
  ([W3C Media Source Extensions](https://w3c.github.io/media-source/)).
  The playhead stalls at the edge of the hole even though later content is buffered.
- **DRM key waits.** Criterion serves Widevine-encrypted HLS. In Chromium's media
  pipeline, the decrypting demuxer stream has an explicit `kWaitingForKey` state,
  entered when the decryptor reports `kNoKey` — i.e., encrypted buffers are present
  but the CDM has not yet delivered the license key
  ([media/filters/decrypting_demuxer_stream.h](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/media/filters/decrypting_demuxer_stream.h);
  `kNoKey` in [media/base/decryptor.h](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/media/base/decryptor.h)).
  A license/renewal request that crosses a tunnel freeze produces a stall with a full
  buffer bar. This state is visible as `kWaitingForKey` in `chrome://media-internals`.

## What was built in this repo

Three tools came out of the investigation:

- **`bin/stream-check`** — single-stream throughput probe with a freeze-detection
  mode. `stream-check 7897` runs 3 single-connection downloads through the local
  proxy and reports best/worst Mbps plus TTFB to criterionchannel.com.
  `stream-check --watch 7897` downloads 40MB, samples progress once per second, and
  reports how many seconds fell below the ~0.3MB/s 540p threshold and the longest
  sub-540p stretch. Verdict logic and usage are in the script header
  (`bin/stream-check`, lines 1–19). This is the tool that produced session
  measurements #1–#5; run `--watch` _during_ a stall to catch the freeze.
- **`bin/vpn-recover`** — diagnoses (and with `--fix`, repairs) the macOS fallout of
  stacked/torn-down VPN clients: stale `default` routes pointing at dead utun
  interfaces, dead tunnel-DNS servers (e.g., leftover 198.18.x.x fake-ip resolvers),
  and poisoned DNS/ARP caches (`bin/vpn-recover`, header comment). Diagnose-only by
  default; macOS-only.
- **`stall_guard/`** — a Chrome MV3 content script that detects HTML5 video stalls
  (playing, `readyState < HAVE_FUTURE_DATA`, `currentTime` not advancing for 4s) and
  seeks back to re-anchor playback at a contiguous buffered point. The rewind is
  hole-aware: when the playhead sits just past the end of a buffered range (a failed
  or timed-out segment), it rewinds only enough to land just inside that range —
  the seek itself re-triggers the missing fetch — instead of the full default 8s
  rewind (`stall_guard/content.js`, `computeResumeTime`). The header is explicit
  about the limit: "it cannot fix the network" — it shortens each stall from
  "until you notice and seek" to about 4 seconds.

## Remedies, ranked

1. **De-stack the VPN clients.** Do not run the system VPN (Shadowrocket) and mihomo
   simultaneously; nested encapsulation multiplies the TCP-over-TCP penalty
   ([OpenVPN TCP meltdown FAQ](https://openvpn.net/faq/what-is-tcp-meltdown/);
   session measurement #6). After any VPN teardown, run `bin/vpn-recover` to catch
   stale utun routes and dead tunnel DNS.
2. **Benchmark nodes and time-of-day with the freeze detector, not a speedtest.**
   `bin/stream-check --watch 7897` per JMS node, at the hours you actually watch.
   Pick the node with the fewest sub-540p seconds, not the best average. The
   measurements above show the same node swings between clean and 14s freezes within
   a day, so time-of-day matters as much as node choice (session measurements #4, #5).
3. **SS vs VMess empirical test.** JMS offers both Shadowsocks and VMess endpoints
   (unverified beyond VMess/VLESS this session — see Open questions). Shadowsocks
   carries TCP streams with its own stream cipher and no additional reliable
   transport of its own, so it removes one TCP layer relative to VMess-over-TCP
   configurations. Run `bin/stream-check --watch` against both endpoint types and
   keep the one with fewer freezes. (Mechanism claim is protocol-design-level;
   treat the empirical result as decisive.)
4. **Lock quality — as mitigation, not fix.** Pinning 540p reduces how often the
   buffer drains between freezes, but measurement #5 shows it cannot survive a 14s
   hole. Expect fewer, not zero, stalls; `stall_guard/` covers the remainder.
5. **QUIC-based protocols on your own VPS (Hysteria2 or TUIC).** The structural fix:
   move the tunnel's loss recovery into a userspace QUIC stack whose PTO probes
   replace multi-second TCP freezes ([RFC 9002, Section 6.2](https://www.rfc-editor.org/rfc/rfc9002.html#section-6.2)).
   This repo already has a VPS provisioning track to host the server side:
   `vps_user_proxy/` (X-UI panel + deployment template; see `vps_user_proxy/README.md`).
   Hysteria2 if you want the aggressive Brutal send rate and HTTP/3 masquerade —
   but set its bandwidth values honestly on both ends or stability worsens
   ([Hysteria docs](https://v2.hysteria.network/docs/advanced/Full-Client-Config/)).
   TUIC if you want the simpler, gentler variant ([EAimTY/tuic](https://github.com/EAimTY/tuic)).
   Clients are already in place: Shadowrocket supports Hysteria2, TUIC, Juicity, and
   WireGuard ([liguangming.com/Shadowrocket](https://liguangming.com/Shadowrocket)),
   and mihomo implements both server and client sides ([EAimTY/tuic](https://github.com/EAimTY/tuic)).
   Note JMS itself cannot sell you this — you need your own VPS endpoint.

## Open questions / what couldn't be verified

- **StealthVPN's construction has no primary source.** Astrill publishes no protocol
  specification; "obfuscation layer on top of OpenVPN" comes from secondary
  descriptions, so §9 states it as such. The practical consequence — it inherits
  OpenVPN's TCP/UDP transports and is not QUIC-based — is robust either way.
- **JMS protocol lineup.** The claim "JustMySocks only offers Shadowsocks and VMess"
  was not verifiable this session: the JMS knowledgebase was unreachable (404/403 on
  the KB endpoints tried), and the portal homepage returned only an announcement that
  s3 servers moved to VLESS/Reality — which suggests the lineup is broader or in
  flux. Confirm against the JMS service page behind login.
- **Double encapsulation was inferred, not proven.** Measurement #6 (fake-ip DNS
  visible while mihomo ran) strongly suggests the VMess flow rode inside the system
  VPN's tunnel, but the actual packet path was not captured. A `tcpdump`/route
  comparison with only one client up would settle it; so would repeating measurement
  #5 after de-stacking — if freezes shorten materially, the nesting was contributing.
- **Which player-side mechanism caused each observed stall.** The four "buffered but
  stuck" mechanisms are all sourced, but they were not individually correlated with
  specific stalls during the session. `chrome://media-internals` during a stall
  (`kWaitingForKey`, per-track buffering states) would disambiguate.
- **TUIC "no obfuscation" is an absence-of-evidence claim.** The spec/README define
  no obfuscation layer, but no exhaustive search of third-party TUIC implementations
  was done.
- **No-API claim for Chrome extensions.** The extension API index was consulted, but
  "no way to tune TCP retransmission" is proven by absence in the documented surface,
  not by an explicit statement from Google.
- **Titz essay unavailable.** The classic 2001 write-up "Why TCP Over TCP Is A Bad
  Idea" (Olaf Titz) is widely cited but the original host is offline (site returns
  placeholder content as of 2026-07-28); the OpenVPN FAQ is used as the live
  authoritative reference instead.
- **Widevine license-request behavior under freeze not measured.** Whether Criterion's
  player hits key-renewal waits often enough to matter is unmeasured; inferred from
  the existence of the Chromium `kWaitingForKey` path, not from observed logs.
