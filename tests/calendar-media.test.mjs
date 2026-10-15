import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
const problemsSource = await readFile(new URL("../svb-problems.js", import.meta.url), "utf8");
function extract(name) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.notEqual(start, -1);
  const next = source.slice(start + 1).search(/\n(?:async )?function \w+\(/);
  return source.slice(start, next < 0 ? undefined : start + 1 + next);
}

function setup({ file = { name: "upratovanie.JPG", type: "image/jpeg", size: 1024 }, uploadError = null, role = "owner", readable = true } = {}) {
  const uploads = [];
  const rows = [];
  const notices = [];
  let sequence = 0;
  const bucket = {
    upload: async (path, selected, options) => { uploads.push({ path, selected, options }); return { error: uploadError }; },
    createSignedUrl: async (path) => ({ data: { signedUrl: `https://test.invalid/${path}?token=fresh` } })
  };
  const ctx = vm.createContext({
    state: { role, events: [], owners: [], photos: [], currentUserId: "owner-1" },
    document: { querySelector: () => ({ files: file ? [file] : [] }) },
    crypto: { randomUUID: () => `unique-${++sequence}` }, STORAGE_BUCKET: "e-housing-files",
    supabaseClient: { storage: { from: () => bucket }, from: (table) => ({
      insert: (row) => { rows.push({ ...row, id: "event-1", table }); return { select: () => ({ single: async () => ({ data: { id: "event-1" } }) }) }; },
      update: (update) => ({ eq: async (_key, id) => { Object.assign(rows.find((row) => row.id === id), update); return { error: null }; } })
    }) },
    permissionFor: () => ({ read: readable }),
    currentOwner: () => ({ id: "record-1" }), canManageCleaningCalendar: () => true,
    isOwnCleaningEvent: () => true, canManageCalendarEvent: () => true,
    eventDateToStartsAt: (date) => `${date}T08:00:00Z`, normalizeEventDateInput: (date) => date,
    assertSupabaseOk: (response) => { if (response.error) throw new Error(response.error.message); return response; },
    notifyByChoice: async (...args) => notices.push(args), formatDate: (date) => date,
    escapeAttr: (text) => String(text).replaceAll('"', "&quot;"), escapeHtml: (text) => String(text),
    icon: () => "", deleteButton: () => { throw new Error("Linked event photo cannot be deleted independently"); },
    window: { alert: (text) => notices.push(text) }, youtubePreviewBlock: () => ""
  });
  for (const name of ["isImageAttachment", "isCleaningEventType", "cleaningEventTitle", "calendarAttachmentContentType", "uploadSelectedFile", "saveDialogToSupabase", "saveEditToSupabase", "signedStorageUrl", "dbEventToCard", "calendarAlbumPhotos", "refreshCalendarAttachment", "photoCard", "mediaPreviewBlock"]) vm.runInContext(extract(name), ctx);
  return { ctx, uploads, rows, notices, bucket };
}
const values = { titleValue: "Upratovanie", categoryValue: "2026-10-13", eventTypeValue: "cleaning", noteValue: "Umyta chodba", youtubeUrlValue: "" };

test("calendar upload persists its path, reloads and projects one clickable album photo for every role", async () => {
  for (const role of ["owner", "board", "vice_chair", "chair", "economic"]) {
    const { ctx, uploads, rows, notices } = setup({ role });
    await ctx.saveDialogToSupabase("calendar", values);
    assert.equal(uploads.length, 1);
    assert.equal(uploads[0].options.upsert, false);
    assert.equal(rows[0].storage_path, uploads[0].path);
    assert.equal(notices.length, 1);
    ctx.state.events = [await ctx.dbEventToCard(rows[0])];
    const [photo] = ctx.calendarAlbumPhotos();
    assert.equal(photo.id, "event:event-1");
    assert.equal(photo.title, "Upratovanie");
    assert.match(photo.image, /token=fresh/);
    assert.match(ctx.photoCard(photo), /data-detail="event"/);
    assert.match(ctx.mediaPreviewBlock(ctx.state.events[0], true), /<a href="https:\/\/test.invalid/);
  }
});

test("failed upload never inserts an event or sends its notification", async () => {
  const { ctx, rows, notices } = setup({ uploadError: { message: "Storage RLS denied" } });
  await assert.rejects(ctx.saveDialogToSupabase("calendar", values), /Uloženie nebolo dokončené/);
  assert.equal(rows.length, 0);
  assert.equal(notices.length, 0);
});

test("unsupported, empty and oversized attachments fail before upload", async () => {
  for (const file of [
    { name: "photo.heic", type: "image/heic", size: 100 },
    { name: "photo.jpg", type: "image/jpeg", size: 0 },
    { name: "photo.jpg", type: "image/jpeg", size: 20 * 1024 * 1024 + 1 }
  ]) {
    const { ctx, uploads, rows } = setup({ file });
    await assert.rejects(ctx.saveDialogToSupabase("calendar", values), /formát|veľkosť/);
    assert.equal(uploads.length, 0);
    assert.equal(rows.length, 0);
  }
});

test("optional attachments remain optional and do not create album entries", async () => {
  const { ctx, uploads, rows } = setup({ file: null });
  await ctx.saveDialogToSupabase("calendar", values);
  ctx.state.events = [await ctx.dbEventToCard(rows[0])];
  assert.equal(rows[0].storage_path, null);
  assert.equal(uploads.length, 0);
  assert.equal(ctx.calendarAlbumPhotos().length, 0);
});

test("replacement keeps a single linked photo and event deletion removes it from the album", async () => {
  const { ctx, rows, uploads } = setup();
  await ctx.saveDialogToSupabase("calendar", values);
  const event = await ctx.dbEventToCard(rows[0]);
  await ctx.saveEditToSupabase("event", event, { ...values, eventTypeValue: "cleaning_extra" });
  ctx.state.events = [await ctx.dbEventToCard(rows[0])];
  const photos = ctx.calendarAlbumPhotos();
  assert.equal(photos.length, 1);
  assert.equal(photos[0].title, "Upratovanie - extra");
  assert.notEqual(uploads[0].path, uploads[1].path);
  assert.ok(photos[0].image.includes(uploads[1].path));
  ctx.state.events = [];
  assert.equal(ctx.calendarAlbumPhotos().length, 0);
});

test("failed replacement preserves the original event attachment", async () => {
  const { ctx, rows, bucket } = setup();
  await ctx.saveDialogToSupabase("calendar", values);
  const original = rows[0].storage_path;
  bucket.upload = async () => ({ error: { message: "offline" } });
  await assert.rejects(ctx.saveEditToSupabase("event", await ctx.dbEventToCard(rows[0]), values));
  assert.equal(rows[0].storage_path, original);
});

test("calendar permissions apply to album projections, and documents are not treated as photos", async () => {
  const hidden = setup({ readable: false });
  hidden.ctx.state.events = [{ id: "hidden", storagePath: "calendar/a.jpg" }];
  assert.equal(hidden.ctx.calendarAlbumPhotos().length, 0);
  const { ctx, rows } = setup({ file: { name: "document.pdf", type: "application/pdf", size: 100 } });
  await ctx.saveDialogToSupabase("calendar", { ...values, eventTypeValue: "general" });
  ctx.state.events = [await ctx.dbEventToCard(rows[0])];
  assert.equal(ctx.calendarAlbumPhotos().length, 0);
});

test("image detection uses storage path independently from signed URL and handles missing extensions", async () => {
  const { ctx } = setup({ file: { name: "photo", type: "image/png", size: 100 } });
  assert.equal(ctx.isImageAttachment({ storagePath: "calendar/photo.JPG", fileUrl: "https://test.invalid/download" }), true);
  assert.equal(ctx.isImageAttachment({ storagePath: "calendar/photo.pdf" }), false);
  assert.match(await ctx.uploadSelectedFile("calendar"), /photo\.png$/);
  assert.equal(ctx.calendarAttachmentContentType({ name: "photo.JPG", type: "", size: 100 }), "image/jpeg");
});

test("opening an event refreshes expiring signed URLs and reports unreadable attachments", async () => {
  const { ctx, bucket, notices } = setup();
  const event = { storagePath: "calendar/a.jpg", fileUrl: "expired" };
  assert.equal(await ctx.refreshCalendarAttachment(event), true);
  assert.match(event.fileUrl, /token=fresh/);
  bucket.createSignedUrl = async () => ({ error: { message: "not found" } });
  assert.equal(await ctx.refreshCalendarAttachment(event), false);
  assert.equal(notices.length, 1);
});

test("calendar photo actions, gallery integration and edit attachment fields are wired", () => {
  assert.match(source, /data-photo-preview="event:\$\{event.id\}"/);
  assert.match(problemsSource, /\.\.\.calendarAlbumPhotos\(\)/);
  assert.match(source, /calendarUploadField\("Nahradiť alebo doplniť prílohu udalosti"\)/);
  assert.match(source, /type === "event" && !\(await refreshCalendarAttachment\(item\)\)/);
  assert.match(source, /querySelectorAll\("\[data-photo-preview\]"\)[\s\S]*?event\.stopPropagation\(\);[\s\S]*?openPhotoPreview\(button\.dataset\.photoPreview\)/);
});
