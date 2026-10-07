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

const context = vm.createContext({ Date, state: { votes: [] } });
[
  "normalizedVoteStatus",
  "isVoteCancelled",
  "isVoteClosed",
  "isVoteOpen",
  "voteTimestamp",
  "currentVote",
  "nextOpenVote",
  "voteStatusLabel"
].forEach((name) => vm.runInContext(extractFunction(name), context));

const checkedAt = new Date("2026-09-27T21:52:38.590Z");
const expiredProductionVote = {
  id: "expired",
  title: "Domová schôdza č. 33 zo dňa 06. 09. 2026",
  status: "Prebieha",
  closes: "2026-09-05T21:59:59.000Z"
};
const futureVote = {
  id: "future",
  status: "open",
  closes: "2026-10-01T21:59:59.000Z"
};

test("expired vote with a stale open database status is treated as closed", () => {
  assert.equal(context.isVoteClosed(expiredProductionVote, checkedAt), true);
  assert.equal(context.isVoteOpen(expiredProductionVote, checkedAt), false);
  assert.equal(context.voteStatusLabel(expiredProductionVote, checkedAt), "Ukončené");
});

test("deadline is exclusive and closes the vote at the exact timestamp", () => {
  const deadline = new Date(futureVote.closes);
  assert.equal(context.isVoteOpen(futureVote, new Date(deadline.getTime() - 1)), true);
  assert.equal(context.isVoteOpen(futureVote, deadline), false);
});

test("current vote and next open vote exclude expired records", () => {
  assert.equal(context.currentVote([expiredProductionVote], checkedAt), null);
  assert.equal(context.currentVote([expiredProductionVote, futureVote], checkedAt)?.id, "future");

  context.state.votes = [expiredProductionVote, futureVote];
  assert.equal(context.nextOpenVote(checkedAt)?.id, "future");
});

test("draft, cancelled and explicitly closed votes are never open", () => {
  const closes = "2026-10-01T21:59:59.000Z";
  assert.equal(context.isVoteOpen({ status: "draft", closes }, checkedAt), false);
  assert.equal(context.isVoteOpen({ status: "Zrušené", closes }, checkedAt), false);
  assert.equal(context.isVoteOpen({ status: "closed", closes }, checkedAt), false);
});

test("overview counter and deadline refresh use the shared vote-state logic", () => {
  assert.match(appSource, /state\.votes\.filter\(\(vote\) => isVoteOpen\(vote\)\)\.length/);
  assert.match(appSource, /scheduleVoteDeadlineRefresh\(\);\s*\n\s*syncAppChrome\(\);/);
  assert.match(appSource, /if \(closed\) return `\$\{managementActions\}\$\{commentAction\}`;/);
});
