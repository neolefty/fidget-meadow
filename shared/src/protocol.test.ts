import { describe, expect, it } from "vitest";
import { parseClientMsg, parseServerMsg } from "./protocol";

describe("parseClientMsg", () => {
  it("parses a join message", () => {
    const raw = JSON.stringify({ t: "join", name: "Bill", avatar: "hedgehog" });
    expect(parseClientMsg(raw)).toEqual({ t: "join", name: "Bill", avatar: "hedgehog" });
  });

  it("keeps a reconnect token when present", () => {
    const raw = JSON.stringify({ t: "join", name: "Bill", avatar: "hedgehog", token: "abc" });
    expect(parseClientMsg(raw)).toEqual({ t: "join", name: "Bill", avatar: "hedgehog", token: "abc" });
  });

  it("rejects junk", () => {
    expect(parseClientMsg("not json")).toBeNull();
    expect(parseClientMsg(JSON.stringify({ t: "explode" }))).toBeNull();
    expect(parseClientMsg(JSON.stringify({ t: "join", name: 7, avatar: "x" }))).toBeNull();
  });
});

describe("parseServerMsg", () => {
  it("parses a welcome message", () => {
    const raw = JSON.stringify({
      t: "welcome",
      you: "p1",
      token: "tok",
      snapshot: { players: [] },
    });
    expect(parseServerMsg(raw)).toEqual({
      t: "welcome",
      you: "p1",
      token: "tok",
      snapshot: { players: [] },
    });
  });

  it("parses a toast and rejects junk", () => {
    expect(parseServerMsg(JSON.stringify({ t: "toast", text: "hi" }))).toEqual({ t: "toast", text: "hi" });
    expect(parseServerMsg(JSON.stringify({ t: "toast" }))).toBeNull();
  });
});
