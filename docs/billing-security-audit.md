# Personal billing document access audit — 2026-10-14

Reviewed main commit `873e3ea01d966218e9634cba7288dddc6da8c59d`. This is a repository audit, not confirmation of deployed database configuration or an investigation of the two October 13 emails. No production credentials, document contents, database queries, or Storage requests were used.

## Confirmed repository findings

1. **High: Storage bypass.** `20260612_live_app_schema.sql` permits every authenticated account to SELECT all `e-housing-files` objects. Making the bucket private in `20260612_security_storage.sql` blocks public serving, but does not restrict authenticated downloads or URL signing by document ownership. A user knowing a foreign `storage_path` can request it directly, independently of `billing_settlements` RLS. Paths include timestamps and original filenames; obscurity is not authorization.
2. **Stale assignment.** The v198 billing predicate ORs `owner_profile_id` with `owner_records.profile_id`. After reassignment to another profile, the former profile can still read the record. Pending owner records also satisfy the original record branch. The fix treats a non-null ownership record as authoritative and requires approved account/ownership and matching building. Null ownership records retain legacy profile access. Review legacy assignments before deploying; removal of an ownership record currently uses ON DELETE SET NULL and therefore returns to legacy profile semantics.
3. **Administrative scope.** `is_chair()` includes approved chair, vice_chair and economic roles in existing migrations. Board membership alone grants no billing access. This patch preserves those administrative semantics, rather than assuming the helper means chair only. Administrative helpers are global; multi-building tenant isolation of administrative roles is outside this patch.

## Flow traced

- Upload: `saveDialogToSupabase('billing')` uploads via `uploadSelectedFile('billing')` to `billing/<timestamp>-<filename>`, then inserts a billing row containing ownership IDs and path. A failed row insert can leave an orphan. The guard denies owners access to such orphan files; administrators can still read their upload before insertion.
- List: `loadSupabaseData()` selects billing rows using the user's Supabase client. Database RLS determines the rows returned.
- Property selection: `billingSettlementBelongsToOwner()` prioritizes `ownerRecordId`, so each selected property has its own documents. Both properties are authorized at database level for the same approved account. Legacy documents without a property record cannot be reliably assigned to an individual property from profile alone.
- Notification link: URL contains view/type/id, not a Storage grant. `schedulePendingDeepLinkDetail()` waits for login and approval, checks view access, then `openDetailDialog()` uses `findEditable()` to find the record in loaded state. Missing/foreign IDs do not render a detail. Frontend filtering is not the security boundary.
- Download: `dbBillingSettlementToCard()` calls `signedStorageUrl()`, which signs using the current user, for one hour. The restrictive Storage guard now requires an RLS-visible billing row for protected paths (or the existing administrator helper). It also protects legacy paths referenced by billing rows. Other shared attachments preserve existing permissions.
- Notification recipients: the Edge Function uses a privileged server client and resolves recipients from the requested target. The billing UI can supply a target; it does not hard-bind notification recipients to the document owner. Do not include sensitive document contents in a broadcast notification. This audit does not claim the linked emails were misaddressed or inspected.

## Patch

- Add a restrictive Storage SELECT guard, intersecting existing permissive policies. Protect both `billing/` paths and any path referenced by a billing row. The private helper only classifies whether a path is a billing file; it deliberately sees hidden rows and returns no row metadata. EXECUTE is limited to authenticated; schema is private and search_path is empty.
- Reserve billing uploads for existing administrative roles, including paths outside billing/ already referenced by a billing row. Existing UPDATE/DELETE policies already require administrators.
- Enforce private bucket setting. Do not move, download, rewrite or delete objects or document rows.
- Tighten row access for stale, pending and inconsistent building assignments.

## Verification

`npm ci`, then `npm test` and `npm run check`.

`tests/billing-access.test.mjs` uses pinned PGlite (real PostgreSQL) with synthetic accounts, properties, document metadata, roles and Storage object metadata. It first loads the actual v198 migration and proves that Alice can see Bob's file and a reassigned row under the old rules. It then executes the actual new migration and checks ownership, both document types, multiple properties, legacy paths, orphan files, pending/anonymous users, board and administrative roles, shared attachments, rejected owner uploads, and private bucket configuration. A VM test executes the frontend deep-link scheduler and missing-record guard.

Limitations: the fixture uses minimal tables and role helpers, not the complete historical migration chain. It does not run the Supabase Storage HTTP service, mint signed URLs, exercise a browser login, or inspect production RLS/advisors. Before release, use a disposable full Supabase environment to test direct authenticated download and URL-signing requests as each account, public URL rejection, and all deployed permissive/ALL policies. Review deployment drift and database advisors separately. No production deployment is included.

## Signed URL limitation

An authorized user's signed URL is a transferable bearer grant until expiry (currently one hour). Forwarding that raw URL bypasses subsequent login checks by design; this differs from the notification's application link. Existing signed URLs may remain usable until expiry after policy changes or reassignment. If every download must recheck the current user, replace signed-link rendering with an authenticated download flow and verify previews/downloads end to end. This patch prevents unauthorized users from obtaining a fresh grant through the broad Storage policy; it does not revoke previously issued bearer URLs or protect copies already downloaded.
