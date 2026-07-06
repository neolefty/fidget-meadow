import { describe, expect, it } from "vitest";
import { parseMeadowMap } from "./map";

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
