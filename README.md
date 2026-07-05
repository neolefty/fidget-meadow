# fidget-meadow

A cozy multiplayer grid world for in-person gatherings — shared low-stress
fidgeting for people who are catching up around a table.

Born from a family birthday tradition: trivia goes around the table, and
everyone keeps their hands busy between turns — a puzzle, a doodle, an ADHD
toy. This is the digital version of that: a safe 2D pixel-art world where each
player putters at simple activities (push a soccer ball into a goal, plant and
tend a garden), sees friends and family wandering nearby, and can be
interrupted at any moment by a group activity that pops up for everyone at
once — often just instructions for something to do *away from the screen*.

**Design in one sentence:** the app serves the room, not the other way around.

## Status

Early development. See [docs/ROADMAP.md](docs/ROADMAP.md) for where things
stand and [docs/VISION.md](docs/VISION.md) for the full pitch.

## Tech

TypeScript throughout. React + PixiJS client, hand-rolled Node/`ws` server
(server-authoritative, small JSON protocol), SQLite persistence, single Docker
container for self-hosting. Details in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Development

This project is built incrementally with AI coding agents across many small
sessions. [AGENTS.md](AGENTS.md) describes the working style; `NEXT.md` always
says what the next session should do.

## License

MIT
