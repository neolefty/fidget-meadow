---
name: verify
description: Build, run, and drive fidget-meadow end-to-end — real ws clients against the server plus headless-Chrome screenshots of the Pixi client.
---

# Verifying fidget-meadow changes

Two surfaces: the WebSocket protocol (server rules) and the rendered
canvas (client). Drive both; unit tests are CI's job, not verification.

## Build + run (production shape)

```bash
pnpm --filter client build          # static client → client/dist
lsof -nP -iTCP:8787 -sTCP:LISTEN    # stray dev server check (recurring on this machine)
cd server && node_modules/.bin/tsx src/main.ts &   # serves client + /ws on :8787
curl -s localhost:8787/healthz      # → ok
```

Restart the server between scripted runs — the world deliberately never
forgets players (interruptibility invariant), so state accumulates.

## Socket surface

Script real clients with the `ws` package (already a server dep; from a
scratch .mjs use `createRequire("<repo>/server/package.json")`). Join,
send intents, assert on the broadcast patches. Probe: moves before join,
junk messages, reconnect with a saved token, refused moves (expect
silence, not an error).

## Pixel surface

Headless Chrome via CDP gives real keystrokes + screenshots:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --remote-debugging-port=9222 \
  --user-data-dir=<scratch>/chrome-profile about:blank &
# then over the ws at http://localhost:9222/json:
#   Emulation.setDeviceMetricsOverride (390×700 mobile — grandma width — and 1280×800)
#   Page.navigate → http://localhost:8787, sleep ~2s for join
#   Input.dispatchKeyEvent keyDown/keyUp (ArrowRight etc.) to walk
#   Page.captureScreenshot → png
```

Run a scripted ws player alongside and screenshot the browser to prove
live multiplayer visibility without a reload.

## Gotchas

- lsof exits 1 when the port is free — that's the good case.
- Test at phone width first (AGENTS.md: the party runs on phones).
- CDP screenshots can exceed ws default payload; pass `maxPayload`.
