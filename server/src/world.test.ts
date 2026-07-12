import { describe, expect, it } from "vitest";
import { parseMeadowMap, type MeadowMap } from "@fidget/shared";
import { createWorld, join, move, snapshot, type IdGenerator } from "./world";

/** Deterministic id generator: "id-0", "id-1", ... */
function sequentialIds(): IdGenerator {
  let n = 0;
  return () => `id-${n++}`;
}

// 5×4 test meadow: hedge ring, path column at x=2, water at (1,2),
// flowerbed at (3,2). Spawn resolves to the path tile (2,1).
function testMap(rows: string[] = ["hhhhh", "hgpgh", "hwpfh", "hhhhh"]): MeadowMap {
  const map = parseMeadowMap(JSON.stringify({ rows }));
  if (map === null) throw new Error("test map failed to parse");
  return map;
}

describe("createWorld", () => {
  it("spawns on the path tile nearest the map center", () => {
    expect(createWorld(testMap()).spawn).toEqual({ x: 2, y: 1 });
  });

  it("refuses a map with no path tile", () => {
    expect(() => createWorld(testMap(["gg", "gg"]))).toThrow(/no path tile/);
  });
});

describe("join", () => {
  it("gives a new player an id, a token, and the spawn position", () => {
    const world = createWorld(testMap(), sequentialIds());
    const { player, isReconnect } = join(world, { name: "Bill", avatar: "grandpa" });

    expect(isReconnect).toBe(false);
    expect(player.id).toBe("id-0");
    expect(player.token).toBe("id-1");
    expect(player.name).toBe("Bill");
    expect(player.avatar).toBe("grandpa");
    expect(player.x).toBe(2);
    expect(player.y).toBe(1);
  });

  it("gives distinct players distinct ids and tokens", () => {
    const world = createWorld(testMap(), sequentialIds());
    const a = join(world, { name: "Ann", avatar: "cat" }).player;
    const b = join(world, { name: "Ben", avatar: "dog" }).player;

    expect(a.id).not.toBe(b.id);
    expect(a.token).not.toBe(b.token);
    expect(world.players.size).toBe(2);
  });

  it("resumes the same player when rejoining with a known token", () => {
    const world = createWorld(testMap(), sequentialIds());
    const first = join(world, { name: "Ann", avatar: "cat" }).player;
    move(world, first, "south"); // wandered off before putting the phone down

    const { player, isReconnect } = join(world, {
      name: "Annie", // re-picked name on the join screen
      avatar: "cat",
      token: first.token,
    });

    expect(isReconnect).toBe(true);
    expect(player.id).toBe(first.id);
    expect(player.token).toBe(first.token);
    expect(player.name).toBe("Annie");
    expect(player.x).toBe(2);
    expect(player.y).toBe(2);
    expect(world.players.size).toBe(1);
  });

  it("treats an unknown token as a fresh join", () => {
    const world = createWorld(testMap(), sequentialIds());
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
    const world = createWorld(testMap());
    const a = join(world, { name: "Ann", avatar: "cat" }).player;
    expect(a.id).not.toBe(a.token);
    expect(a.id.length).toBeGreaterThan(0);
  });
});

describe("move", () => {
  it("walks onto path, grass, and flowerbed", () => {
    const world = createWorld(testMap(), sequentialIds());
    const player = join(world, { name: "Ann", avatar: "cat" }).player;

    expect(move(world, player, "south")).toBe(true); // path (2,2)
    expect(move(world, player, "east")).toBe(true); // flowerbed (3,2)
    expect([player.x, player.y]).toEqual([3, 2]);
  });

  it("refuses hedge and water, leaving the player in place", () => {
    const world = createWorld(testMap(), sequentialIds());
    const player = join(world, { name: "Ann", avatar: "cat" }).player;

    expect(move(world, player, "north")).toBe(false); // hedge (2,0)
    move(world, player, "south");
    expect(move(world, player, "west")).toBe(false); // water (1,2)
    expect([player.x, player.y]).toEqual([2, 2]);
  });

  it("refuses to walk off the map", () => {
    const world = createWorld(testMap(["pp"]), sequentialIds());
    const player = join(world, { name: "Ann", avatar: "cat" }).player;

    expect(player.y).toBe(0);
    expect(move(world, player, "north")).toBe(false);
    expect(move(world, player, "west")).toBe(false);
    expect([player.x, player.y]).toEqual([0, 0]);
  });
});

describe("snapshot", () => {
  it("contains every player, without tokens", () => {
    const world = createWorld(testMap(), sequentialIds());
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
    expect(snapshot(createWorld(testMap())).players).toEqual([]);
  });
});
