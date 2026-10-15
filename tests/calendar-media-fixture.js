const calendarFixtureParams = new URLSearchParams(location.search);
state.role = calendarFixtureParams.get("role") || "owner";
state.loggedIn = true;
state.currentUserId = "fixture-user";
state.view = calendarFixtureParams.get("view") || "calendar";
state.calendarMonth = "2026-10";
state.rolePermissions = defaultRolePermissions();
state.profiles = [{ id: "fixture-user", role: state.role, full_name: "Testovaci vlastnik", approval_status: "approved" }];
state.owners = [{ id: "fixture-record", profileId: "fixture-user", name: "Testovaci vlastnik", approvalStatus: "approved", flat: "30", canManageCleaningCalendar: true }];
state.events = [
  { id: "cleaning-photo", date: "2026-10-13", startsAt: "2026-10-13T08:00:00Z", title: "Upratovanie", eventType: "cleaning", note: "Fotodokumentacia po upratovani spolocnych priestorov.", storagePath: "calendar/test.jpg", fileUrl: "/assets/cartoon/cartoon-header-banner.webp", createdBy: "fixture-user", ownerRecordId: "fixture-record" },
  { id: "extra-photo", date: "2026-10-14", startsAt: "2026-10-14T08:00:00Z", title: "Upratovanie - extra", eventType: "cleaning_extra", note: "Mimoriadne upratovanie.", storagePath: "calendar/extra.png", fileUrl: "/logo-e-housing.png", createdBy: "fixture-user", ownerRecordId: "fixture-record" },
  { id: "no-photo", date: "2026-10-15", title: "Schodza", eventType: "general", note: "Udalost bez fotografie." }
];
state.photos = [];
state.svbProblems = [];
state.uiTheme = calendarFixtureParams.get("theme") || "classic_light";
rememberUiTheme(state.uiTheme);
document.body.classList.remove("app-loading");
document.body.classList.add("app-ready");
render();
