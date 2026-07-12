# Next session

**Milestone:** M3 leftover (join screen) → M4 — Feels good on a phone
(docs/ROADMAP.md)

## The task

A join screen: pick a name and an avatar before entering the meadow.

1. The rail is already laid: `AVATAR_PLACEHOLDERS` in
   `shared/src/avatars.ts` is the hardcoded picker list and already renders
   in-world (`avatarPlaceholder` gives unknown ids a ❓ fallback). The line
   to break is in `client/src/net/socket.ts` `ws.onopen` — it hardcodes
   `{ t: "join", name: "visitor", avatar: "sprout" }`. Split "socket is
   open" from "player chose who to be": add a store status like
   `"picking"` and an exported `joinAs(name, avatar)`.
2. React (`client/src/App.tsx`): a centered form — name field + a row of
   avatar buttons showing each placeholder's emoji on its color. Big touch
   targets (≥44px; grandmothers). The overlay currently has
   `pointerEvents: "none"` — the form needs its own `pointerEvents: auto`.
3. Reconnect fast-path: a stored token should prefill (or skip) the form —
   putting the phone down mid-party must not mean re-typing your name.
   Keep the decision small; note it in DECISIONS only if it's surprising.
4. Replace the "joined as <uuid>" pill with the chosen name.
5. If the session has room, start M4 tap-to-move: send one `move` per tap
   toward the tapped tile (naive single-step is fine; A* pathing is not
   required to start). Pixi pointer events on the stage, world→tile math
   is `TILE_SIZE` × camera scale in `client/src/game/stage.ts`.

## Done means

- Fresh phone-width browser: form first, meadow after choosing; your
  picked avatar/name are what everyone else sees (upsert already handles
  it server-side — D15).
- Reload mid-walk: back in the meadow at the same spot without re-picking
  (token path), or the form prefilled — whichever you chose in (3).
- `pnpm test` green; deploy stays green.

## Current state (M3 shipped 2026-07-05, session 3)

- Movement is live: arrow keys → `move` intents → server validates
  (bounds + walkability in `server/src/world.ts`) → `pos` patches to all
  sockets (D15 sync model: one welcome snapshot, then `player` upserts +
  `pos` patches). Refused moves are silence — no wiggle.
- Players render as placeholder squares+emoji inside the Pixi world
  (`stage.ts` `syncPlayers`); camera is clamped-follow at
  `min(screenWidth/8, 64px)` per tile — verified ~48px tiles at 390px
  width, clamps at map edges, centers pre-join.
- The map moved to `shared/maps/starter-meadow.json` — single source of
  truth: server reads it from disk at boot (crashes loudly on a bad map),
  client bundles it via `@fidget/shared/maps/starter-meadow.json?raw`.
  `client/public/` is now empty.
- Spawn = path tile nearest map center, (11,7) on the starter meadow.
  Everyone stacks there until they move (BACKLOG).
- 27 tests green (shared 15, server 12). `pnpm dev` runs both sides.
- New: `.claude/skills/verify/SKILL.md` — the end-to-end recipe (scripted
  ws clients + headless-Chrome CDP keystrokes/screenshots). Use it.

## Live questions (seeds for the consult beat — AGENTS.md § Session protocol)

- **Art direction:** M4 is "feels good on a phone," and placeholders are
  deliberately charmless. When does taste get applied to avatars/tiles, and
  what's the target vibe — hand-drawn, pixel-art, emoji-forward? (Calendar-
  gated per D13: art taste-testing should start earlier than code needs it.)
- **Party integration:** should the join screen stay fully open (anyone
  types any name) or should party content (`birthday-trivia/<year>`, D5) be
  able to pre-seed expected guests/avatars?
- **Gameplay:** what does a player *do* in the meadow between activities?
  Wandering is live; the first ambient fidget-mechanic choice shapes M5+.

## Notes

- Restart the server between scripted verify runs: the world never forgets
  players (by design), so state accumulates across runs.
- Watch for a stray dev server holding :8787 (`lsof -nP -iTCP:8787`).
- Versions: TypeScript 6, Vite 8, Vitest 4, Pixi 8.19, React 19.2, pnpm 10.
