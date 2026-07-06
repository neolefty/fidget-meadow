# Next session

**Milestone:** M3 — People in the world (docs/ROADMAP.md)

## The task

Server-authoritative movement, visible to everyone.

1. The rail is already laid: `{ t: "move", dir }` exists in
   `shared/src/protocol.ts` (parsed + tested) and the server *ignores it* —
   that's the half-built sentence to finish. Extend `ServerMsg` with a
   patch/broadcast shape (e.g. `{ t: "pos"; id; x; y }` or a small patch
   union — your call, record it in DECISIONS if it's load-bearing).
2. `server/src/world.ts`: give players real positions on the map (spawn on a
   path tile, not water/hedge), apply `move` with bounds + walkability
   checks (`hedge`/`water` block; `MeadowMap` is in shared). The server
   needs to load the map too — move/share `starter-meadow.json` so both
   sides read the same file (it lives in `client/public/` today).
3. Client: `socket.ts` handles the new patch message into the store; Pixi
   subscribes (`subscribe`/`getState`, same store React uses) and renders
   players as placeholder squares+emoji via `makePlaceholder`
   (`client/src/game/placeholder.ts`). Arrow keys send `move` — tap-to-move
   is M4, don't start it.
4. Join screen (name + avatar picker from a hardcoded list) if the session
   has room; otherwise it rolls to M4 alongside phone feel. Reconnect
   tokens already work (D7).

## Done means

- Two browser windows see each other walk around live; walking into hedge
  or pond does nothing (server refused, client shows no wiggle).
- `pnpm test` green: movement rules (bounds, walkability, spawn) tested in
  `world.test.ts`; new protocol cases tested in `protocol.test.ts`.
- Deploy stays green.

## Current state (M2 shipped 2026-07-05, session 2)

- The meadow renders from `client/public/starter-meadow.json` (rows of
  single-char tile codes — D14) at phone and desktop width; editing the
  JSON changes the world on reload; a bogus map degrades to background +
  console.error, no crash. Verified with headless-Chrome screenshots.
- `parseMeadowMap` + `TILE_CHARS` live in `shared/src/map.ts`, tested.
  `MeadowMap.objects` still deliberately absent until M7.
- `client/src/game/placeholder.ts` → `makePlaceholder(ph, size)` is the
  reusable colored-square+emoji builder; `stage.ts` bakes one texture per
  tile kind via `generateTexture` and reuses sprites. Avatars should use
  the same helper.
- Camera is whole-map-fit, fixed, in `stage.ts` (`layout()`); clamped
  follow becomes possible once players have positions this session.
- 17 tests green (shared 10, server 7). `pnpm dev` runs both sides; Vite
  proxies `/ws` to :8787.

## Notes

- Versions: TypeScript 6, Vite 8, Vitest 4, Pixi 8.19, React 19.2, pnpm 10.
- Watch for a stray dev server already holding :8787 (one was alive on
  Bill's machine this session — `lsof -nP -iTCP:8787` before `pnpm dev`).
- Emoji rendering varies per platform; that's a BACKLOG item, not a derail.
