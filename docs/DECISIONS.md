# Decisions (ADR-lite)

One entry per decision: what we chose, why, what we passed on. Newest last.
Reversing a decision gets a new entry, not an edit.

## D1 — TypeScript, strict, everywhere (2026-07-05)

Client, server, shared, tools. TS types (especially discriminated-union
protocol messages) are how sessions communicate across months. No plain JS.

## D2 — PixiJS v8 canvas + React overlay (2026-07-05)

Pixi renders the world with nearest-neighbor pixel scaling; React renders
lobby, modals, host console. Passed on: Phaser (fights React, brings unused
weight), pure DOM grid (charming but caps animation/perf headroom).

## D3 — Hand-rolled Node + ws, server-authoritative (2026-07-05)

One room, JSON messages, clients send intents, server broadcasts patches.
At ≤12 players with discrete movement, a sync framework is pure overhead.
Passed on: Colyseus (idiom layer agents fight), CRDTs (wrong shape for
game rules).

## D4 — In-repo markdown tracking (2026-07-05)

NEXT.md rail + BACKLOG.md + DECISIONS.md, per AGENTS.md. Zero-auth for
agents, diffable, travels with the fork. Promote to GitHub Issues if outside
contributors materialize.

## D5 — Game repo separate from family content (2026-07-05)

fidget-meadow (this repo) is the open-source game; `birthday-trivia/<year>`
(private) holds party content that configures it. Keeps the public repo free
of family data and forces a clean content/engine boundary.

## D6 — SQLite via better-sqlite3 (2026-07-05)

One file, synchronous API, trivial backup (copy the file). A DB server is
overkill by two orders of magnitude.

## D7 — No auth: name + avatar + localStorage token (2026-07-05)

Players are trusted family on a party URL. The `welcome` token only makes
reconnect resume the same player.

## D8 — One Docker container on the basement server (2026-07-05)

Node serves static client + WebSocket on one port, behind the existing
reverse proxy. SQLite on a volume.

## D9 — Time-based mechanics computed lazily from timestamps (2026-07-05)

No server game loop, no cron. Plant growth = f(now − planted_at). The world
"grows between parties" for free and an idle server does nothing.

## D10 — MIT license (2026-07-05)

Maximally forkable, matches the "template for others" goal. Flagged in
BACKLOG for final confirmation before first publish.

## D11 — Trunk-based deploy, built on the home server (2026-07-05)

Push to `main` → GitHub Actions runs tests → ssh to the basement server →
`git reset --hard origin/main` + `docker compose up -d --build` in
`~/deploy/fidget-meadow`, health-checked on localhost:3011. Building on the
server avoids registry auth entirely. Passed on: GHCR (package-visibility
friction), self-hosted runner (one more daemon to babysit). Rollback = reset
to an older sha and rebuild.

## D12 — tsx runs the server in production, for now (2026-07-05)

No server compile step; the container runs TS directly via tsx. One less
build to keep green during M1–M5. Revisit only if startup time or memory
ever matters at family scale.

## D13 — Plan in sessions; party-ready always (2026-07-05)

Session 1 delivered M1 plus most of M6 — ~4–5 sessions of the original
40-session budget — so months are the wrong planning unit. Recalibrations:
a milestone defaults to one session (split what doesn't fit); calendar-gated
work (garden growth, art taste, real-device testing) is pulled earlier than
code dependencies require, because agent speed compresses code time but not
wall-clock time; after M8 there is no single debut — every family gathering
is a playtest of whatever exists. Surplus session budget goes to backlog
activities and charm, not schedule compression. Milestone numbers stay
stable; only their order changed.

## D14 — Map JSON is rows of single-char tile codes (2026-07-05)

The in-memory model stays the sketched `MeadowMap` (row-major `TileKind[]`),
but map *files* are `{ "rows": ["hhhh…", "hgph…", …] }` with one char per
tile (`TILE_CHARS` in shared/src/map.ts). A 24×16 meadow is 16 readable
strings you can edit in place — the M2 done-criterion ("editing the JSON
changes the world") is unusable against a 384-element word array. Passed on:
Tiled/TMX (tooling weight for a 5-tile palette), width/height + flat array
JSON (hand-hostile).
