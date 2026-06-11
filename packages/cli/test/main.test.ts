import { test } from "node:test";
import assert from "node:assert/strict";

import { main, type Io } from "../src/main.js";

function capture(): { io: Io; out: () => string; err: () => string } {
  let out = "";
  let err = "";
  return {
    io: { out: (t) => (out += t), err: (t) => (err += t) },
    out: () => out,
    err: () => err,
  };
}

test("no arguments prints help and exits 0", () => {
  const c = capture();
  assert.equal(main([], c.io), 0);
  assert.match(c.out(), /Usage: aigenticdocs <command>/);
});

test("--version prints a semver-looking version and exits 0", () => {
  const c = capture();
  assert.equal(main(["--version"], c.io), 0);
  assert.match(c.out(), /^\d+\.\d+\.\d+/);
});

test("unknown command reports an error and exits 1", () => {
  const c = capture();
  assert.equal(main(["frobnicate"], c.io), 1);
  assert.match(c.err(), /unknown or not yet implemented command 'frobnicate'/);
  assert.equal(c.out(), "");
});
