# Architecture

## Monorepo layout (pnpm workspaces)

```
client/   Vite + React + PixiJS. The game.
server/   Node + ws + better-sqlite3. Authoritative world.
shared/   Protocol types, grid math, activity definitions' shared bits.
tools/    Art-generation scripts and other dev utilities.
```

## Client: two layers

- **PixiJS canvas** renders the world: tile grid, sprites, avatars, small
  animations. Pixel art scales with nearest-neighbor. A thin camera follows
  the player.
- **React overlay** renders everything else: join screen (name + avatar
  picker), activity modals, host console, settings. React state and Pixi
  world both subscribe to a single client-side store fed by the socket.

Input is tap-to-move (client sends one step at a time toward the tapped tile;
server validates each step). Desktop gets arrow keys for dev convenience.

## Server: authoritative, event-driven, boring

No game loop. The server holds the world in memory, reacts to client
messages, mutates state, and broadcasts patches. Time-based mechanics (plant
growth) are computed lazily from timestamps — a seed row stores `planted_at`,
and its growth stage is derived whenever someone looks. The garden literally
grows between parties with zero server work.

Persistence is one SQLite file: `players` (token, name, avatar, position),
`objects` (x, y, kind, state JSON), `world_meta`. Snapshot-on-write via
better-sqlite3; at family scale, every write can hit the DB.

## Protocol (`shared/src/protocol.ts`)

Discriminated unions, JSON over one WebSocket. Extend the union first; the
compiler then points at every switch that needs a new case, client and server.

```ts
type ClientMsg =
  | { t: "join"; name: string; avatar: string; token?: string }
  | { t: "move"; dir: "n" | "s" | "e" | "w" }
  | { t: "interact"; x: number; y: number }
  | { t: "activity:result"; activityId: string; payload: unknown };

type ServerMsg =
  | { t: "welcome"; you: PlayerId; token: string; snapshot: WorldSnapshot }
  | { t: "patch"; players?: PlayerPatch[]; objects?: ObjectPatch[] }
  | { t: "activity:start"; activityId: string; kind: string; payload: unknown }
  | { t: "activity:end"; activityId: string }
  | { t: "toast"; text: string };
```

Reconnect: the token from `welcome` lives in localStorage; rejoining with it
resumes the same player. No other auth.

## Activity framework — the heart of the party integration

Everything interactive should be an **Activity** so one set of machinery
(triggering, modals, host console) serves all of it.

```ts
interface ActivityDef {
  id: string;                       // "three-words", "jigsaw-race", "garden"
  title: string;
  scope: "personal" | "group";      // group = modal for everyone at once
  triggers: Trigger[];              // how it can start (see below)
  component: React.ComponentType<ActivityProps>;  // modal/panel content
  resolve?: ServerResolver;         // optional server-side rule logic
}
```

**Triggers:** `tile` (step on it), `object` (interact with it), `host`
(button in the host console), `schedule` (e.g. every 45 min). The birthday
person triggering "Three Words" for the whole table is
`{ scope: "group", triggers: ["host"] }`.

**Group activity lifecycle:** host/trigger fires → server broadcasts
`activity:start` → every client shows the modal → optional timer or
ready-gate → `activity:end`. Critically, **a group activity's component may
be nothing but instructions for an in-person game** plus a done button. That
is a feature, not a stub: the whole point is handing attention back to the
table. Digital-only activities use the same machinery.

**Personal activities** (pushing puzzles, gardening) mostly live in-world
rather than in modals, but register the same way so the host console can see
and, where sensible, spotlight them ("Bill is 2 moves from solving the egg
puzzle").

## Host console

A `/host` route guarded by a shared secret (env var, printed at server
start). Shows who's online, buttons to trigger any host-triggerable activity,
a free-text toast broadcast, and a "pause world" switch. This is the in-person
control surface for the birthday person or MC.

## Art pipeline

Image models don't emit true pixel art, so we fake it deterministically:

1. `tools/gen-sprite.ts --id soccer-ball --prompt "a soccer ball" --size 32`
2. Calls the image API with a style-lock prefix (flat 2D game sprite, plain
   background, limited warm palette, centered subject) at high resolution.
3. Downscales with nearest-neighbor to the target grid size, quantizes to the
   project palette, writes `client/public/sprites/soccer-ball.png`, and
   updates `sprites/manifest.json`.

Until a sprite exists, the client renders its id as a colored rounded square
with an emoji (`soccer-ball` → ⚽ on green). The emoji fallback is charming
enough to ship a party with — art is never a blocker. Family-photo avatars
are a maybe-later (see BACKLOG); described avatars ("round white-haired
grandmother in a blue dress") are the plan of record.

## Deployment

One Docker image: Node server serving the built client statically plus the
WebSocket on the same port. docker-compose on the basement server, behind the
existing reverse proxy for TLS (WebSocket upgrade must be passed through).
SQLite file on a volume. A QR code pointing at the public URL is the entire
onboarding flow.

## Party content vs. game

The game (this repo, open source) is configured by content: map JSON, activity
roster, avatar list, trivia/prompt text. Family-specific content lives in the
private `birthday-trivia` repo (year folders) and is mounted/loaded as config.
Keep that boundary clean — it's what makes the project forkable.
