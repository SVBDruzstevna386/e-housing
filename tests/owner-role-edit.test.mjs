import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");

function extractFunction(name) {
  const start = appSource.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Function ${name} must exist in app.js`);
  const bodyStart = appSource.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < appSource.length; index += 1) {
    if (appSource[index] === "{") depth += 1;
    if (appSource[index] === "}") depth -= 1;
    if (depth === 0) return appSource.slice(start, index + 1);
  }
  throw new Error(`Function ${name} is incomplete`);
}

const context = vm.createContext({
  state: { role: "chair" },
  REGISTERED_OWNER_ROLE_OPTIONS: [
    ["owner", "Vlastník nehnuteľnosti"],
    ["board", "Člen dozornej rady"],
    ["vice_chair", "Podpredseda SVB"],
    ["economic", "Ekonomická správa"]
  ]
});

vm.runInContext(extractFunction("canChangeRegisteredOwnerRole"), context);
vm.runInContext(extractFunction("registeredOwnerRoleValue"), context);

test("chair can change a linked registered owner's role", () => {
  assert.equal(context.canChangeRegisteredOwnerRole({ profileId: "profile-1", profileRoleKey: "owner" }, "chair"), true);
});

test("non-chair roles cannot change registered owner roles", () => {
  for (const role of ["owner", "board", "vice_chair", "economic"]) {
    assert.equal(context.canChangeRegisteredOwnerRole({ profileId: "profile-1", profileRoleKey: "owner" }, role), false);
  }
});

test("chair account and unlinked owner records remain protected", () => {
  assert.equal(context.canChangeRegisteredOwnerRole({ profileId: "chair-1", profileRoleKey: "chair" }, "chair"), false);
  assert.equal(context.canChangeRegisteredOwnerRole({ profileId: "", profileRoleKey: "owner" }, "chair"), false);
});

test("only supported non-chair roles are accepted", () => {
  assert.equal(context.registeredOwnerRoleValue("vice_chair"), "vice_chair");
  assert.equal(context.registeredOwnerRoleValue("chair", "owner"), "owner");
  assert.equal(context.registeredOwnerRoleValue("unexpected", "board"), "board");
});

test("owner edit form and Supabase update are wired to the selected role", () => {
  assert.match(appSource, /"ownerProfileRole",\s*"Rola používateľa"/);
  assert.match(appSource, /const ownerProfileRoleValue = document\.querySelector\("#ownerProfileRole"\)/);
  assert.match(appSource, /role: nextProfileRole/);
  assert.match(appSource, /if \(profileError\) throw new Error\(profileError\.message\)/);
});
