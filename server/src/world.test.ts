import { describe, expect, it } from "vitest";
import { createWorld, join, snapshot, type IdGenerator } from "./world";

/** Deterministic id generator: "id-0", "id-1", ... */
function sequentialIds(): IdGenerator {
  let n = 0;
  return () => `id-${n++}`;
}

describe("join", () => {
  it("gives a new player an id, a token, and a spawn position", () => {
    const world = createWorld(sequentialIds());
    const { player, isReconnect } = join(world, { name: "Bill", avatar: "grandpa" });

    expect(isReconnect).toBe(false);
    expect(player.id).toBe("id-0");
    expect(player.token).toBe("id-1");
    expect(player.name).toBe("Bill");
    expect(player.avatar).toBe("grandpa");
    expect(player.x).toBe(0);
    expect(player.y).toBe(0);
  });

  it("gives distinct players distinct ids and tokens", () => {
    const world = createWorld(sequentialIds());
    const a = join(world, { name: "Ann", avatar: "cat" }).player;
    const b = join(world, { name: "Ben", avatar: "dog" }).player;

    expect(a.id).not.toBe(b.id);
    expect(a.token).not.toBe(b.token);
    expect(world.players.size).toBe(2);
  });

  it("resumes the same player when rejoining with a known token", () => {
    const world = createWorld(sequentialIds());
    const first = join(world, { name: "Ann", avatar: "cat" }).player;
    first.x = 5; // pretend she wandered off before putting the phone down
    first.y = 7;

    const { player, isReconnect } = join(world, {
      name: "Annie", // re-picked name on the join screen
      avatar: "cat",
      token: first.token,
    });

    expect(isReconnect).toBe(true);
    expect(player.id).toBe(first.id);
    expect(player.token).toBe(first.token);
    expect(player.name).toBe("Annie");
    expect(player.x).toBe(5);
    expect(player.y).toBe(7);
    expect(world.players.size).toBe(1);
  });

  it("treats an unknown token as a fresh join", () => {
    const world = createWorld(sequentialIds());
    const { player, isReconnect } = join(world, {
      name: "Ben",
      avatar: "dog",
      token: "stale-token-from-last-year",
    });

    expect(isReconnect).toBe(false);
    expect(player.token).not.toBe("stale-token-from-last-year");
    expect(world.players.size).toBe(1);
  });

  it("uses crypto-random ids by default", () => {
    const world = createWorld();
    const a = join(world, { name: "Ann", avatar: "cat" }).player;
    expect(a.id).not.toBe(a.token);
    expect(a.id.length).toBeGreaterThan(0);
  });
});

describe("snapshot", () => {
  it("contains every player, without tokens", () => {
    const world = createWorld(sequentialIds());
    join(world, { name: "Ann", avatar: "cat" });
    join(world, { name: "Ben", avatar: "dog" });

    const snap = snapshot(world);
    expect(snap.players).toHaveLength(2);
    expect(snap.players.map((p) => p.name).sort()).toEqual(["Ann", "Ben"]);
    for (const p of snap.players) {
      expect(p).not.toHaveProperty("token");
    }
  });

  it("is empty for a fresh world", () => {
    expect(snapshot(createWorld()).players).toEqual([]);
  });
});
