state.role = "chair";
state.loggedIn = true;
state.currentUserId = "fixture-chair";
state.view = new URLSearchParams(location.search).get("view") || "problems";
state.pendingDeepLink = readDeepLinkFromUrl();
state.profiles = [
  { id: "fixture-chair", role: "chair", full_name: "Predseda SVB", approval_status: "approved" },
  { id: "fixture-owner", role: "owner", full_name: "Testovací vlastník nehnuteľnosti s dlhým menom", flat_number: "30", approval_status: "approved" },
  { id: "fixture-board", role: "board", full_name: "Člen dozornej rady", flat_number: "10", approval_status: "approved" }
];
state.owners = state.profiles.map((profile, index) => ({ id: `fixture-record-${index}`, profileId: profile.id, name: profile.full_name, approvalStatus: "approved", flat: profile.flat_number || "1" }));
state.svbProblems = [
  { id: "fixture-1", title: "Poškodenie spoločných priestorov", body: "Zaznamenali sme poškodenie vstupných dverí.\nProsíme vlastníkov o súčinnosť pri objasnení udalosti.", recipientId: null, recipientLabel: "Všetci vlastníci", author: "Predseda SVB", createdAt: "2026-10-12T09:00:00Z", youtubeUrl: "", photos: [{ path: "a.jpg", url: "/assets/cartoon/cartoon-header-banner.webp" }], showInAlbum: true },
  { id: "fixture-2", title: "Upozornenie pre konkrétneho vlastníka", body: "Doplňujúce informácie k udalosti.\nTento záznam je adresovaný iba vybranému vlastníkovi.", recipientId: "fixture-owner", recipientLabel: "Testovací vlastník nehnuteľnosti s dlhým menom · 30", author: "Predseda SVB", createdAt: "2026-10-12T08:00:00Z", youtubeUrl: "https://youtu.be/aqz-KE-bpKQ", photos: [], showInAlbum: false },
  { id: "fixture-3", title: "Odstránenie predmetov z únikovej cesty", body: "Prosíme o odstránenie predmetov zo spoločnej chodby.", recipientId: null, recipientLabel: "Všetci vlastníci", author: "Predseda SVB", createdAt: "2026-10-11T08:00:00Z", youtubeUrl: "", photos: [], showInAlbum: true }
];
state.photos = [];
state.rolePermissions = defaultRolePermissions();
const fixtureRole = new URLSearchParams(location.search).get("role");
if (["owner", "board"].includes(fixtureRole)) {
  state.role = fixtureRole;
  state.currentUserId = `fixture-${fixtureRole}`;
}
state.uiTheme = new URLSearchParams(location.search).get("theme") || "classic_light";
rememberUiTheme(state.uiTheme);
document.body.classList.remove("app-loading");
document.body.classList.add("app-ready");
render();
