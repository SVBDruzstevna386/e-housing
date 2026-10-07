import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  NOTIFICATION_AREAS,
  REQUIRED_NOTIFICATION_AREAS,
  normalizeNotificationArea,
  partitionRecipients
} from "../supabase/functions/send-notification/notification-preferences.mjs";

const recipients = [
  { profile_id: "profile-a", name: "A", email: "a@example.com" },
  { profile_id: "profile-b", name: "B", email: "b@example.com" },
  { profile_id: null, name: "Legacy", email: "legacy@example.com" }
];

test("defines all requested areas and three mandatory areas", () => {
  assert.equal(NOTIFICATION_AREAS.length, 13);
  assert.equal(new Set(NOTIFICATION_AREAS).size, 13);
  assert.deepEqual([...REQUIRED_NOTIFICATION_AREAS], ["overview", "votes", "billing"]);
});

test("mandatory areas stay enabled even if a malformed row says otherwise", () => {
  const result = partitionRecipients(recipients, [
    { profile_id: "profile-a", area: "votes", email_enabled: false, push_enabled: false }
  ], "votes");

  assert.deepEqual(result.emailRecipients, recipients);
  assert.deepEqual(result.pushRecipients, recipients.slice(0, 2));
});

test("optional email and push choices are applied independently", () => {
  const result = partitionRecipients(recipients, [
    { profile_id: "profile-a", area: "documents", email_enabled: false, push_enabled: true },
    { profile_id: "profile-b", area: "documents", email_enabled: true, push_enabled: false }
  ], "documents");

  assert.deepEqual(result.emailRecipients.map((item) => item.email), ["b@example.com", "legacy@example.com"]);
  assert.deepEqual(result.pushRecipients.map((item) => item.email), ["a@example.com"]);
});

test("missing optional preferences default to disabled for accounts", () => {
  const result = partitionRecipients(recipients, [], "calendar");

  assert.deepEqual(result.emailRecipients, recipients.slice(2));
  assert.deepEqual(result.pushRecipients, []);
});

test("unknown areas are treated as mandatory overview notifications", () => {
  assert.equal(normalizeNotificationArea("unknown"), "overview");
  const result = partitionRecipients(recipients, [], "unknown");
  assert.equal(result.emailRecipients.length, 3);
  assert.equal(result.pushRecipients.length, 2);
});

test("frontend and server use the same notification area keys", async () => {
  const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const areaBlock = appSource.match(/const NOTIFICATION_AREAS = \[([\s\S]*?)\n\];/)?.[1] || "";
  const frontendAreas = [...areaBlock.matchAll(/key:\s*"([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(frontendAreas, NOTIFICATION_AREAS);
  assert.match(appSource, /\.from\("notification_preferences"\)\s*\.upsert/);
  assert.match(appSource, /notificationPreferencesMarkup\(\)/);
});
