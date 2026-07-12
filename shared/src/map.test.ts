import { describe, expect, it } from "vitest";
import { isWalkable, parseMeadowMap, tileAt } from "./map";

const raw = (rows: unknown): string => JSON.stringify({ rows });

describe("parseMeadowMap", () => {
  it("expands rows of tile codes into a row-major grid", () => {
    const map = parseMeadowMap(raw(["hh", "gp", "wf"]));
    expect(map).toEqual({
      width: 2,
      height: 3,
      tiles: ["hedge", "hedge", "grass", "path", "water", "flowerbed"],
    });
  });

  it("rejects junk", () => {
    expect(parseMeadowMap("not json")).toBeNull();
    expect(parseMeadowMap(raw(undefined))).toBeNull();
    expect(parseMeadowMap(raw([]))).toBeNull();
    expect(parseMeadowMap(raw([""]))).toBeNull();
    expect(parseMeadowMap(raw(["gg", 7]))).toBeNull();
  });

  it("rejects ragged rows", () => {
    expect(parseMeadowMap(raw(["ggg", "gg"]))).toBeNull();
  });

  it("rejects unknown tile codes", () => {
    expect(parseMeadowMap(raw(["gg", "gz"]))).toBeNull();
  });
});

describe("tileAt", () => {
  const map = parseMeadowMap(raw(["gp", "wh"]));

  it("reads the row-major grid", () => {
    if (map === null) throw new Error("test map failed to parse");
    expect(tileAt(map, 0, 0)).toBe("grass");
    expect(tileAt(map, 1, 0)).toBe("path");
    expect(tileAt(map, 0, 1)).toBe("water");
    expect(tileAt(map, 1, 1)).toBe("hedge");
  });

  it("returns null outside the map", () => {
    if (map === null) throw new Error("test map failed to parse");
    expect(tileAt(map, -1, 0)).toBeNull();
    expect(tileAt(map, 0, -1)).toBeNull();
    expect(tileAt(map, 2, 0)).toBeNull();
    expect(tileAt(map, 0, 2)).toBeNull();
  });
});

describe("isWalkable", () => {
  it("blocks hedge and water only", () => {
    expect(isWalkable("grass")).toBe(true);
    expect(isWalkable("path")).toBe(true);
    expect(isWalkable("flowerbed")).toBe(true);
    expect(isWalkable("water")).toBe(false);
    expect(isWalkable("hedge")).toBe(false);
  });
});
