# Backlog — loose-end parking lot

Append one line per item: what, where it came up, why it matters. Pull items
into `NEXT.md` when a session picks them up. Groom rarely; delete freely.
An idea too rich for one line gets a file in `docs/ideas/` and a one-line
pointer here — the list stays scannable, the detail survives.

## Ideas / features

- Guinea pigs! Family pets as in-world critters with a discovery chain
  (seeds → greens → +knife → scraps → +bag rustle → off-screen meeping →
  go find them). Strong early activity-shelf item, hardcoded — see
  ideas/interaction-chains.md. (2026-07-05)
- Interaction-chain "little language": declarative format so chains are
  family content, not engine code. Post-MVP, rule of three applies — see
  ideas/interaction-chains.md. (2026-07-05)
- Sound system for M11: synth-blip placeholders, Freesound/CC0 fetch tool
  with license manifest, visual-twin captions («wheek wheek», directional).
  See ideas/audio-and-asset-materialization.md. (2026-07-05)
- Lazy asset materialization: server generates missing chain assets
  (sprites + sounds) on first encounter, content-hash cached. Post-MVP,
  paired with the little language — same ideas doc. (2026-07-05)
- Distributed-speaker ambience: server picks one phone at the table to emit
  an ambient sound. Delightful, far future — same ideas doc. (2026-07-05)
- Family-photo-derived avatars — deliberately deferred (maybe never);
  described-prompt avatars are plan of record. (M0 discussion)
- Writing-sprint activity with shared timer and optional read-aloud order
  (from daughter's writing group tradition). Instructions-card covers v1.
- Jigsaw-race activity: digital 4x4 tile-swap version of the physical game.
- Spectate/peek: tap another player to see what they're fiddling with.
- Emotes: wave, heart, confetti — low-effort social texture. (M11)
- Scheduled ambient events: bird lands on the arbor, seasonal weather.
- Trivia integration: the original tradition, as an activity — turn order,
  current question on the host console. Deliberately later; the table does
  this fine without software.
- Map editor, or keep hand-editing JSON? Decide when M2's JSON gets painful.
- Day/night or seasonal palette tied to real date of the party.

## Chores / hygiene

- Repo is published (2026-07-05) with description; still to do: topics,
  screenshots in README for discoverability. Confirm MIT is the intended
  license.
- Harden the GitHub-Actions deploy key on the home server: forced command /
  `from=` restriction in authorized_keys (currently a full shell). (M1 deploy
  setup; limits blast radius if repo secrets leak.)
- Bump actions/checkout, setup-node, pnpm/action-setup to current majors —
  CI warns they target deprecated Node 20 runners. (M1 first CI run.)
- Image-gen provider choice + API key handling for tools/ (needed by M10,
  not before).
- Accessibility pass: text size, contrast, color-blind-safe tile palette.
- Client bundle >500 kB minified (Vite warning since Pixi landed in M2) —
  code-split or raise the limit; only matters if party-wifi load feels slow.
- Emoji tile glyphs render per-platform (Pixi Text rasterizes the system
  font); check on a real iPhone/Android at the next gathering. (M2 note.)
- Avatar sprite goes stale if a reconnecting player re-picks their avatar —
  stage.ts syncPlayers only moves existing sprites; rebuild on avatar
  change. (M3; invisible until the join screen allows re-picking.)
- Everyone spawns on the same path tile, so players stack and fully occlude
  each other; consider spawn scatter or a tiny per-player offset. (M3.)
- Move rate = client key-repeat rate; no server-side rate cap. Fine for
  trusted family, revisit if a phone keyboard ever floods. (M3.)
- Desktop camera caps tiles at 64px (MAX_TILE_PX in stage.ts) — ad-hoc
  taste call to stop tiles ballooning; revisit with the art pass. (M3.)
- Movement snaps tile-to-tile, no walk tween — charm pass later. (M3.)
- Players never leave the meadow (no leave/expiry, by design for
  interruptibility) — a long party accumulates ghost avatars; revisit
  with M5 persistence. (M3.)
