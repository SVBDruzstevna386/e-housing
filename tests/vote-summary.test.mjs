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
  "voteSummaryForViewer",
  "voteChartForViewer",
  "voteCardResultRow"
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

test("historical chart uses personal answers for owner, board and vice chair", () => {
  const expected = { voted: true, yes: 2, no: 0, abstain: 1, viewerMode: "personal" };
  for (const role of ["owner", "board", "vice_chair"]) {
    assert.deepEqual(structuredClone(context.voteChartForViewer(vote, "all", role, false)), expected);
  }
});

test("historical chart preserves aggregate totals for chair and platform admin", () => {
  const expected = { yes: 8, no: 3, abstain: 2, voted: true, viewerMode: "aggregate" };
  assert.deepEqual(structuredClone(context.voteChartForViewer(vote, "all", "chair", false)), expected);
  assert.deepEqual(structuredClone(context.voteChartForViewer(vote, "all", "owner", true)), expected);
});

test("historical chart reports when the active property did not vote", () => {
  const unansweredVote = {
    ...vote,
    questions: vote.questions.map((question) => ({ ...question, myAnswer: "", myAnswerValue: "" }))
  };
  assert.deepEqual(
    structuredClone(context.voteChartForViewer(unansweredVote, "all", "owner", false)),
    { voted: false, yes: 0, no: 0, abstain: 0, viewerMode: "personal" }
  );
  assert.match(appSource, /Vlastník nehlasoval/);
});

test("history view is wired to the role-aware chart calculation", () => {
  assert.match(
    appSource,
    /const historyTotals = voteChartForViewer\(historyVote, state\.historyVoteQuestionFilter\)/
  );
});

test("the unique voter card remains wired to the existing aggregate counter", () => {
  assert.match(
    appSource,
    /voteSummaryCard\("Hlasovali vlastníci", electronicVoterCount\(activeVote\), activeVote \? activeVote\.title/
  );
});

test("vote card row shows only personal results outside chair and platform admin roles", () => {
  const personalTotals = context.voteChartForViewer(vote, "all", "owner", false);
  const markup = context.voteCardResultRow(personalTotals);
  assert.match(markup, /Môj hlas: ZA 2/);
  assert.match(markup, /Odovzdané odpovede: 3/);
  assert.doesNotMatch(markup, /Spolu za 8|13 hlasov spolu/);
});

test("vote card row explicitly reports an owner without an electronic vote", () => {
  const unansweredVote = {
    ...vote,
    questions: vote.questions.map((question) => ({ ...question, myAnswer: "", myAnswerValue: "" }))
  };
  const markup = context.voteCardResultRow(context.voteChartForViewer(unansweredVote, "all", "owner", false));
  assert.match(markup, /Vlastník nehlasoval/);
  assert.doesNotMatch(markup, /Spolu za/);
});

test("chair and platform admin retain the aggregate vote card row", () => {
  const chairMarkup = context.voteCardResultRow(context.voteChartForViewer(vote, "all", "chair", false));
  const adminMarkup = context.voteCardResultRow(context.voteChartForViewer(vote, "all", "owner", true));
  for (const markup of [chairMarkup, adminMarkup]) {
    assert.match(markup, /Spolu za 8/);
    assert.match(markup, /13 hlasov spolu/);
  }
});

test("vote card and its progress bar use role-aware viewer totals", () => {
  assert.match(appSource, /const viewerTotals = voteChartForViewer\(vote, "all"\)/);
  assert.match(appSource, /voteCardResultRow\(viewerTotals\)/);
  assert.doesNotMatch(appSource, /Spolu za \$\{vote\.yes\}/);
});
