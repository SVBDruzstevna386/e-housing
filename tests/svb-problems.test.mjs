import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { canNotifySvbProblem, svbProblemNotificationContent } from "../supabase/functions/send-notification/svb-problem-notification.mjs";
import { partitionRecipients } from "../supabase/functions/send-notification/notification-preferences.mjs";

const source = await readFile(new URL("../svb-problems.js", import.meta.url), "utf8");
const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
function context(overrides = {}) {
  const state = { role: "owner", loggedIn: true, isPlatformAdmin: false, currentUserId: "owner-a", svbProblems: [], profiles: [], owners: [], photos: [], ...overrides };
  const ctx = vm.createContext({ state, youtubeVideoId: (url) => url.startsWith("https://youtu.be/") ? "valid" : "", ...overrides });
  vm.runInContext(source, ctx);
  if (overrides.acknowledged !== false) vm.runInContext("svbProblemAcknowledgement = { userId: state.currentUserId, version: SVB_PROBLEM_NOTICE_VERSION }", ctx);
  return ctx;
}
const photo = { path: "problem/a.jpg", url: "https://example.test/signed-photo" };
const problems = [
  { id: "public", recipientId: null, showInAlbum: true, photos: [photo] },
  { id: "own", recipientId: "owner-a", showInAlbum: true, photos: [photo] },
  { id: "other", recipientId: "owner-b", showInAlbum: true, photos: [photo] },
  { id: "no-album", recipientId: null, showInAlbum: false, photos: [photo] }
];

test("notice gates all roles and album photos until acknowledgement", () => {
  for (const role of ["owner", "board", "vice_chair", "economic", "chair"]) {
    const ctx = context({ role, acknowledged: false, svbProblems: problems });
    assert.equal(ctx.hasSvbProblemAcknowledgement(), false);
    assert.equal(ctx.visibleSvbProblems().length, 0);
    assert.equal(ctx.svbProblemAlbumPhotos().length, 0);
  }
  assert.equal(context({ isPlatformAdmin: true, acknowledged: false }).hasSvbProblemAcknowledgement(), false);
});

test("acknowledgement is bound to the current user and notice version and can be reset", () => {
  const ctx = context({ svbProblems: problems });
  assert.equal(ctx.hasSvbProblemAcknowledgement(), true);
  ctx.state.currentUserId = "another-owner";
  assert.equal(ctx.hasSvbProblemAcknowledgement(), false);
  ctx.state.currentUserId = "owner-a";
  vm.runInContext('svbProblemAcknowledgement.version = "outdated"', ctx);
  assert.equal(ctx.hasSvbProblemAcknowledgement(), false);
  ctx.resetSvbProblemAcknowledgement();
  assert.equal(ctx.state.svbProblems.length, 0);
  assert.equal(ctx.hasSvbProblemAcknowledgement(), false);
});

test("data loading and direct detail entry points are gated", () => {
  assert.match(appSource, /hasSvbProblemAcknowledgement\(\)\s*\? supabaseClient\.from\("svb_problems"\)/);
  for (const name of ["openEditDialog", "openDetailDialog"]) {
    assert.match(appSource, new RegExp(`function ${name}\\(type, id\\) \\{\\s*if \\(type === "svbProblem" && !ensureSvbProblemAcknowledgement`));
  }
  assert.match(appSource, /function openPhotoPreview\(id\) \{\s*if \(String\(id\)\.startsWith\("problem:"\) && !ensureSvbProblemAcknowledgement/);
});

test("an unauthenticated account cannot retain acknowledgement", () => {
  const ctx = context();
  ctx.state.loggedIn = false;
  assert.equal(ctx.hasSvbProblemAcknowledgement(), false);
  assert.equal(ctx.visibleSvbProblems().length, 0);
});

test("a background render does not discard the pending deep-link action", () => {
  const ctx = context({ acknowledged: false, document: { querySelector: () => ({ open: true }) }, isPendingAuthorization: () => false });
  let resumed = 0;
  ctx.ensureSvbProblemAcknowledgement(() => { resumed++; });
  ctx.ensureSvbProblemAcknowledgement();
  vm.runInContext("svbProblemNoticeAction()", ctx);
  assert.equal(resumed, 1);
});

test("problem administration is reserved to chair and platform admin", () => {
  for (const role of ["owner", "board", "vice_chair", "economic"]) assert.equal(context({ role }).canManageSvbProblems(), false);
  assert.equal(context({ role: "chair" }).canManageSvbProblems(), true);
  assert.equal(context({ role: "owner", isPlatformAdmin: true }).canManageSvbProblems(), true);
});

test("owners and leadership never render another owner's private event or album photos", () => {
  for (const role of ["owner", "board", "vice_chair", "economic"]) {
    const ctx = context({ role, svbProblems: problems });
    assert.deepEqual(Array.from(ctx.visibleSvbProblems(), (item) => item.id), ["public", "own", "no-album"]);
    assert.deepEqual(Array.from(ctx.svbProblemAlbumPhotos(), (item) => item.problemId), ["public", "own"]);
  }
  assert.equal(context({ role: "chair", svbProblems: problems }).visibleSvbProblems().length, 4);
});

test("official recipient list includes approved owners even without private-message consent", () => {
  const ctx = context({ profiles: [
    { id: "a", full_name: "A", role: "owner", approval_status: "approved", neighbor_card: { share_messaging: false } },
    { id: "b", full_name: "B", role: "board", approval_status: "approved" },
    { id: "c", full_name: "C", role: "owner", approval_status: "pending" },
    { id: "d", full_name: "D", role: "economic", approval_status: "approved" },
    { id: "e", full_name: "E", role: "economic", approval_status: "approved" }
  ], owners: [{ profileId: "e", approvalStatus: "approved" }] });
  assert.deepEqual(Array.from(ctx.svbProblemRecipients(), (profile) => profile.id), ["a", "b", "e"]);
});

test("draft validation rejects missing private recipients and unsupported or excessive photos", () => {
  const ctx = context();
  const draft = { title: "Problem", body: "Details", scope: "public", recipientId: "", youtubeUrl: "", files: [], keptPaths: [] };
  assert.doesNotThrow(() => ctx.validateSvbProblemDraft(draft, []));
  assert.throws(() => ctx.validateSvbProblemDraft({ ...draft, scope: "private" }, []), /vlastníka/);
  assert.throws(() => ctx.validateSvbProblemDraft({ ...draft, files: [{ type: "image/svg+xml", size: 100 }] }, []), /fotografie/);
  assert.throws(() => ctx.validateSvbProblemDraft({ ...draft, files: [{ type: "image/jpeg", size: 11000000 }] }, []), /10 MB/);
  assert.throws(() => ctx.validateSvbProblemDraft({ ...draft, keptPaths: Array(11).fill("photo") }, []), /10 fotografií/);
  assert.throws(() => ctx.validateSvbProblemDraft({ ...draft, youtubeUrl: "javascript:alert(1)" }, []), /YouTube/);
});

test("private event notifications cannot be broadened to all owners or redirected", () => {
  const sender = { id: "chair", role: "chair", approval_status: "approved" };
  const problem = { created_by: "chair", recipient_id: "owner-a" };
  assert.equal(canNotifySvbProblem(sender, problem, "individual", "owner-a"), true);
  assert.equal(canNotifySvbProblem(sender, problem, "all", ""), false);
  assert.equal(canNotifySvbProblem(sender, problem, "individual", "owner-b"), false);
  assert.equal(canNotifySvbProblem({ ...sender, role: "board" }, problem, "individual", "owner-a"), false);
  assert.equal(canNotifySvbProblem({ ...sender, approval_status: "pending" }, problem, "individual", "owner-a"), false);
  assert.equal(canNotifySvbProblem({ ...sender, id: "another" }, problem, "individual", "owner-a"), false);
  assert.equal(canNotifySvbProblem(sender, { ...problem, recipient_id: null }, "all", ""), true);
  assert.equal(canNotifySvbProblem({ ...sender, role: "owner" }, problem, "individual", "owner-a", true), true);
});

test("problem notification channels are mandatory even with disabled preference values", () => {
  const recipients = [{ profile_id: "owner-a", email: "test@example.test" }];
  const result = partitionRecipients(recipients, [{ profile_id: "owner-a", email_enabled: false, push_enabled: false }], "problems");
  assert.equal(result.emailRecipients.length, 1);
  assert.equal(result.pushRecipients.length, 1);
});

test("problem notifications use only generic content and a canonical gated detail link", () => {
  const notice = svbProblemNotificationContent("example-id", { subject: "{{title}}", body: "{{message}}\n{{actionUrl}}\n{{sender}}" }, "Predseda");
  assert.match(notice.subject, /Dôverná informácia/);
  assert.match(notice.message, /potvrdení pravidiel/);
  assert.equal(notice.actionUrl, "https://svbdruzstevna386.e-domovnik.sk/?view=problems&detailType=svbProblem&detailId=example-id");
  assert.doesNotMatch(JSON.stringify(notice), /\{\{/);
});

test("retry after a committed create does not insert a duplicate or resend notifications", async () => {
  let inserts = 0;
  let notifications = 0;
  let reloads = 0;
  const fields = { "#title": { value: "Existing" }, "#note": { value: "Body" }, "#problemScope": { value: "public" }, "#problemRecipient": { value: "" }, "#youtubeUrl": { value: "" }, "#problemPhotos": { files: [] }, "#problemShowInAlbum": { checked: true } };
  const query = { select() { return this; }, eq() { return this; }, maybeSingle: async () => ({ data: { id: "saved-id" } }), insert() { inserts++; } };
  const ctx = context({ role: "chair" });
  Object.assign(ctx, {
    supabaseClient: { from: () => query }, dialog: { dataset: { problemDraftId: "saved-id" }, close() {} },
    dialogBody: { querySelector: (selector) => fields[selector], querySelectorAll: () => [] },
    assertSupabaseOk: (result) => result, loadSupabaseData: async () => { reloads++; }, render() {},
    notifyByChoice: async () => { notifications++; }, window: { alert() {} }
  });
  await ctx.saveSvbProblem();
  assert.equal(inserts, 0);
  assert.equal(notifications, 0);
  assert.equal(reloads, 1);
});
