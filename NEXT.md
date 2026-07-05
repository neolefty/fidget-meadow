# Next session

**Milestone:** M1 — Walking skeleton (docs/ROADMAP.md)

## The task

Scaffold the pnpm monorepo and get one protocol message round-tripping:

1. Root: `pnpm-workspace.yaml`, root `package.json` with a `dev` script that
   runs client + server concurrently, shared `tsconfig.base.json`
   (strict: true), `.gitignore` already exists.
2. `shared/`: `src/protocol.ts` with the `ClientMsg`/`ServerMsg` unions from
   docs/ARCHITECTURE.md (start with just `join` / `welcome` / `toast`).
   Vitest configured; one trivial test asserting a message parses.
3. `server/`: Node + `ws` + `tsx` dev runner. On `join`, reply `welcome` with
   a generated player id/token (in-memory only — no SQLite yet, that's M5).
4. `client/`: Vite + React + TS. Render a PixiJS canvas with a colored
   rectangle, connect the socket, send `join`, display the `welcome` player
   id in a React overlay. Ugly is correct at this stage.
5. `Dockerfile` that builds client + server and runs the server serving the
   static client. Compose file can wait for M6.

## Done means

- `pnpm dev` → browser at the Vite URL shows the rectangle and "joined as
  <id>" text proving the round-trip.
- `pnpm test` green. `docker build .` succeeds.

## Downward slope for the end of that session

Start M2 before stopping: sketch `shared/src/map.ts` (tile kind enum + map
JSON type) and leave a `// next: render this in the Pixi layer` note. Then
rewrite this file.

## Notes

- First session in the scaffolded repo — also make the initial git commit(s)
  if M0's docs are still uncommitted.
- Keep versions current-stable: PixiJS 8.x, Vite latest, pnpm workspaces.
