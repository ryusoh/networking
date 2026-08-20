# Tiered image serving — evaluated, deliberately skipped

Adapted evaluation of the `ryusoh.github.io` tiered-image-serving pattern
(sharp pipeline emitting full/768w/1200w AVIF+WebP tiers plus ThumbHash
placeholders, wired to `<picture>` srcsets) against this repo. **Decision:
skip — nothing in this repo serves repo-owned images over HTTP/HTML under our
control.**

## Evidence (measured 2026-08-20, `git ls-files` + `stat -f%z`)

| Candidate surface                                                         | Verdict                                                                                                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| GitHub Pages / docs site                                                  | None: no `CNAME`, no `_config.yml`, no `mkdocs.yml`, no Pages deploy in `.github/workflows/`.                                              |
| Tracked HTML (794 files)                                                  | 792 are vendored Doxygen docs under `research/cs234-advanced-networks/03-homework/hw01/gpac-temp/` (third-party fixture — do not touch).   |
| First-party HTML                                                          | `adblock/popup.html` (no `<img>`, packaged UI) and `gov_bypass/offscreen.html` (script-only) — loaded via `chrome-extension://`, not HTTP. |
| Extension icons (`adblock/assets/`, `stall_guard/assets/`, `gov_bypass/`) | Packaged into the extension and loaded locally (16/48/128 px PNGs; largest 313,384 B); never HTTP-served.                                  |
| `assets/background.jpg` (1,675,559 B)                                     | Referenced only by `README.md:1`; rendered by GitHub's markdown viewer via camo — markup and serving are GitHub's, not ours.               |
| `research/cs23*-*/**` figures (~5.2 MB total)                             | Coursework artifacts (e.g. `markov.png` 86,870 B, `ui.png` 55,137 B) viewed through GitHub's file browser; not a serving surface we own.   |
| `nas_proxy/cache_proxy.py`, `nas_proxy/tile_cache.py` (`http.server`)     | CONNECT proxy / upstream map-tile cache — they relay upstream bytes, serve no repo images, and render no HTML UI.                          |

## Why the pattern does not adapt

- The pattern's payoff is responsive `<picture>` markup at a load site we
  control. The only web-rendered image (`README.md` hero) is served by GitHub
  from markdown we cannot attach srcsets to, and camo does not rewrite
  `srcset`, so tiered markup there is both unsupported and unverifiable.
- `sharp` is not a devDependency (checked `package.json` /
  `package-lock.json`); adding a native build pipeline to optimize zero
  served bytes would be pure cost (see also non-negotiable #6).

## Unblock condition

If this repo ever gains a self-hosted surface that serves its own images —
a GitHub Pages site, a local web dashboard shipping repo assets, or an
extension options page with large imagery — revisit with a minimal sharp
script + `make` target + `<picture>` markup at that load site only.
