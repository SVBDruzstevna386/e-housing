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

const context = vm.createContext({ state: { role: "owner", isPlatformAdmin: false } });
[
  "voteQuestionOptionId",
  "selectedVoteQuestionForVote",
  "voteTotalsForVoteFilter",
  "personalVoteTotalsForVoteFilter",
  "voteSummaryForViewer"
].forEach((name) => vm.runInContext(extractFunction(name), context));

const vote = {
  id: "vote-1",
  yes: 8,
  no: 3,
  abstain: 2,
  questions: [
    { id: "q1", yes: 4, no: 2, abstain: 1, myAnswer: "Za", myAnswerValue: "Za" },
    { id: "q2", yes: 3, no: 1, abstain: 1, myAnswer: "Ponuka A", myAnswerValue: "Za" },
    { id: "q3", yes: 1, no: 0, abstain: 0, myAnswer: "Zdržal sa", myAnswerValue: "Zdržal sa" }
  ]
};

test("owner, board and vice chair see only the active property's answers", () => {
  for (const role of ["owner", "board", "vice_chair"]) {
    assert.deepEqual(
      structuredClone(context.voteSummaryForViewer(vote, "all", role, false)),
      { yes: 2, no: 0, abstain: 1, note: "môj hlas v aktuálnom hlasovaní" }
    );
  }
});

test("selected price offer is counted as one personal vote for Za", () => {
  const filter = context.voteQuestionOptionId(vote, vote.questions[1]);
  assert.deepEqual(
    structuredClone(context.voteSummaryForViewer(vote, filter, "owner", false)),
    { yes: 1, no: 0, abstain: 0, note: "môj hlas v aktuálnom hlasovaní" }
  );
});

test("a property without an electronic answer gets an explicit status in every result card", () => {
  const unansweredVote = {
    ...vote,
    questions: vote.questions.map((question) => ({ ...question, myAnswer: "", myAnswerValue: "" }))
  };
  assert.deepEqual(
    structuredClone(context.voteSummaryForViewer(unansweredVote, "all", "board", false)),
    {
      yes: "vlastník nehlasoval",
      no: "vlastník nehlasoval",
      abstain: "vlastník nehlasoval",
      note: "bez elektronicky odovzdaného hlasu"
    }
  );
});

test("chair and platform admin keep aggregate totals for all voters", () => {
  const expected = { yes: 8, no: 3, abstain: 2, note: "celkový stav všetkých hlasujúcich" };
  assert.deepEqual(structuredClone(context.voteSummaryForViewer(vote, "all", "chair", false)), expected);
  assert.deepEqual(structuredClone(context.voteSummaryForViewer(vote, "all", "owner", true)), expected);
});

test("the unique voter card remains wired to the existing aggregate counter", () => {
  assert.match(
    appSource,
    /voteSummaryCard\("Hlasovali vlastníci", electronicVoterCount\(activeVote\), activeVote \? activeVote\.title/
  );
});
