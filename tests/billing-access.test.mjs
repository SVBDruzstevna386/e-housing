import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { PGlite } from '@electric-sql/pglite';

const migration = await readFile(new URL('../supabase/migrations/20261014160337_protect_billing_storage.sql', import.meta.url), 'utf8');
const db = new PGlite();
// Disposable PostgreSQL fixture: no network, credentials, production rows or files.
await db.exec(`
  create role authenticated; create role anon;
  create schema auth; create schema app_private; create schema storage;
  create function auth.uid() returns text language sql stable as $$ select nullif(current_setting('test.uid', true), '') $$;
  create table public.profiles(id text primary key, approval_status text);
  create table public.owner_records(id text primary key, profile_id text, approval_status text, building_id text);
  create table public.billing_settlements(id text primary key, owner_profile_id text, owner_record_id text, building_id text, storage_path text, document_type text);
  create table storage.objects(bucket_id text, name text);
  create table storage.buckets(id text primary key, public boolean);
  insert into storage.buckets values ('e-housing-files', true);
  create function app_private.is_chair() returns boolean language sql stable as $$ select auth.uid() in ('chair','vice_chair','economic') $$;
  grant usage on schema public, auth, app_private, storage to authenticated, anon;
  grant select on all tables in schema public, storage to authenticated, anon;
  grant insert on storage.objects to authenticated;
  alter table public.billing_settlements enable row level security;
  alter table storage.objects enable row level security;
  create policy "billing settlements chair write" on public.billing_settlements for all to authenticated using (app_private.is_chair()) with check (app_private.is_chair());
  create policy "storage read e-housing" on storage.objects for select to authenticated using (bucket_id = 'e-housing-files');
  create policy "storage insert e-housing" on storage.objects for insert to authenticated with check (bucket_id = 'e-housing-files');
  insert into profiles values ('alice','approved'),('bob','approved'),('pending','pending'),('board','approved');
  insert into owner_records values ('a1','alice','approved','home'),('a2','alice','approved','home'),('b1','bob','approved','home'),('p1','alice','pending','home'),('x1','alice','approved','other');
  insert into billing_settlements values
    ('a1','alice','a1','home','billing/a1.pdf','Vyúčtovanie'),
    ('a2','alice','a2','home','billing/a2.pdf','Predpis'),
    ('b1','bob','b1','home','billing/b1.pdf','Predpis'),
    ('legacy','alice',null,'home','old/legacy.pdf','Vyúčtovanie'),
    ('stale','alice','b1','home','billing/stale.pdf','Vyúčtovanie'),
    ('pending','alice','p1','home','billing/pending.pdf','Predpis'),
    ('wrong-building','alice','x1','home','billing/wrong-building.pdf','Predpis'),
    ('unapproved','pending',null,'home','billing/unapproved.pdf','Predpis');
  insert into storage.objects select 'e-housing-files', storage_path from billing_settlements;
  insert into storage.objects values ('e-housing-files','billing/orphan.pdf'),('e-housing-files','documents/shared.pdf');
`);
// Reproduce the repository's previous effective billing policy and storage bypass.
await db.exec(await readFile(new URL('../supabase/migrations/20260726002243_board_own_billing_only_v198.sql', import.meta.url), 'utf8'));
await asUser('alice');
assert.ok((await ids()).includes('stale'), 'baseline exposes reassigned record through stale profile');
assert.ok((await files()).includes('billing/b1.pdf'), 'baseline exposes foreign file by known path');
assert.ok((await files()).includes('old/legacy.pdf'));
await db.exec('reset role');
await db.exec(migration);
assert.equal((await db.query("select public from storage.buckets where id = 'e-housing-files'")).rows[0].public, false);
async function asUser(uid, role = 'authenticated') {
  await db.exec('reset role');
  await db.query("select set_config('test.uid', $1, false)", [uid]);
  await db.exec(`set role ${role}`);
}
async function ids() { return (await db.query('select id from billing_settlements order by id')).rows.map(r => r.id); }
async function files() { return (await db.query('select name from storage.objects order by name')).rows.map(r => r.name); }

test('actual RLS: multiple properties, both document types and legacy fallback', async () => {
  await asUser('alice');
  assert.deepEqual(await ids(), ['a1','a2','legacy']);
  assert.deepEqual(await files(), ['billing/a1.pdf','billing/a2.pdf','documents/shared.pdf','old/legacy.pdf']);
});
test('actual RLS: stale profile cannot override reassigned ownership', async () => {
  await asUser('bob'); assert.deepEqual(await ids(), ['b1','stale']);
  assert.deepEqual(await files(), ['billing/b1.pdf','billing/stale.pdf','documents/shared.pdf']);
});
test('actual RLS: board membership grants no access to foreign billing', async () => {
  await asUser('board'); assert.deepEqual(await ids(), []);
  assert.deepEqual(await files(), ['documents/shared.pdf']);
});
test('actual RLS: pending and anonymous users cannot read personal files', async () => {
  await asUser('pending'); assert.deepEqual(await ids(), []);
  assert.deepEqual(await files(), ['documents/shared.pdf']);
  await asUser('', 'anon'); assert.deepEqual(await ids(), []); assert.deepEqual(await files(), []);
});
test('actual RLS: administrators retain read access, including upload before row insert', async () => {
  for (const uid of ['chair','vice_chair','economic']) {
    await asUser(uid); assert.equal((await ids()).length, 8); assert.equal((await files()).length, 10);
  }
});
test('actual RLS: owners cannot inject billing files into permissive upload policy', async () => {
  await asUser('alice');
  await assert.rejects(db.query("insert into storage.objects values ('e-housing-files','billing/injected.pdf')"), /row-level security/);
  await assert.rejects(db.query("insert into storage.objects values ('e-housing-files','old/legacy.pdf')"), /row-level security/);
});
test('deep links wait for login and approval and open only a loaded record', async () => {
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  const schedule = source.slice(source.indexOf('function schedulePendingDeepLinkDetail()'), source.indexOf('function defaultRolePermissions()'));
  const open = source.match(/function openDetailDialog\(type, id\) \{\s*const item = findEditable\(type, id\);\s*if \(!item\) return;/)?.[0];
  assert.ok(open);
  const calls = [];
  const context = vm.createContext({state: {loggedIn: false, pendingDeepLink: {view:'billing',detailType:'billingSettlement',detailId:'b1'}}, isPendingAuthorization:()=>false, canAccessView:()=>true, setTimeout:fn=>fn(), openDetailDialog:(...args)=>calls.push(args)});
  vm.runInContext(schedule, context); vm.runInContext('schedulePendingDeepLinkDetail()', context);
  assert.equal(calls.length, 0);
  context.state.loggedIn = true; context.isPendingAuthorization = ()=>true;
  vm.runInContext('schedulePendingDeepLinkDetail()', context); assert.equal(calls.length, 0);
  context.isPendingAuthorization = ()=>false;
  context.openDetailDialog = vm.runInContext(`(${open}\nthrow new Error('must not render foreign record'); })`, vm.createContext({findEditable:()=>undefined}));
  vm.runInContext('schedulePendingDeepLinkDetail()', context);
});
