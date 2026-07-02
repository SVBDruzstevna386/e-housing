const state = {
  loggedIn: false,
  currentUserEmail: "predsedaSVB@gmail.com",
  role: "chair",
  view: "overview",
  passwords: {},
  filter: "all",
  calendarMonth: new Date().toISOString().slice(0, 7),
  documentHistoryFilter: "all",
  messageFilter: "all",
  billingSettlements: [],
  financeEntries: [],
  executionCases: [],
  innovationIdeas: [],
  innovationComments: [],
  voteComments: [],
  activityLogs: [],
  logRoleFilter: "all",
  logUserFilter: "all",
  logActivityFilter: "all",
  voteTypeFilter: "all",
  voteQuestionFilter: "all",
  voteHistoryFilter: "latest",
  currentVoteQuestionFilter: "all",
  historyVoteQuestionFilter: "all",
  voteDetailOwnerFilter: "all",
  rolePermissions: null,
  communicationPermissions: null,
  documentCategories: ["Zápisnice", "Zmluvy nájmov", "Iné zmluvy", "Iné dokumenty"],
  documents: [
    { id: 1, title: "Pozvánka na schôdzu vlastníkov", type: "Pozvánka", date: "2026-06-18", author: "Predseda", visibility: "Všetci vlastníci", urgent: true },
    { id: 2, title: "Zápisnica zo schôdze 05/2026", type: "Zápisnica", date: "2026-05-29", author: "Dozorná rada", visibility: "Všetci vlastníci", urgent: false },
    { id: 3, title: "Vzor splnomocnenia", type: "Tlačivo", date: "2026-05-12", author: "Predseda", visibility: "Všetci vlastníci", urgent: false }
  ],
  documentHistory: [
    { id: 1, title: "Zápisnica zo schôdze 05/2026", category: "Zápisnice", date: "2026-05-29", owner: "Dozorná rada", note: "Schválený plán opráv a kontrola úloh." },
    { id: 2, title: "Zmluva o nájme nebytového priestoru", category: "Zmluvy nájmov", date: "2026-04-12", owner: "Predseda", note: "Archívny záznam zmluvy k spoločným priestorom." },
    { id: 3, title: "Servisná zmluva výťah", category: "Iné zmluvy", date: "2026-03-18", owner: "Predseda", note: "Zmluva s dodávateľom pravidelného servisu." },
    { id: 4, title: "Cenová ponuka na vstupné dvere", category: "Cenová ponuka", date: "2026-06-02", owner: "Predseda", note: "Podklad k otvorenému hlasovaniu." },
    { id: 5, title: "Fotodokumentácia pivničných priestorov", category: "Iné dokumenty", date: "2026-05-03", owner: "Dozorná rada", note: "Obrazová príloha ku kontrole spoločných priestorov." }
  ],
  boardMembers: [
    { id: 1, role: "Predseda SVB", name: "Martin Nagy", email: "predsedaSVB@gmail.com", phone: "+421 900 000 000", note: "Hlavný kontakt pre správu domu", photoUrl: "" },
    { id: 2, role: "Člen dozornej rady", name: "Jana Horváthová", email: "jana@example.com", phone: "+421 900 111 111", note: "Kontrola dokumentov a zápisníc", photoUrl: "" },
    { id: 3, role: "Člen dozornej rady", name: "Peter Kováč", email: "peter@example.com", phone: "+421 900 222 222", note: "Kontrola opráv a cenových ponúk", photoUrl: "" }
  ],
  activities: [
    { id: 1, month: "2026-06", person: "Martin Nagy", role: "Predseda SVB", title: "Príprava pozvánky na schôdzu", hours: 2.5, status: "Dokončené", note: "Pripravený návrh programu a podkladov." },
    { id: 2, month: "2026-06", person: "Jana Horváthová", role: "Člen dozornej rady", title: "Kontrola zápisnice 05/2026", hours: 1.25, status: "Dokončené", note: "Overenie formulácií a úloh." },
    { id: 3, month: "2026-06", person: "Peter Kováč", role: "Člen dozornej rady", title: "Porovnanie cenových ponúk", hours: 3, status: "Prebieha", note: "Doplniť tretiu ponuku k vstupným dverám." }
  ],
  announcements: [
    { id: 1, title: "Odstávka teplej vody", body: "Dodávateľ oznámil odstávku v stredu od 8:00 do 14:00.", date: "2026-06-19", category: "Údržba", urgent: true },
    { id: 2, title: "Kontrola pivničných priestorov", body: "Prosíme vlastníkov o sprístupnenie spoločných priestorov.", date: "2026-06-22", category: "Prevádzka", urgent: false }
  ],
  votes: [
    { id: 1, title: "Výmena vstupných dverí", closes: "2026-06-28", status: "Prebieha", yes: 18, no: 3, abstain: 2, comments: 7 },
    { id: 2, title: "Schválenie rozpočtu opráv 2026", closes: "2026-07-04", status: "Prebieha", yes: 15, no: 6, abstain: 1, comments: 4 }
  ],
  messages: [
    { id: 1, scope: "Verejná diskusia", from: "Predseda", to: "Všetci vlastníci", subject: "Rozpočet opráv", text: "Prosím o pripomienky k návrhu rozpočtu do piatku.", date: "Dnes 09:12", read: true },
    { id: 2, scope: "Verejná diskusia", from: "Vlastník B-12", to: "Predseda SVB", subject: "Cenové ponuky", text: "Navrhujem doplniť cenové ponuky k výťahu.", date: "Dnes 10:06", read: false },
    { id: 3, scope: "Súkromná správa", from: "Predseda", to: "Mária Nováková · A-01", subject: "Balkón", text: "Vašu požiadavku k balkónu evidujem a zaradím ju na obhliadku.", date: "Včera 18:20", read: true }
  ],
  photos: [
    { id: 1, title: "Vstup do bytového domu", category: "Exteriér", author: "Predseda", date: "2026-06-08", description: "Aktuálny stav vstupu pred plánovanou úpravou.", image: "building-placeholder.svg" },
    { id: 2, title: "Pivničné priestory", category: "Spoločné priestory", author: "Dozorná rada", date: "2026-05-22", description: "Fotodokumentácia ku kontrole spoločných priestorov.", image: "building-placeholder.svg" },
    { id: 3, title: "Nástenka pri vstupe", category: "Oznamy", author: "Vlastník nehnuteľnosti", date: "2026-05-12", description: "Podklad k diskusii o úprave informačnej tabule.", image: "building-placeholder.svg" }
  ],
  owners: [
    { flat: "A-01", name: "Mária Nováková", share: "3,24 %", email: "maria@example.com", loginEmail: "maria@example.com", accountStatus: "Aktívny", approvalStatus: "approved", ownedFrom: "2020-04-01", isDebtor: false, debtAmount: 0, status: "Aktívny", note: "Bez poznámky", photoUrl: "" },
    { flat: "A-06", name: "Peter Kováč", share: "2,91 %", email: "peter@example.com", loginEmail: "peter@example.com", accountStatus: "Pozvánka odoslaná", approvalStatus: "pending", ownedFrom: "2024-02-15", isDebtor: true, debtAmount: 185.4, status: "Pozvánka odoslaná", note: "Neuhradený predpis za 05/2026", photoUrl: "" },
    { flat: "B-12", name: "Jana Horváthová", share: "3,66 %", email: "jana@example.com", loginEmail: "jana@example.com", accountStatus: "Aktívny", approvalStatus: "approved", ownedFrom: "2018-09-10", isDebtor: false, debtAmount: 0, status: "Aktívny", note: "Členka pracovnej skupiny", photoUrl: "" },
    { flat: "C-21", name: "Tomáš Baláž", share: "2,48 %", email: "tomas@example.com", loginEmail: "tomas@example.com", accountStatus: "Aktívny", approvalStatus: "approved", ownedFrom: "2022-11-03", isDebtor: true, debtAmount: 42.75, status: "Aktívny", note: "Evidovať úhradu po splatnosti", photoUrl: "" }
  ],
  events: [
    { id: 1, day: 18, date: "2026-06-18", title: "Schôdza SVB" },
    { id: 2, day: 19, date: "2026-06-19", title: "Odstávka vody" },
    { id: 3, day: 22, date: "2026-06-22", title: "Kontrola pivníc" },
    { id: 4, day: 28, date: "2026-06-28", title: "Koniec hlasovania" }
  ],
  emailTemplates: [
    {
      id: "registration",
      title: "Registrácia vlastníka",
      subject: "Vitajte v e-housing pre SVB a NP Družstevná 386",
      body: "Dobrý deň, bol Vám vytvorený prístup do aplikácie e-housing. Po prihlásení nájdete dokumenty, oznamy, hlasovania a komunikáciu SVB."
    },
    {
      id: "event",
      title: "Nová udalosť",
      subject: "Nová udalosť v dome: {{title}}",
      body: "Dobrý deň, v aplikácii e-housing bola pridaná nová udalosť {{title}}. Prosíme, prihláste sa a pozrite si detail."
    },
    {
      id: "document",
      title: "Nový dokument",
      subject: "Nový dokument: {{title}}",
      body: "Dobrý deň, v aplikácii e-housing bol zverejnený nový dokument {{title}}. Dokument si môžete pozrieť alebo stiahnuť po prihlásení."
    },
    {
      id: "notification-detail",
      key: "notification-detail",
      title: "Notifikácia udalosti s odkazom",
      subject: "{{eventType}}: {{title}}",
      body: "Dobrý deň,\n\nv aplikácii e-housing bola vytvorená alebo upravená udalosť.\n\nTyp udalosti: {{eventType}}\nZáložka: {{section}}\nNázov: {{title}}\n\n{{message}}\n\nDetail otvoríte kliknutím na tento odkaz:\n{{actionUrl}}"
    },
    {
      id: "password-reset",
      key: "password-reset",
      title: "Reset hesla",
      subject: "Obnova hesla do e-housing",
      body: "Dobrý deň, požiadali ste o obnovu hesla do aplikácie e-housing. Otvorte odkaz zo systémového emailu Supabase a nastavte si nové heslo. Ak ste o obnovu hesla nežiadali, túto správu ignorujte."
    }
  ],
  notificationLog: [
    { time: "Dnes 09:12", type: "Udalosť", subject: "Odstávka teplej vody", status: "Email pripravený pre vlastníkov" }
  ],
  buildingPhotoUrl: "",
  operationModeText: "Live testovací režim",
  gdprText: "",
  gdprVersion: "GDPR-SVB-2026-01",
  gdprRequired: true,
  liveChatWidgetCode: "",
  liveChatEnabled: false,
  pendingDeepLink: null,
  appNotificationsEnabled: false,
  lastNotificationSeenAt: ""
};

const titles = {
  overview: "Prehľad domu",
  documents: "Dokumenty",
  documentHistory: "História dokumentov",
  billing: "Vyúčtovanie",
  executions: "Exekúcie",
  finance: "Hospodárenie",
  messages: "Komunikácia",
  votes: "Hlasovanie",
  calendar: "Kalendár",
  activities: "Denník",
  photoAlbum: "Fotoalbum",
  profile: "Profil",
  owners: "Vlastníci a byty",
  emails: "E-mail šablóny",
  logs: "Logy",
  settings: "Nastavenia"
};

const SUPABASE_URL = "https://ifyyflvxqkazndkwffvm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_FfyzT0LPWKbDoeQYzDXMSw_bID7XfvC";
const BUILDING_ID = "38600000-0000-0000-0000-000000000386";
const STORAGE_BUCKET = "e-housing-files";
const PUBLIC_ASSETS_BUCKET = "e-housing-public";
const BUILDING_PHOTO_SETTING_KEY = "building_login_photo_path";
const OPERATION_MODE_SETTING_KEY = "operation_mode_text";
const GDPR_TEXT_SETTING_KEY = "gdpr_notice_text";
const GDPR_VERSION_SETTING_KEY = "gdpr_notice_version";
const GDPR_REQUIRED_SETTING_KEY = "gdpr_required";
const ROLE_PERMISSIONS_SETTING_KEY = "role_permissions";
const COMMUNICATION_PERMISSIONS_SETTING_KEY = "communication_permissions";
const LIVE_CHAT_WIDGET_SETTING_KEY = "live_chat_widget_code";
const LIVE_CHAT_ENABLED_SETTING_KEY = "live_chat_enabled";
const LIVE_APP_URL = "https://e-housing-zeta.vercel.app";
const NOTIFICATION_APP_URL = "https://svbdruzstevna386.vercel.app";
const REMEMBER_LOGIN_KEY = "eHousingRememberLogin";
const APP_NOTIFICATIONS_KEY = "eHousingAppNotifications";
const APP_NOTIFICATION_LAST_PREFIX = "eHousingLastNotification:";
const APP_NOTIFICATION_POLL_MS = 45000;
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: supabaseAuthStorage()
  }
});

let notificationPollTimer = null;
let notificationPollBusy = false;

const ROLE_DEFINITIONS = [
  ["chair", "Predseda SVB"],
  ["vice_chair", "Podpredseda SVB"],
  ["economic", "Ekonomická správa"],
  ["board", "Dozorná rada"],
  ["owner", "Vlastník nehnuteľnosti"]
];

const PERMISSION_VIEWS = [
  "overview",
  "documents",
  "documentHistory",
  "votes",
  "billing",
  "executions",
  "finance",
  "messages",
  "calendar",
  "activities",
  "photoAlbum",
  "owners",
  "emails",
  "logs",
  "settings",
  "profile"
];

const COMMUNICATION_PERMISSION_LABELS = {
  publicDiscussion: "Verejná diskusia všetkým vlastníkom",
  individualOwners: "Nová súkromná správa konkrétnemu vlastníkovi",
  leadership: "Nová súkromná správa predsedovi, podpredsedovi, dozornej rade alebo ekonomickej správe",
  replyOnly: "Odpovedať v existujúcej konverzácii",
  voteComments: "Vyjadrovať sa k hlasovaniam"
};

const VOTE_TYPE_OPTIONS = [
  {
    id: "present_majority",
    label: "Nadpolovičná väčšina prítomných",
    short: "Prítomní > 50 %",
    threshold: "viac ako 1/2 hlasov prítomných alebo zúčastnených",
    note: "Bežné otázky, ak zákon nevyžaduje vyššie kvórum."
  },
  {
    id: "all_majority",
    label: "Nadpolovičná väčšina všetkých vlastníkov",
    short: "Všetci > 50 %",
    threshold: "viac ako 1/2 hlasov všetkých vlastníkov",
    note: "Otázky, pri ktorých zákon vyžaduje väčšinu všetkých vlastníkov."
  },
  {
    id: "two_thirds_all",
    label: "Dvojtretinová väčšina všetkých vlastníkov",
    short: "Všetci 2/3",
    threshold: "aspoň 2/3 hlasov všetkých vlastníkov",
    note: "Závažné rozhodnutia podľa § 14b ods. 2 zákona č. 182/1993 Z. z."
  },
  {
    id: "all_owners",
    label: "Súhlas všetkých vlastníkov",
    short: "100 % vlastníkov",
    threshold: "súhlas všetkých vlastníkov bytov a nebytových priestorov",
    note: "Rozhodnutia, pri ktorých zákon vyžaduje jednomyseľný súhlas."
  },
  {
    id: "repeat_one_year_two_thirds",
    label: "Opakované hlasovanie do 1 roka - 2/3 všetkých",
    short: "Opakovanie 2/3",
    threshold: "aspoň 2/3 hlasov všetkých vlastníkov",
    note: "Opätovné rozhodovanie o tej istej veci do jedného roka, ak pôvodne stačila nižšia väčšina."
  },
  {
    id: "repeat_one_year_four_fifths",
    label: "Opakované hlasovanie do 1 roka - 4/5 všetkých",
    short: "Opakovanie 4/5",
    threshold: "aspoň 4/5 hlasov všetkých vlastníkov",
    note: "Opätovné rozhodovanie o veci, ktorá pôvodne vyžadovala dvojtretinovú väčšinu."
  }
];

function authRedirectUrl() {
  const origin = window.location.origin;
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) return `${origin}/`;
  return `${LIVE_APP_URL}/`;
}

function rememberLoginEnabled() {
  return localStorage.getItem(REMEMBER_LOGIN_KEY) !== "false";
}

function setRememberLogin(enabled) {
  localStorage.setItem(REMEMBER_LOGIN_KEY, enabled ? "true" : "false");
  if (!enabled) clearStoredSupabaseAuth(localStorage);
}

function supabaseAuthStorage() {
  return {
    getItem(key) {
      const preferred = rememberLoginEnabled() ? localStorage : sessionStorage;
      const fallback = rememberLoginEnabled() ? sessionStorage : null;
      return preferred.getItem(key) || fallback?.getItem(key) || null;
    },
    setItem(key, value) {
      const preferred = rememberLoginEnabled() ? localStorage : sessionStorage;
      const other = rememberLoginEnabled() ? sessionStorage : localStorage;
      preferred.setItem(key, value);
      other.removeItem(key);
    },
    removeItem(key) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  };
}

function clearStoredSupabaseAuth(storage) {
  Object.keys(storage)
    .filter((key) => key.startsWith("sb-") && key.includes("-auth-token"))
    .forEach((key) => storage.removeItem(key));
}

function readDeepLinkFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const detailType = params.get("detailType");
  const detailId = params.get("detailId");
  if (!view && !detailType && !detailId) return null;
  return { view, detailType, detailId };
}

function applyDeepLinkView() {
  const link = state.pendingDeepLink;
  if (!link?.view || !canAccessView(link.view)) return;
  state.view = link.view;
}

function schedulePendingDeepLinkDetail() {
  const link = state.pendingDeepLink;
  if (!link || !state.loggedIn || isPendingOwner()) return;
  if (link.view && !canAccessView(link.view)) {
    state.pendingDeepLink = null;
    return;
  }
  if (!link.detailType || !link.detailId) {
    state.pendingDeepLink = null;
    return;
  }
  state.pendingDeepLink = null;
  setTimeout(() => {
    if (link.detailType === "photo") {
      openPhotoPreview(link.detailId);
      return;
    }
    openDetailDialog(link.detailType, link.detailId);
  }, 0);
}

function defaultRolePermissions() {
  const empty = () => Object.fromEntries(PERMISSION_VIEWS.map((view) => [view, { read: false, write: false, delete: false }]));
  const full = () => Object.fromEntries(PERMISSION_VIEWS.map((view) => [view, { read: true, write: !["profile", "logs"].includes(view), delete: !["profile", "logs"].includes(view) }]));
  const permissions = {
    chair: full(),
    vice_chair: full(),
    economic: full(),
    board: empty(),
    owner: empty()
  };

  ["overview", "documents", "documentHistory", "votes", "billing", "executions", "finance", "messages", "calendar", "activities", "photoAlbum", "profile"].forEach((view) => {
    permissions.board[view].read = true;
    permissions.owner[view].read = true;
  });
  ["messages", "activities", "photoAlbum"].forEach((view) => {
    permissions.board[view].write = true;
  });
  permissions.board.activities.delete = true;
  permissions.board.messages.delete = true;

  ["messages", "finance", "photoAlbum"].forEach((view) => {
    permissions.owner[view].write = true;
  });
  permissions.owner.messages.delete = false;
  permissions.owner.finance.delete = false;
  permissions.owner.photoAlbum.delete = false;

  return permissions;
}

function defaultCommunicationPermissions() {
  const empty = () => Object.fromEntries(Object.keys(COMMUNICATION_PERMISSION_LABELS).map((key) => [key, false]));
  const permissions = Object.fromEntries(ROLE_DEFINITIONS.map(([role]) => [role, empty()]));
  ["chair", "vice_chair", "economic", "board"].forEach((role) => {
    permissions[role] = {
      publicDiscussion: true,
      individualOwners: true,
      leadership: true,
      replyOnly: true,
      voteComments: true
    };
  });
  permissions.owner = {
    publicDiscussion: true,
    individualOwners: false,
    leadership: false,
    replyOnly: true,
    voteComments: true
  };
  return permissions;
}

function rolePermissions() {
  return state.rolePermissions || defaultRolePermissions();
}

function permissionFor(role = state.role, view = state.view) {
  const permissions = rolePermissions();
  return permissions?.[role]?.[view] || { read: false, write: false, delete: false };
}

function communicationPermissions() {
  return state.communicationPermissions || defaultCommunicationPermissions();
}

function communicationPermissionFor(role = state.role, action = "publicDiscussion") {
  return Boolean(communicationPermissions()?.[role]?.[action]);
}

function defaultGdprText() {
  return `Informácie o spracúvaní osobných údajov pre aplikáciu e-housing

Prevádzkovateľ: SVB a NP Družstevná 386, zastúpené predsedom SVB alebo poverenou osobou správou domu.

Účel spracúvania: vedenie elektronickej evidencie vlastníkov bytov a členov orgánov SVB, sprístupňovanie dokumentov domu, komunikácia medzi SVB a vlastníkmi, evidencia hlasovaní a vyjadrení, zverejňovanie vyúčtovaní priradených ku konkrétnemu vlastníkovi, evidencia denníka činností, hospodárenia, podnetov, fotoalbumu a zasielanie nevyhnutných notifikácií.

Kategórie osobných údajov: meno a priezvisko, email, telefón, číslo bytu alebo poznámka k bytu, rola používateľa, stav autorizácie účtu, údaje o vlastníctve uvádzané v aplikácii, údaje o dlhu ak sú vedené, obsah správ, komentárov, hlasovaní, denníkových záznamov a dokumentov priradených k používateľovi.

Právny základ: plnenie zákonných a zmluvných povinností súvisiacich so správou bytového domu a oprávnený záujem SVB na efektívnej a preukázateľnej komunikácii s vlastníkmi. Pri technicky dobrovoľných funkciách, ktoré nie sú nevyhnutné na správu domu, môže byť právnym základom aj súhlas používateľa. Potvrdenie pri registrácii znamená oboznámenie sa s týmito informáciami; nejde o súhlas tam, kde spracúvanie vyplýva zo zákonnej povinnosti alebo oprávneného záujmu.

Príjemcovia a sprostredkovatelia: autorizovaní používatelia aplikácie podľa pridelených rolí, poskytovatelia technickej infraštruktúry použití pre aplikáciu, najmä Supabase na autentifikáciu, databázu a úložisko, Vercel na webhosting a Gmail/Google na odosielanie emailových notifikácií. Prístup je obmedzený podľa rolí v aplikácii.

Doba uchovávania: osobné údaje sa uchovávajú počas trvania vlastníckeho alebo funkčného vzťahu k domu a následne počas doby potrebnej na preukazovanie práv a povinností SVB, archiváciu dokumentov, účtovné a právne nároky. Účet alebo nepotrebné údaje sa majú vymazať alebo obmedziť, keď pominie účel spracúvania, ak ich ďalšie uchovanie nevyžaduje právny predpis alebo oprávnený záujem.

Práva dotknutej osoby: používateľ má právo na prístup k údajom, opravu, výmaz alebo obmedzenie spracúvania v prípadoch podľa GDPR, právo namietať proti spracúvaniu založenému na oprávnenom záujme, právo na prenosnosť pri údajoch spracúvaných na základe súhlasu alebo zmluvy automatizovane a právo podať návrh alebo sťažnosť na Úrad na ochranu osobných údajov SR.

Bezpečnosť: aplikácia používa prihlasovanie, roly, schvaľovanie registrácie a databázové pravidlá prístupu. Používatelia sú povinní chrániť svoje heslo a nesprístupňovať údaje neoprávneným osobám.

Kontakt pre uplatnenie práv: predseda SVB alebo poverená osoba správy domu na kontaktoch zverejnených v aplikácii.`;
}

const loginScreen = document.querySelector("#loginScreen");
const appShell = document.querySelector("#appShell");
const loginForm = document.querySelector("#loginForm");
const loginRole = document.querySelector("#loginRole");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginRemember = document.querySelector("#loginRemember");
const showRegisterBtn = document.querySelector("#showRegisterBtn");
const forgotPasswordBtn = document.querySelector("#forgotPasswordBtn");
const registerPanel = document.querySelector("#registerPanel");
const registerOwnerBtn = document.querySelector("#registerOwnerBtn");
const root = document.querySelector("#viewRoot");
const title = document.querySelector("#viewTitle");
const newItemBtn = document.querySelector("#newItemBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const mobileMenuBackBtn = document.querySelector("#mobileMenuBackBtn");
const dialog = document.querySelector("#actionDialog");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogBody = document.querySelector("#dialogBody");
const dialogSave = document.querySelector("#dialogSave");
const installBtn = document.querySelector("#installBtn");
const sidebarSummaryText = document.querySelector("#sidebarSummaryText");
const loginBuildingImage = document.querySelector("#loginBuildingImage");
const headerBuildingImage = document.querySelector("#headerBuildingImage");
const operationModeLabel = document.querySelector("#operationModeLabel");
const sidebarProfilePhoto = document.querySelector("#sidebarProfilePhoto");
const sidebarProfileName = document.querySelector("#sidebarProfileName");
const sidebarProfileRole = document.querySelector("#sidebarProfileRole");

let installPrompt = null;
let mobileViewOpen = false;

if (loginRemember) loginRemember.checked = rememberLoginEnabled();

dialog?.addEventListener("close", () => {
  if (dialogBody.querySelector(".video-frame iframe")) {
    dialogBody.innerHTML = "";
  }
  dialog.classList.remove("video-dialog");
});

function isMobileLayout() {
  return window.matchMedia("(max-width: 980px)").matches;
}

function syncMobileLayout() {
  if (!appShell) return;
  const shouldShowView = isMobileLayout() && mobileViewOpen && state.loggedIn;
  appShell.classList.toggle("mobile-view-open", shouldShowView);
  if (!isMobileLayout()) mobileViewOpen = false;
}

function openMobileMenu() {
  mobileViewOpen = false;
  syncMobileLayout();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", () => installPwa("desktop"));

async function installPwa(platform = "desktop") {
  if (installPrompt) {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installBtn.hidden = true;
    return;
  }
  openInstallHelp(platform);
}

function openInstallHelp(platform = "desktop") {
  const instructions = {
    android: [
      "Otvorte aplikáciu v prehliadači Chrome na Androide.",
      "V menu prehliadača zvoľte Pridať na plochu alebo Inštalovať aplikáciu.",
      "Potvrďte inštaláciu. Ikona e-housing sa zobrazí medzi aplikáciami."
    ],
    macos: [
      "Otvorte aplikáciu v Chrome alebo Edge na macOS.",
      "Kliknite na ikonu inštalácie v adresnom riadku alebo v menu prehliadača zvoľte Inštalovať e-housing.",
      "Po potvrdení sa e-housing otvorí ako samostatná aplikácia."
    ],
    windows: [
      "Otvorte aplikáciu v Chrome alebo Edge na počítači s Windows.",
      "Kliknite na ikonu inštalácie v adresnom riadku alebo v menu prehliadača zvoľte Aplikácie a Inštalovať e-housing.",
      "Po potvrdení sa aplikácia spustí v samostatnom okne a ikonu nájdete v ponuke Štart."
    ],
    ios: [
      "Otvorte aplikáciu v Safari na iPhone alebo iPade.",
      "Klepnite na tlačidlo Zdieľať.",
      "Vyberte Pridať na plochu a potvrďte názov e-housing.",
      "Pre systémové notifikácie otvorte aplikáciu z ikony na ploche a v Profile povoľte notifikácie."
    ],
    desktop: [
      "Otvorte aplikáciu v Chrome alebo Edge.",
      "Použite ikonu inštalácie v adresnom riadku alebo menu prehliadača.",
      "Po potvrdení bude e-housing dostupný ako samostatná aplikácia."
    ]
  }[platform] || [];

  dialogSave.hidden = true;
  dialogTitle.textContent = "Inštalácia aplikácie";
  dialogBody.innerHTML = `
    <article class="card">
      <p class="muted">Táto verzia je pripravená ako PWA aplikácia pre Android, macOS, iOS aj Windows.</p>
      <ol class="question-list">
        ${instructions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ol>
    </article>
  `;
  dialog.showModal();
  enhanceIcons();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === "PASSWORD_RECOVERY" && session?.user) {
      state.currentUserId = session.user.id;
      state.currentUserEmail = session.user.email || state.currentUserEmail;
      openPasswordRecoveryDialog();
    }
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginEmail.value.trim() || "predsedaSVB@gmail.com";
  const savedPassword = state.passwords[email];
  setRememberLogin(loginRemember?.checked !== false);
  if (supabaseClient && loginPassword.value) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: loginPassword.value });
    if (error) {
      window.alert(`Prihlásenie zlyhalo: ${error.message}`);
      return;
    }
    const applied = await applySupabaseSession(data.session);
    if (!applied) return;
  } else {
    if (savedPassword !== undefined && savedPassword !== loginPassword.value) {
      window.alert("Nesprávne heslo pre zadaný účet.");
      return;
    }
    state.loggedIn = true;
    state.role = loginRole.value;
    state.currentUserEmail = email;
  }
  render();
});

showRegisterBtn.addEventListener("click", () => {
  registerPanel.classList.toggle("hidden");
  enhanceIcons();
});

forgotPasswordBtn?.addEventListener("click", () => openForgotPasswordDialog());

document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-copyright-legal]")) return;
  event.preventDefault();
  openCopyrightDialog();
});

document.querySelectorAll("[data-toggle-password]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.querySelector(`#${button.dataset.togglePassword}`);
    if (!input) return;
    const shouldShow = input.type === "password";
    input.type = shouldShow ? "text" : "password";
    button.setAttribute("aria-label", shouldShow ? "Skryť heslo" : "Zobraziť heslo");
    button.innerHTML = `<i data-lucide="${shouldShow ? "eye-off" : "eye"}"></i>`;
    enhanceIcons();
  });
});

function openForgotPasswordDialog(prefillEmail = loginEmail.value.trim()) {
  dialogSave.hidden = false;
  dialogTitle.textContent = "Obnova hesla";
  dialogBody.innerHTML = `
    <article class="notice">
      <strong>Reset hesla cez email</strong>
      <p>Na zadaný email odošleme bezpečný odkaz. Po otvorení odkazu si používateľ nastaví nové heslo priamo v aplikácii.</p>
    </article>
    ${fieldsWithValues([["resetEmail", "Email používateľa", prefillEmail || "", "email"]])}
  `;
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await sendPasswordResetEmail(document.querySelector("#resetEmail")?.value.trim(), "login");
  };
  dialog.showModal();
  enhanceIcons();
}

function openPasswordRecoveryDialog() {
  dialogSave.hidden = false;
  dialogTitle.textContent = "Nastavenie nového hesla";
  dialogBody.innerHTML = fieldsWithValues([
    ["recoveryPassword", "Nové heslo", "", "password"],
    ["recoveryPasswordRepeat", "Zopakovať nové heslo", "", "password"]
  ]);
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveRecoveredPassword();
  };
  dialog.showModal();
  enhanceIcons();
}

async function sendPasswordResetEmail(email, source = "login") {
  if (!email) {
    window.alert("Zadajte email používateľa.");
    return;
  }
  if (!supabaseClient) {
    window.alert("Reset hesla je dostupný po napojení na Supabase Auth.");
    return;
  }
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: authRedirectUrl() });
  if (error) {
    window.alert(`Reset hesla sa nepodarilo odoslať: ${error.message}`);
    return;
  }
  state.notificationLog.unshift({ time: "Teraz", type: "Reset hesla", subject: email, status: "Email s odkazom na zmenu hesla bol odoslaný cez Supabase Auth" });
  if (state.currentUserId) {
    await writeActivityLog("password_reset", source === "owner" ? `Odoslaný reset hesla vlastníkovi: ${email}` : `Vyžiadaný reset hesla: ${email}`, {
      relatedTable: "profiles",
      relatedId: state.currentUserId,
      metadata: { targetEmail: email, source }
    });
  }
  dialog.close();
  window.alert("Email s odkazom na zmenu hesla bol odoslaný.");
  render();
}

async function sendOwnerPasswordReset(id) {
  if (!canEditItem("owner")) return;
  const owner = state.owners.find((item) => String(item.id) === String(id) || String(item.profileId) === String(id));
  if (!owner) return;
  const email = owner.loginEmail || owner.email;
  if (!email) {
    window.alert("Vlastník nemá vyplnený login email.");
    return;
  }
  const confirmed = window.confirm(`Odoslať vlastníkovi ${owner.name} reset hesla na email ${email}?`);
  if (!confirmed) return;
  await sendPasswordResetEmail(email, "owner");
}

async function saveRecoveredPassword() {
  const password = document.querySelector("#recoveryPassword")?.value || "";
  const repeat = document.querySelector("#recoveryPasswordRepeat")?.value || "";
  if (!password || password !== repeat) {
    window.alert("Heslá sa nezhodujú alebo sú prázdne.");
    return;
  }
  const { error } = await supabaseClient.auth.updateUser({ password });
  if (error) {
    window.alert(`Heslo sa nepodarilo zmeniť: ${error.message}`);
    return;
  }
  state.passwords[state.currentUserEmail] = password;
  loginPassword.value = password;
  await writeActivityLog("profile", "Zmena hesla cez reset email", {
    relatedTable: "profiles",
    relatedId: state.currentUserId,
    metadata: { passwordRecovered: true }
  });
  dialog.close();
  window.alert("Heslo bolo zmenené. Teraz sa môžete prihlásiť novým heslom.");
}

registerOwnerBtn.addEventListener("click", async () => {
  const requestedRole = document.querySelector("#registerRole")?.value || "owner";
  const name = document.querySelector("#registerName").value.trim() || "Nový vlastník";
  const flat = document.querySelector("#registerFlat").value.trim() || "Nový byt";
  const email = document.querySelector("#registerEmail").value.trim() || "vlastnik@example.com";
  const password = document.querySelector("#registerPassword").value;
  const passwordRepeat = document.querySelector("#registerPasswordRepeat")?.value || "";
  const gdprAccepted = Boolean(document.querySelector("#registerGdprAccepted")?.checked);
  const gdprWarning = document.querySelector("#registerGdprWarning");
  const passwordWarning = document.querySelector("#registerPasswordWarning");
  if (gdprWarning) gdprWarning.classList.add("hidden");
  if (passwordWarning) passwordWarning.classList.add("hidden");
  if (!password || password !== passwordRepeat) {
    if (passwordWarning) passwordWarning.classList.remove("hidden");
    return;
  }
  if (state.gdprRequired && !gdprAccepted) {
    if (gdprWarning) gdprWarning.classList.remove("hidden");
    return;
  }
  const gdprAcceptedAt = new Date().toISOString();
  if (supabaseClient && password) {
    let { data, error } = await registerSupabaseUser({ email, password, name, flat, requestedRole, gdprAccepted, gdprAcceptedAt });
    if (error && /already registered|already exists|user already/i.test(error.message || "")) {
      const cleanup = await cleanupOrphanAuthUser(email);
      if (cleanup.cleaned) {
        ({ data, error } = await registerSupabaseUser({ email, password, name, flat, requestedRole, gdprAccepted, gdprAcceptedAt }));
      }
    }
    if (error) {
      window.alert(`Registrácia zlyhala: ${error.message}`);
      return;
    }
    if (data.session) {
      await applyRegistrationSession(data.session, { requestedRole, name, flat, email, password, gdprAcceptedAt });
    } else {
      window.alert("Registrácia bola prijatá. Po schválení predsedom SVB sa prihláste cez úvodné prihlasovacie okno.");
      return;
    }
    render();
    return;
  }
  state.passwords[email] = password;
  if (["vice_chair", "economic", "board"].includes(requestedRole)) {
    const leadershipRole = requestedRole === "vice_chair" ? "Podpredseda SVB" : requestedRole === "economic" ? "Ekonomická správa" : "Člen dozornej rady";
    state.boardMembers.push({ id: Date.now(), role: leadershipRole, name, email, phone: "", note: `Registrácia role ${leadershipRole} cez úvodné okno` });
    state.notificationLog.unshift({ time: "Teraz", type: "Registrácia", subject: name, status: `Účet role ${leadershipRole} bol vytvorený pre ${email}` });
  } else {
    state.owners.push({
      flat,
      name,
      share: "0,00 %",
      email,
      loginEmail: email,
      accountStatus: "Čaká na autorizáciu",
      approvalStatus: "pending",
      ownedFrom: new Date().toISOString().slice(0, 10),
      isDebtor: false,
      debtAmount: 0,
      gdprAcceptedAt,
      gdprVersion: state.gdprVersion,
      status: "Registrácia prijatá",
      note: "Registrácia vlastníka čaká na kontrolu predsedu"
    });
    state.notificationLog.unshift({ time: "Teraz", type: "Registrácia", subject: name, status: `Automatický email po registrácii odoslaný na ${email}` });
  }
  state.role = requestedRole;
  loginRole.value = requestedRole;
  loginEmail.value = email;
  state.currentUserEmail = email;
  state.loggedIn = true;
  render();
});

logoutBtn.addEventListener("click", () => {
  if (supabaseClient) supabaseClient.auth.signOut();
  stopAppNotificationWatcher();
  state.loggedIn = false;
  mobileViewOpen = false;
  render();
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    if (!canAccessView(button.dataset.view)) return;
    state.view = button.dataset.view;
    mobileViewOpen = isMobileLayout();
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item === button));
    render();
    if (isMobileLayout()) window.scrollTo({ top: 0, behavior: "auto" });
  });
});

mobileMenuBackBtn?.addEventListener("click", openMobileMenu);
window.addEventListener("resize", syncMobileLayout);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") checkForNewAppNotifications();
});

newItemBtn.addEventListener("click", () => openCreateDialog());

function roleLabel() {
  return { chair: "Predseda SVB", vice_chair: "Podpredseda SVB", economic: "Ekonomická správa", board: "Dozorná rada", owner: "Vlastník nehnuteľnosti" }[state.role];
}

function roleFieldToAppRole(value, fallback = "board") {
  if (value === "Predseda SVB") return "chair";
  if (value === "Podpredseda SVB") return "vice_chair";
  if (value === "Ekonomická správa") return "economic";
  if (value === "Člen dozornej rady" || value === "Dozorná rada") return "board";
  return fallback;
}

async function registerSupabaseUser({ email, password, name, flat, requestedRole, gdprAccepted, gdprAcceptedAt }) {
  return supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authRedirectUrl(),
      data: {
        full_name: name,
        flat_number: flat,
        role: requestedRole,
        gdpr_accepted: gdprAccepted,
        gdpr_accepted_at: gdprAcceptedAt,
        gdpr_version: state.gdprVersion
      }
    }
  });
}

async function cleanupOrphanAuthUser(email) {
  try {
    const { data, error } = await supabaseClient.functions.invoke("cleanup-orphan-auth-user", {
      body: { email }
    });
    if (error || data?.error) return { cleaned: false, reason: data?.reason || data?.error || error?.message };
    return data || { cleaned: false };
  } catch (error) {
    return { cleaned: false, reason: error?.message || "cleanup_failed" };
  }
}

async function applyRegistrationSession(session, { requestedRole, name, flat, email, password, gdprAcceptedAt }) {
  if (!session?.user) return false;
  const user = session.user;
  state.loggedIn = true;
  state.currentUserId = user.id;
  state.currentUserEmail = user.email || email;
  state.authEmail = user.email || email;
  state.role = requestedRole;
  loadNotificationPreferences();
  loginRole.value = requestedRole;
  loginEmail.value = user.email || email;
  state.passwords[email] = password;

  await waitForRegistrationProfile(user, requestedRole);
  await loadSupabaseData();

  if (requestedRole === "owner" && !currentOwner()) {
    state.owners.push({
      id: user.id,
      profileId: user.id,
      flat,
      name,
      share: "0,00 %",
      email,
      loginEmail: email,
      accountStatus: "Čaká na autorizáciu",
      approvalStatus: "pending",
      ownedFrom: new Date().toISOString().slice(0, 10),
      isDebtor: false,
      debtAmount: 0,
      gdprAcceptedAt,
      gdprVersion: state.gdprVersion,
      status: "Registrácia prijatá",
      note: "Registrácia vlastníka čaká na kontrolu predsedu"
    });
  }

  if (["vice_chair", "economic", "board"].includes(requestedRole) && !state.boardMembers.some((member) => member.email === email)) {
    const leadershipRole = requestedRole === "vice_chair" ? "Podpredseda SVB" : requestedRole === "economic" ? "Ekonomická správa" : "Člen dozornej rady";
    state.boardMembers.push({ id: user.id, role: leadershipRole, name, email, phone: "", note: `Registrácia role ${leadershipRole} cez úvodné okno` });
  }

  state.notificationLog.unshift({ time: "Teraz", type: "Registrácia", subject: name, status: `Registrácia bola prijatá pre ${email}` });
  await writeActivityLog("create", `Registrácia používateľa: ${name}`, {
    relatedTable: "profiles",
    relatedId: user.id,
    metadata: { requestedRole, flat, email }
  });
  startAppNotificationWatcher();
  return true;
}

async function waitForRegistrationProfile(user, requestedRole) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: profile } = await supabaseClient.from("profiles").select("id, role").eq("id", user.id).maybeSingle();
    if (profile) {
      state.role = profile.role || requestedRole;
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return false;
}

async function applySupabaseSession(session) {
  if (!session?.user) return false;
  const user = session.user;
  state.loggedIn = true;
  state.currentUserId = user.id;
  state.currentUserEmail = user.email;
  state.authEmail = user.email;
  loadNotificationPreferences();
  loginEmail.value = user.email;
  const profileReady = await ensureCurrentProfile(user);
  if (!profileReady) {
    await supabaseClient.auth.signOut();
    state.loggedIn = false;
    state.currentUserId = "";
    state.currentUserEmail = "";
    state.authEmail = "";
    window.alert("Tento prihlasovací účet už nie je evidovaný v aplikácii. Ak má byť vytvorený znova, použite novú registráciu alebo kontaktujte predsedu SVB.");
    return false;
  }
  await loadSupabaseData();
  if (state.role === "owner" && !currentOwner()) {
    await supabaseClient.auth.signOut();
    state.loggedIn = false;
    state.currentUserId = "";
    state.currentUserEmail = "";
    state.authEmail = "";
    window.alert("Tento vlastník už nie je evidovaný v aplikácii. Účet bol pravdepodobne vymazaný predsedom SVB.");
    return false;
  }
  applyDeepLinkView();
  await writeActivityLog("login", "Prihlásenie používateľa do aplikácie", { relatedTable: "profiles", relatedId: state.currentUserId });
  startAppNotificationWatcher();
  return true;
}

async function ensureCurrentProfile(user) {
  if (!supabaseClient || !user) return false;
  const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) {
    return false;
  }
  const { data: nextProfile } = await supabaseClient.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (nextProfile) {
    state.role = nextProfile.role;
    return true;
  }
  return false;
}

async function loadSupabaseData() {
  if (!supabaseClient || !state.loggedIn) return;
  const [profiles, ownerRecords, categories, documents, billingSettlements, executionCases, financeEntries, innovationIdeas, innovationComments, announcements, events, messages, votes, voteQuestions, voteAnswers, voteComments, activities, photos, templates, notifications, activityLogs] = await Promise.all([
    supabaseClient.from("profiles").select("*").order("created_at", { ascending: true }),
    supabaseClient.from("owner_records").select("*").order("flat_number", { ascending: true }),
    supabaseClient.from("document_categories").select("*").order("sort_order", { ascending: true }),
    supabaseClient.from("documents").select("*").order("published_at", { ascending: false }).order("created_at", { ascending: false }),
    supabaseClient.from("billing_settlements").select("*, owner:profiles!billing_settlements_owner_profile_id_fkey(full_name, flat_number, email)").order("settlement_year", { ascending: false }).order("created_at", { ascending: false }),
    supabaseClient.from("execution_cases").select("*").order("updated_at", { ascending: false }).order("created_at", { ascending: false }),
    supabaseClient.from("finance_entries").select("*").order("finance_year", { ascending: false }).order("entry_date", { ascending: false }).order("created_at", { ascending: false }),
    supabaseClient.from("innovation_ideas").select("*, creator:profiles!innovation_ideas_created_by_fkey(full_name, role, flat_number)").order("created_at", { ascending: false }),
    supabaseClient.from("innovation_comments").select("*, author:profiles!innovation_comments_profile_id_fkey(full_name, role, flat_number)").order("created_at", { ascending: true }),
    supabaseClient.from("announcements").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("events").select("*").order("starts_at", { ascending: true }),
    supabaseClient.from("messages").select("*, sender:profiles!messages_sender_id_fkey(full_name, role), recipient:profiles!messages_recipient_id_fkey(full_name, flat_number)").order("created_at", { ascending: false }),
    supabaseClient.from("votes").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("vote_questions").select("*").order("sort_order", { ascending: true }),
    supabaseClient.from("vote_answers").select("vote_id, question_id, profile_id, comment, answer, voter:profiles!vote_answers_profile_id_fkey(full_name, flat_number, email)"),
    supabaseClient.from("vote_comments").select("*, author:profiles!vote_comments_profile_id_fkey(full_name, role, flat_number), recipient:profiles!vote_comments_recipient_id_fkey(full_name, role)").order("created_at", { ascending: true }),
    supabaseClient.from("activities").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("photos").select("*, creator:profiles!photos_created_by_fkey(full_name, role)").order("created_at", { ascending: false }),
    supabaseClient.from("email_templates").select("*").order("title", { ascending: true }),
    supabaseClient.from("notification_log").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(500)
  ]);

  if (ownerRecords.data) {
    state.owners = ownerRecords.data.map(ownerRecordToOwner);
  } else if (profiles.data) {
    state.owners = profiles.data.filter((item) => item.role === "owner").map(profileToOwner);
  }
  if (profiles.data) {
    state.boardMembers = profiles.data.filter((item) => item.role !== "owner").map(profileToBoardMember);
  }
  if (categories.data) state.documentCategories = categories.data.map((item) => item.name);
  if (documents.data) {
    const documentCards = await Promise.all(documents.data.map(dbDocumentToCard));
    state.documents = documentCards.filter((item) => !item.isHistory && isCurrentYearDocument(item)).sort(sortByDocumentDateDesc);
    state.documentHistory = documentCards.filter((item) => item.isHistory || !isCurrentYearDocument(item)).map(documentToHistoryCard).sort(sortByDocumentDateDesc);
  }
  if (billingSettlements.data) state.billingSettlements = await Promise.all(billingSettlements.data.map(dbBillingSettlementToCard));
  if (executionCases.data) state.executionCases = executionCases.data.map(dbExecutionCaseToCard);
  if (financeEntries.data) state.financeEntries = financeEntries.data.map(dbFinanceEntryToCard);
  if (innovationComments.data) state.innovationComments = innovationComments.data.map(dbInnovationCommentToCard);
  if (innovationIdeas.data) state.innovationIdeas = await Promise.all(innovationIdeas.data.map(dbInnovationIdeaToCard));
  if (announcements.data) state.announcements = await Promise.all(announcements.data.map(dbAnnouncementToCard));
  if (events.data) state.events = events.data.map(dbEventToCard).sort(sortByEventDateAsc);
  if (messages.data) state.messages = messages.data.map(dbMessageToCard);
  if (voteComments.data) state.voteComments = voteComments.data.map(dbVoteCommentToCard);
  if (votes.data) state.votes = votes.data.map((item) => dbVoteToCard(item, voteAnswers.data || [], voteQuestions.data || [], state.voteComments));
  if (activities.data) state.activities = activities.data.map(dbActivityToCard);
  if (photos.data) state.photos = await Promise.all(photos.data.map(dbPhotoToCard));
  if (templates.data) state.emailTemplates = templates.data.map(dbTemplateToCard);
  ensureDefaultEmailTemplates();
  if (notifications.data) state.notificationLog = notifications.data.map((item) => ({
    id: item.id,
    time: item.created_at ? formatDateTime(item.created_at) : "Supabase",
    type: item.channel,
    subject: item.subject,
    status: item.error || "Záznam uložený",
    relatedTable: item.related_table,
    relatedId: item.related_id,
    recipientId: item.recipient_id
  }));
  if (activityLogs.data) state.activityLogs = activityLogs.data.map(dbActivityLogToCard);
}

async function loadPublicSettings() {
  if (!supabaseClient) return;
  const { data } = await supabaseClient
    .from("app_settings")
    .select("key, value")
    .in("key", [BUILDING_PHOTO_SETTING_KEY, OPERATION_MODE_SETTING_KEY, GDPR_TEXT_SETTING_KEY, GDPR_VERSION_SETTING_KEY, GDPR_REQUIRED_SETTING_KEY, ROLE_PERMISSIONS_SETTING_KEY, COMMUNICATION_PERMISSIONS_SETTING_KEY, LIVE_CHAT_WIDGET_SETTING_KEY, LIVE_CHAT_ENABLED_SETTING_KEY]);
  const settings = new Map((data || []).map((item) => [item.key, item.value]));
  const buildingPhotoPath = settings.get(BUILDING_PHOTO_SETTING_KEY);
  const operationModeText = settings.get(OPERATION_MODE_SETTING_KEY);
  state.buildingPhotoUrl = buildingPhotoPath ? publicStorageUrl(buildingPhotoPath) : "";
  state.operationModeText = operationModeText || "Live testovací režim";
  state.gdprText = settings.get(GDPR_TEXT_SETTING_KEY) || defaultGdprText();
  state.gdprVersion = settings.get(GDPR_VERSION_SETTING_KEY) || "GDPR-SVB-2026-01";
  state.gdprRequired = (settings.get(GDPR_REQUIRED_SETTING_KEY) || "true") !== "false";
  state.rolePermissions = parseRolePermissions(settings.get(ROLE_PERMISSIONS_SETTING_KEY));
  state.communicationPermissions = parseCommunicationPermissions(settings.get(COMMUNICATION_PERMISSIONS_SETTING_KEY));
  state.liveChatWidgetCode = settings.get(LIVE_CHAT_WIDGET_SETTING_KEY) || "";
  state.liveChatEnabled = (settings.get(LIVE_CHAT_ENABLED_SETTING_KEY) || "false") === "true";
  syncAppChrome();
}

function parseRolePermissions(value) {
  if (!value) return defaultRolePermissions();
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return normalizeRolePermissions(parsed);
  } catch {
    return defaultRolePermissions();
  }
}

function normalizeRolePermissions(input = {}) {
  const defaults = defaultRolePermissions();
  ROLE_DEFINITIONS.forEach(([role]) => {
    if (!input[role]) input[role] = {};
    PERMISSION_VIEWS.forEach((view) => {
      input[role][view] = {
        read: Boolean(input[role][view]?.read ?? defaults[role]?.[view]?.read),
        write: Boolean(input[role][view]?.write ?? defaults[role]?.[view]?.write),
        delete: Boolean(input[role][view]?.delete ?? defaults[role]?.[view]?.delete)
      };
      if (input[role][view].write || input[role][view].delete) input[role][view].read = true;
    });
  });
  return input;
}

function parseCommunicationPermissions(value) {
  if (!value) return defaultCommunicationPermissions();
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return normalizeCommunicationPermissions(parsed);
  } catch {
    return defaultCommunicationPermissions();
  }
}

function normalizeCommunicationPermissions(input = {}) {
  const defaults = defaultCommunicationPermissions();
  ROLE_DEFINITIONS.forEach(([role]) => {
    if (!input[role]) input[role] = {};
    Object.keys(COMMUNICATION_PERMISSION_LABELS).forEach((action) => {
      input[role][action] = Boolean(input[role][action] ?? defaults[role]?.[action]);
    });
  });
  return input;
}

function profileToOwner(item) {
  return {
    id: item.id,
    profileId: item.id,
    flat: item.flat_number || "Bez bytu",
    name: item.full_name,
    share: "0,00 %",
    email: item.email,
    loginEmail: item.email,
    phone: item.phone || "",
    correspondenceStreet: item.correspondence_street || "",
    correspondenceCity: item.correspondence_city || "",
    correspondencePostalCode: item.correspondence_postal_code || "",
    photoPath: item.profile_photo_path || "",
    photoUrl: profilePhotoUrl(item.profile_photo_path),
    accountStatus: item.approval_status === "approved" ? "Aktívny" : "Čaká na autorizáciu",
    approvalStatus: item.approval_status,
    ownedFrom: item.owned_from || "",
    isDebtor: item.is_debtor,
    debtAmount: item.debt_amount,
    status: item.approval_status,
    note: item.note || ""
  };
}

function ownerRecordToOwner(item) {
  return {
    id: item.id,
    profileId: item.profile_id,
    flat: item.flat_number || "Bez bytu",
    name: item.full_name,
    share: item.share_text || "0,00 %",
    email: item.login_email || "",
    loginEmail: item.login_email || "",
    phone: item.phone || "",
    correspondenceStreet: item.correspondence_street || "",
    correspondenceCity: item.correspondence_city || "",
    correspondencePostalCode: item.correspondence_postal_code || "",
    photoPath: "",
    photoUrl: "",
    accountStatus: item.account_status || "Čaká na autorizáciu",
    approvalStatus: item.approval_status || "pending",
    ownedFrom: item.owned_from || "",
    isDebtor: item.is_debtor,
    debtAmount: item.debt_amount,
    status: item.account_status || item.approval_status,
    note: item.note || ""
  };
}

function profileToBoardMember(item) {
  const role = item.role === "chair" ? "Predseda SVB" : item.role === "vice_chair" ? "Podpredseda SVB" : item.role === "economic" ? "Ekonomická správa" : "Člen dozornej rady";
  return { id: item.id, role, name: item.full_name, flat: item.flat_number || "Nie je viazané na byt", email: item.email, phone: item.phone || "", note: item.note || "Profil vedenia SVB", photoPath: item.profile_photo_path || "", photoUrl: profilePhotoUrl(item.profile_photo_path) };
}

async function dbDocumentToCard(item) {
  const fileUrl = await signedStorageUrl(item.storage_path);
  return { id: item.id, title: item.title, type: item.category, category: item.category, date: item.published_at || item.created_at, author: "SVB", owner: "SVB", visibility: item.description || "Všetci vlastníci", note: item.description || "", urgent: item.is_urgent, storagePath: item.storage_path, fileUrl, youtubeUrl: item.youtube_url || "", isHistory: item.is_history };
}

function documentYear(item) {
  const date = new Date(item?.date || item?.publishedAt || item?.createdAt || 0);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
}

function isCurrentYearDocument(item) {
  return documentYear(item) === new Date().getFullYear();
}

function documentDateForSave(value, fallback = null) {
  const normalized = value || fallback || new Date().toISOString().slice(0, 10);
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : normalized.slice(0, 10);
}

function itemDateTimestamp(item, keys = ["date", "startsAt", "publishedAt", "createdAt"]) {
  const value = keys.map((key) => item?.[key]).find(Boolean);
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function sortByDocumentDateDesc(a, b) {
  return itemDateTimestamp(b, ["date", "publishedAt", "createdAt"]) - itemDateTimestamp(a, ["date", "publishedAt", "createdAt"]);
}

function sortByEventDateAsc(a, b) {
  return itemDateTimestamp(a, ["startsAt", "date", "createdAt"]) - itemDateTimestamp(b, ["startsAt", "date", "createdAt"]);
}

function documentTypeOptions() {
  const defaults = ["Pozvánka", "Zápisnica", "Tlačivo", "Zmluva", "Zmluvy nájmov", "Iné zmluvy", "Cenová ponuka", "Iné dokumenty"];
  return [...new Set([...defaults, ...state.documentCategories])].filter(Boolean);
}

function documentToHistoryCard(item) {
  return { id: item.id, title: item.title, category: item.category || item.type, date: item.date, owner: item.owner || item.author || "SVB", note: item.note || item.visibility || "", storagePath: item.storagePath, fileUrl: item.fileUrl, youtubeUrl: item.youtubeUrl || "" };
}

async function dbAnnouncementToCard(item) {
  const fileUrl = await signedStorageUrl(item.storage_path);
  return { id: item.id, title: item.title, body: item.body, date: item.created_at, category: item.category, urgent: item.is_urgent, storagePath: item.storage_path, fileUrl, youtubeUrl: item.youtube_url || "" };
}

function dbEventToCard(item) {
  const date = new Date(item.starts_at);
  return { id: item.id, day: date.getDate(), date: date.toISOString().slice(0, 10), startsAt: item.starts_at, title: item.title, note: item.description || "" };
}

function dbMessageToCard(item) {
  const scope = item.scope === "public" ? "Verejná diskusia" : "Súkromná správa";
  const recipient = item.recipient
    ? `${item.recipient.full_name}${item.recipient.flat_number ? ` · ${item.recipient.flat_number}` : ""}`
    : item.recipient_label || (item.scope === "public" ? "Verejná diskusia" : "Súkromný adresát");
  return { id: item.id, parentId: item.parent_id, senderId: item.sender_id, recipientId: item.recipient_id, recipientLabel: item.recipient_label || recipient, scopeRaw: item.scope, scope, from: item.sender?.full_name || "Používateľ", to: recipient, subject: item.subject, text: item.body, createdAt: item.created_at, date: new Date(item.created_at).toLocaleString("sk-SK"), read: Boolean(item.read_at) };
}

function voteAnswerOwner(answer) {
  const owner = state.owners.find((item) => item.profileId === answer.profile_id);
  const voter = answer.voter || {};
  return {
    name: voter.full_name || owner?.name || "Neznámy vlastník",
    flat: voter.flat_number || owner?.flat || "Bez bytu",
    email: voter.email || owner?.loginEmail || owner?.email || ""
  };
}

function dbVoteToCard(item, answers = [], questions = [], comments = []) {
  const voteAnswers = answers.filter((answer) => answer.vote_id === item.id);
  const voteQuestions = questions.filter((question) => question.vote_id === item.id);
  const mappedQuestions = voteQuestions.map((question) => {
    const questionAnswers = voteAnswers.filter((answer) => answer.question_id === question.id);
    const myAnswer = questionAnswers.find((answer) => answer.profile_id === state.currentUserId);
    return {
      id: question.id,
      text: question.question,
      sortOrder: question.sort_order,
      yes: questionAnswers.filter((answer) => answer.answer === "Za").length,
      no: questionAnswers.filter((answer) => answer.answer === "Proti").length,
      abstain: questionAnswers.filter((answer) => answer.answer === "Zdržal sa").length,
      myAnswer: myAnswer?.answer || "",
      voters: questionAnswers.map((answer) => ({ profileId: answer.profile_id, ...voteAnswerOwner(answer), answer: answer.answer, comment: answer.comment || "" }))
    };
  });
  const voteThread = comments.filter((comment) => comment.voteId === item.id);
  const electronicVoters = new Set(voteAnswers.map((answer) => answer.profile_id).filter(Boolean)).size;
  return { id: item.id, title: item.title, description: item.description || "", type: item.vote_type || "present_majority", createdAt: item.created_at || item.closes_at || "", closes: item.closes_at || "", status: item.status, yes: item.yes_count, no: item.no_count, abstain: item.abstain_count, comments: voteThread.length || voteAnswers.filter((answer) => answer.comment).length, electronicVoters, questions: mappedQuestions, thread: voteThread };
}

function dbVoteCommentToCard(item) {
  return {
    id: item.id,
    voteId: item.vote_id,
    parentId: item.parent_id || null,
    authorId: item.profile_id,
    recipientId: item.recipient_id,
    author: item.author?.full_name || "Používateľ",
    authorRole: item.author?.role || "",
    flat: item.author?.flat_number || "",
    recipient: item.recipient?.full_name || "Predseda SVB",
    visibility: item.visibility || "public",
    body: item.body,
    date: item.created_at,
    updatedAt: item.updated_at || null
  };
}

function dbActivityToCard(item) {
  return { id: item.id, month: item.month, person: item.person, role: item.role, title: item.title, hours: Number(item.hours || 0), status: item.status, note: item.note || "" };
}

async function dbPhotoToCard(item) {
  let image = "building-placeholder.svg";
  if (item.storage_path) {
    image = await signedStorageUrl(item.storage_path) || image;
  }
  return { id: item.id, title: item.title, category: item.category, author: item.creator?.full_name || "Používateľ", date: item.created_at, description: item.description || "", image, storagePath: item.storage_path };
}

async function dbBillingSettlementToCard(item) {
  const fileUrl = await signedStorageUrl(item.storage_path);
  const owner = item.owner || {};
  return {
    id: item.id,
    title: item.title,
    year: item.settlement_year,
    ownerProfileId: item.owner_profile_id,
    ownerName: owner.full_name || "Vlastník nehnuteľnosti",
    flat: owner.flat_number || "Bez bytu",
    email: owner.email || "",
    note: item.note || "",
    storagePath: item.storage_path,
    fileUrl,
    date: item.created_at
  };
}

function dbExecutionCaseToCard(item) {
  const owner = state.owners.find((ownerItem) => String(ownerItem.id) === String(item.owner_record_id) || String(ownerItem.profileId) === String(item.owner_profile_id));
  return {
    id: item.id,
    ownerRecordId: item.owner_record_id,
    ownerProfileId: item.owner_profile_id,
    ownerName: item.owner_name || owner?.name || "Neurčený vlastník",
    flat: item.flat_number || owner?.flat || "Bez bytu",
    email: item.owner_email || owner?.email || owner?.loginEmail || "",
    debtAmount: Number(item.debt_amount || 0),
    debtSince: item.debt_since || "",
    status: item.status || "Evidovaný dlh",
    legalStatus: item.legal_status || "",
    debtHistory: item.debt_history || "",
    executionTitleStatus: item.execution_title_status || "",
    lastActionDate: item.last_action_date || item.updated_at || item.created_at,
    nextStepDate: item.next_step_date || "",
    note: item.note || "",
    title: item.title || "Vymáhanie nedoplatku",
    createdAt: item.created_at,
    updatedAt: item.updated_at
  };
}

function dbFinanceEntryToCard(item) {
  return {
    id: item.id,
    type: item.entry_type,
    title: item.title,
    amount: Number(item.amount || 0),
    year: Number(item.finance_year || new Date(item.entry_date || item.created_at).getFullYear()),
    date: item.entry_date || item.created_at,
    note: item.note || ""
  };
}

async function dbInnovationIdeaToCard(item) {
  const quoteUrl = await signedStorageUrl(item.quote_storage_path);
  return {
    id: item.id,
    title: item.title,
    description: item.description || "",
    status: item.status || "Nový podnet",
    estimatedCost: Number(item.estimated_cost || 0),
    year: Number(item.finance_year || new Date(item.created_at).getFullYear()),
    quoteStoragePath: item.quote_storage_path,
    quoteUrl,
    author: item.creator?.full_name || "Používateľ",
    authorRole: item.creator?.role || "",
    flat: item.creator?.flat_number || "",
    createdAt: item.created_at,
    comments: state.innovationComments.filter((comment) => comment.ideaId === item.id)
  };
}

function dbInnovationCommentToCard(item) {
  return {
    id: item.id,
    ideaId: item.idea_id,
    profileId: item.profile_id,
    body: item.body,
    author: item.author?.full_name || "Používateľ",
    role: item.author?.role || "",
    flat: item.author?.flat_number || "",
    date: item.created_at
  };
}

function dbActivityLogToCard(item) {
  return {
    id: item.id,
    actorId: item.actor_id,
    actorEmail: item.actor_email || "",
    actorName: item.actor_name || item.actor_email || "Používateľ",
    actorRole: item.actor_role || "Neznáma rola",
    activityType: item.activity_type || "activity",
    activityLabel: item.activity_label || "Aktivita",
    relatedTable: item.related_table || "",
    relatedId: item.related_id || "",
    metadata: item.metadata || {},
    createdAt: item.created_at
  };
}

function publicStorageUrl(path) {
  if (!path || !supabaseClient) return "";
  return supabaseClient.storage.from(PUBLIC_ASSETS_BUCKET).getPublicUrl(path).data?.publicUrl || "";
}

function profilePhotoUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("blob:") || pathOrUrl.startsWith("data:")) return pathOrUrl;
  return publicStorageUrl(pathOrUrl);
}

function profilePhotoFallback() {
  return "./icon-192.png";
}

async function signedStorageUrl(path) {
  if (!path || !supabaseClient) return "";
  const { data, error } = await supabaseClient.storage.from(STORAGE_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) return "";
  return data?.signedUrl || "";
}

function dbTemplateToCard(item) {
  return { id: item.id, title: item.title, subject: item.subject, body: item.body, key: item.key };
}

function ensureDefaultEmailTemplates() {
  const defaults = state.emailTemplates.filter((template) => template.key || template.id);
  const hasPasswordReset = defaults.some((template) => template.key === "password-reset" || template.id === "password-reset");
  const hasNotificationDetail = defaults.some((template) => template.key === "notification-detail" || template.id === "notification-detail");
  const hasMessageToChair = defaults.some((template) => template.key === "message-to-chair" || template.id === "message-to-chair");
  if (!hasNotificationDetail) {
    state.emailTemplates.push({
      id: "notification-detail",
      key: "notification-detail",
      title: "Notifikácia udalosti s odkazom",
      subject: "{{eventType}}: {{title}}",
      body: "Dobrý deň,\n\nv aplikácii e-housing bola vytvorená alebo upravená udalosť.\n\nTyp udalosti: {{eventType}}\nZáložka: {{section}}\nNázov: {{title}}\n\n{{message}}\n\nDetail otvoríte kliknutím na tento odkaz:\n{{actionUrl}}"
    });
  }
  if (!hasPasswordReset) {
    state.emailTemplates.push({
      id: "password-reset",
      key: "password-reset",
      title: "Reset hesla",
      subject: "Obnova hesla do e-housing",
      body: "Dobrý deň, požiadali ste o obnovu hesla do aplikácie e-housing. Otvorte odkaz zo systémového emailu Supabase a nastavte si nové heslo. Ak ste o obnovu hesla nežiadali, túto správu ignorujte."
    });
  }
  if (!hasMessageToChair) {
    state.emailTemplates.push({
      id: "message-to-chair",
      key: "message-to-chair",
      title: "Notifikácia predsedovi o správe",
      subject: "Nová správa pre predsedu SVB: {{subject}}",
      body: "Dobrý deň,\n\nv aplikácii e-housing bola vytvorená správa, ktorú má predseda SVB preveriť.\n\nTyp správy: {{scope}}\nOdosielateľ: {{sender}}\nPredmet: {{subject}}\nKomu: {{recipient}}\n\nText správy:\n{{message}}\n\nProsíme, prihláste sa do aplikácie e-housing a pozrite si detail komunikácie."
    });
  }
}

function assertSupabaseOk(response) {
  if (response?.error) throw new Error(response.error.message);
  return response;
}

function diaryRoleLabel() {
  if (state.role === "vice_chair") return "Podpredseda SVB";
  if (state.role === "board") return "Člen dozornej rady";
  if (state.role === "economic") return "Ekonomická správa";
  return "Predseda SVB";
}

function diaryPersonName() {
  if (state.role === "vice_chair") return "Podpredseda SVB";
  if (state.role === "economic") return "Ekonomická správa";
  return state.role === "board" ? "Člen dozornej rady" : "Martin Nagy";
}

function canManageAll() {
  return ["chair", "vice_chair", "economic"].includes(state.role);
}

function canManageExecutions() {
  return ["chair", "vice_chair"].includes(state.role);
}

function canEditDiary() {
  return permissionFor(state.role, "activities").write;
}

function canUseMessages() {
  return permissionFor(state.role, "messages").read || permissionFor(state.role, "messages").write;
}

function canSendEmailNotifications() {
  return ["chair", "vice_chair", "economic", "board"].includes(state.role);
}

function canViewLogs() {
  return permissionFor(state.role, "logs").read;
}

function canAccessView(view = state.view) {
  return permissionFor(state.role, view).read;
}

function canCreateInView(view = state.view) {
  if (view === "votes") return state.role === "chair";
  return permissionFor(state.role, view).write;
}

function firstAccessibleView() {
  const orderedViews = [
    "overview",
    "documents",
    "documentHistory",
    "votes",
    "billing",
    "executions",
    "finance",
    "messages",
    "calendar",
    "activities",
    "photoAlbum",
    "owners",
    "emails",
    "logs",
    "settings",
    "profile"
  ];
  return orderedViews.find((view) => canAccessView(view)) || "profile";
}

function canEditItem(type) {
  if (type === "vote") return state.role === "chair";
  return permissionFor(state.role, viewForItemType(type)).write;
}

function canDeleteItem(type, item = null) {
  if (type === "vote") return state.role === "chair";
  return permissionFor(state.role, viewForItemType(type)).delete;
}

function viewForItemType(type) {
  return {
    announcement: "overview",
    document: "documents",
    historyDocument: "documentHistory",
    billingSettlement: "billing",
    executionCase: "executions",
    financeEntry: "finance",
    innovationIdea: "finance",
    message: "messages",
    vote: "votes",
    event: "calendar",
    activity: "activities",
    photo: "photoAlbum",
    owner: "owners",
    boardMember: "owners",
    emailTemplate: "emails",
    activityLog: "logs"
  }[type] || type;
}

function notificationMetaFor(relatedTable, relatedId, options = {}) {
  const tableDefaults = {
    announcements: { view: "overview", detailType: "announcement", sectionLabel: titles.overview },
    documents: { view: "documents", detailType: "document", sectionLabel: titles.documents },
    billing_settlements: { view: "billing", detailType: "billingSettlement", sectionLabel: titles.billing },
    execution_cases: { view: "executions", detailType: "executionCase", sectionLabel: titles.executions },
    messages: { view: "messages", detailType: "message", sectionLabel: titles.messages },
    events: { view: "calendar", detailType: "event", sectionLabel: titles.calendar },
    activities: { view: "activities", detailType: "activity", sectionLabel: titles.activities },
    photos: { view: "photoAlbum", detailType: "photo", sectionLabel: titles.photoAlbum },
    votes: { view: "votes", detailType: "vote", sectionLabel: titles.votes },
    vote_comments: { view: "votes", detailType: "vote", sectionLabel: titles.votes },
    owner_records: { view: "owners", detailType: "owner", sectionLabel: titles.owners }
  };
  const base = tableDefaults[relatedTable] || {};
  const view = options.view || base.view || "overview";
  const detailType = options.detailType || base.detailType || "";
  const detailId = options.detailId || relatedId || "";
  const sectionLabel = options.sectionLabel || base.sectionLabel || titles[view] || "Aplikácia";
  const actionUrl = options.actionUrl || notificationActionUrl(view, detailType, detailId);
  return {
    view,
    detailType,
    detailId,
    sectionLabel,
    eventType: options.eventType || "",
    actionUrl
  };
}

function notificationActionUrl(view, detailType = "", detailId = "") {
  const url = new URL("/", NOTIFICATION_APP_URL);
  if (view) url.searchParams.set("view", view);
  if (detailType) url.searchParams.set("detailType", detailType);
  if (detailId) url.searchParams.set("detailId", detailId);
  return url.toString();
}

function appNotificationsSupported() {
  return "Notification" in window && "serviceWorker" in navigator;
}

function appNotificationsEnabled() {
  return localStorage.getItem(APP_NOTIFICATIONS_KEY) === "true";
}

function currentNotificationLastKey() {
  return `${APP_NOTIFICATION_LAST_PREFIX}${state.currentUserId || "anonymous"}`;
}

function loadNotificationPreferences() {
  state.appNotificationsEnabled = appNotificationsEnabled();
  state.lastNotificationSeenAt = localStorage.getItem(currentNotificationLastKey()) || "";
}

function saveNotificationSeenAt(value) {
  state.lastNotificationSeenAt = value || new Date().toISOString();
  if (state.currentUserId) localStorage.setItem(currentNotificationLastKey(), state.lastNotificationSeenAt);
}

function notificationPermissionText() {
  if (!appNotificationsSupported()) return "Tento prehliadač systémové notifikácie pre PWA nepodporuje.";
  if (Notification.permission === "granted" && state.appNotificationsEnabled) return "Notifikácie sú zapnuté pre toto zariadenie.";
  if (Notification.permission === "denied") return "Notifikácie sú v prehliadači alebo systéme zablokované. Povoľte ich v nastaveniach zariadenia.";
  if (state.appNotificationsEnabled) return "Notifikácie sú zapnuté v aplikácii, čaká sa na povolenie prehliadača.";
  return "Notifikácie sú vypnuté. Zapnúť ich môže iba prihlásený používateľ priamym kliknutím.";
}

async function enableAppNotifications() {
  if (!appNotificationsSupported()) {
    window.alert("Tento prehliadač nepodporuje systémové notifikácie pre PWA aplikácie.");
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") {
    localStorage.setItem(APP_NOTIFICATIONS_KEY, "false");
    state.appNotificationsEnabled = false;
    window.alert("Notifikácie neboli povolené. Povolenie môžete zmeniť v nastaveniach prehliadača alebo zariadenia.");
    render();
    return;
  }
  localStorage.setItem(APP_NOTIFICATIONS_KEY, "true");
  state.appNotificationsEnabled = true;
  saveNotificationSeenAt(new Date().toISOString());
  await registration.showNotification("e-housing notifikácie zapnuté", {
    body: "Odteraz sa nové notifikácie pre váš účet zobrazia aj ako systémové upozornenie.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: "e-housing-notifications-enabled",
    data: { url: notificationActionUrl("overview") }
  });
  startAppNotificationWatcher();
  render();
}

function disableAppNotifications() {
  localStorage.setItem(APP_NOTIFICATIONS_KEY, "false");
  state.appNotificationsEnabled = false;
  stopAppNotificationWatcher();
  render();
}

function startAppNotificationWatcher() {
  stopAppNotificationWatcher();
  if (!state.loggedIn || !state.currentUserId || !state.appNotificationsEnabled || !appNotificationsSupported() || Notification.permission !== "granted") return;
  notificationPollTimer = window.setInterval(() => checkForNewAppNotifications(), APP_NOTIFICATION_POLL_MS);
  checkForNewAppNotifications({ silent: true });
}

function stopAppNotificationWatcher() {
  if (notificationPollTimer) window.clearInterval(notificationPollTimer);
  notificationPollTimer = null;
  notificationPollBusy = false;
}

async function checkForNewAppNotifications({ silent = false } = {}) {
  if (notificationPollBusy || !supabaseClient || !state.currentUserId || !state.appNotificationsEnabled || Notification.permission !== "granted") return;
  notificationPollBusy = true;
  try {
    const lastSeen = state.lastNotificationSeenAt || localStorage.getItem(currentNotificationLastKey()) || new Date().toISOString();
    if (!state.lastNotificationSeenAt) saveNotificationSeenAt(lastSeen);
    const { data, error } = await supabaseClient
      .from("notification_log")
      .select("id, subject, channel, error, created_at, related_table, related_id, recipient_id")
      .eq("recipient_id", state.currentUserId)
      .is("error", null)
      .gt("created_at", lastSeen)
      .order("created_at", { ascending: true })
      .limit(10);
    if (error) return;
    const items = data || [];
    if (items.length) saveNotificationSeenAt(items[items.length - 1].created_at);
    if (!silent) {
      for (const item of items) await showSystemNotificationForLog(item);
    }
  } finally {
    notificationPollBusy = false;
  }
}

async function showSystemNotificationForLog(item) {
  const meta = notificationMetaFor(item.related_table, item.related_id, {});
  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(item.subject || "Nová notifikácia v e-housing", {
    body: `Záložka: ${meta.sectionLabel}. Kliknutím otvoríte detail v aplikácii.`,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: `e-housing-${item.id}`,
    data: { url: meta.actionUrl }
  });
}

function syncNavigation(forceHide = false) {
  document.querySelectorAll(".nav-item").forEach((button) => {
    const allowed = !forceHide && canAccessView(button.dataset.view);
    button.hidden = !allowed;
    button.classList.toggle("is-hidden", !allowed);
    button.setAttribute("aria-hidden", allowed ? "false" : "true");
    button.tabIndex = allowed ? 0 : -1;
    button.disabled = !allowed;
    button.classList.toggle("active", button.dataset.view === state.view && allowed);
  });
}

function syncBuildingImages() {
  const imageUrl = state.buildingPhotoUrl || "./building-placeholder.svg";
  if (loginBuildingImage) loginBuildingImage.src = imageUrl;
  if (headerBuildingImage) headerBuildingImage.src = imageUrl;
}

function syncProfileChrome() {
  const profile = state.loggedIn ? currentProfile() : null;
  if (sidebarProfilePhoto) sidebarProfilePhoto.src = profile?.photoUrl || profilePhotoFallback();
  if (sidebarProfileName) sidebarProfileName.textContent = profile?.name || "Používateľ";
  if (sidebarProfileRole) sidebarProfileRole.textContent = profile?.role || "Profil";
}

function syncAppChrome() {
  syncBuildingImages();
  syncProfileChrome();
  if (operationModeLabel) operationModeLabel.textContent = state.operationModeText || "Live testovací režim";
  const registerGdprText = document.querySelector("#registerGdprText");
  if (registerGdprText) {
    registerGdprText.innerHTML = `<p><strong>Verzia:</strong> ${escapeHtml(state.gdprVersion)}</p>${escapeHtml(state.gdprText || defaultGdprText()).replaceAll("\n", "<br>")}`;
  }
  syncLiveChatWidget();
}

function extractTawkScriptSrc(widgetCode = "") {
  const match = String(widgetCode).match(/https:\/\/embed\.tawk\.to\/[^'"\s<>]+/i);
  return match?.[0] || "";
}

function removeLiveChatWidget() {
  document.querySelectorAll("[data-live-chat-widget='tawk']").forEach((item) => item.remove());
}

function syncLiveChatWidget() {
  const src = state.liveChatEnabled ? extractTawkScriptSrc(state.liveChatWidgetCode) : "";
  const existing = document.querySelector("script[data-live-chat-widget='tawk']");
  if (!src) {
    removeLiveChatWidget();
    return;
  }
  if (existing?.src === src) return;
  removeLiveChatWidget();
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  script.dataset.liveChatWidget = "tawk";
  document.body.appendChild(script);
}

function currentOwner() {
  return state.owners.find((owner) => owner.profileId === state.currentUserId || owner.loginEmail === state.currentUserEmail || owner.email === state.currentUserEmail);
}

function currentBoardMember() {
  if (state.role === "chair") return state.boardMembers.find((member) => member.role === "Predseda SVB") || state.boardMembers[0];
  if (state.role === "vice_chair") return state.boardMembers.find((member) => member.role === "Podpredseda SVB") || state.boardMembers[0];
  if (state.role === "economic") return state.boardMembers.find((member) => member.role === "Ekonomická správa") || state.boardMembers[0];
  return state.boardMembers.find((member) => member.email === state.currentUserEmail) || state.boardMembers.find((member) => member.role === "Člen dozornej rady");
}

function currentProfile() {
  if (state.role === "owner") {
    const owner = currentOwner();
    return {
      kind: "owner",
      source: owner,
      name: owner?.name || "Vlastník nehnuteľnosti",
      flat: owner?.flat || "Čaká na doplnenie",
      email: owner?.loginEmail || owner?.email || state.currentUserEmail,
      phone: owner?.phone || "",
      correspondenceStreet: owner?.correspondenceStreet || "",
      correspondenceCity: owner?.correspondenceCity || "",
      correspondencePostalCode: owner?.correspondencePostalCode || "",
      photoPath: owner?.photoPath || "",
      photoUrl: owner?.photoUrl || "",
      role: "Vlastník nehnuteľnosti",
      readonlyNote: owner?.ownedFrom ? `Vlastník od ${owner.ownedFrom}` : "Kontaktné a korešpondenčné údaje si môže vlastník upraviť v profile"
    };
  }
  const member = currentBoardMember();
  return {
    kind: "board",
    source: member,
    name: member?.name || (state.role === "chair" ? "Martin Nagy" : roleLabel()),
    flat: member?.flat || "Nie je viazané na byt",
    email: member?.email || state.currentUserEmail,
    phone: member?.phone || "",
    correspondenceStreet: "",
    correspondenceCity: "",
    correspondencePostalCode: "",
    photoPath: member?.photoPath || "",
    photoUrl: member?.photoUrl || "",
    role: member?.role || roleLabel(),
    readonlyNote: "Funkcia vo vedení SVB"
  };
}

async function writeActivityLog(activityType, activityLabelText, options = {}) {
  if (!supabaseClient || !state.currentUserId) return;
  try {
    const profile = currentProfile();
    const payload = {
      actor_id: state.currentUserId,
      actor_email: state.currentUserEmail || state.authEmail || profile?.email || "",
      actor_name: profile?.name || state.currentUserEmail || "Používateľ",
      actor_role: profile?.role || roleLabel() || state.role,
      activity_type: activityType,
      activity_label: activityLabelText,
      related_table: options.relatedTable || null,
      related_id: options.relatedId ? String(options.relatedId) : null,
      metadata: options.metadata || {}
    };
    const { error } = await supabaseClient.from("activity_logs").insert(payload);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.warn("Activity log write failed", error);
  }
}

function isPendingOwner() {
  const owner = currentOwner();
  return state.role === "owner" && (!owner || owner.approvalStatus !== "approved");
}

const COPYRIGHT_LEGAL_TEXT = `Autorské práva a ochrana aplikácie

Aplikácia e-housing, jej názov, grafické rozhranie, dizajn, texty, databázy, funkcionality, štruktúra, zdrojový kód, používateľské prvky, dokumentácia, logo, vizuálna identita a ďalší obsah sú chránené autorským právom a ďalšími príslušnými právnymi predpismi.

Všetky práva k aplikácii patria jej autorovi, prevádzkovateľovi alebo oprávnenému držiteľovi práv, pokiaľ nie je výslovne uvedené inak. Používateľovi sa sprístupnením aplikácie neudeľuje žiadne vlastnícke právo k aplikácii, jej zdrojovému kódu, dizajnu, databázam ani k iným chráneným prvkom. Používateľ získava iba obmedzené, nevýhradné, neprenosné a odvolateľné oprávnenie používať aplikáciu na účel, na ktorý bola vytvorená a sprístupnená.

Aplikácia bola vytvorená aj s využitím nástrojov umelej inteligencie, ktoré slúžili ako pomocný technický a tvorivý nástroj pri návrhu, programovaní, úprave textov, štruktúrovaní funkcionalít alebo pri tvorbe niektorých častí obsahu. Použitie umelej inteligencie nemení skutočnosť, že finálna podoba aplikácie, jej výber, usporiadanie, kontrola, úpravy, dopracovanie, implementácia a zodpovednosť za jej prevádzku patria autorovi alebo prevádzkovateľovi aplikácie.

Používateľ nie je oprávnený aplikáciu ani jej jednotlivé časti kopírovať, upravovať, šíriť, predávať, prenajímať, poskytovať tretím osobám, verejne sprístupňovať, spätne analyzovať, dekompilovať, obchádzať technické ochranné prvky alebo ju používať spôsobom, ktorý by bol v rozpore s jej určením, týmito podmienkami, právnymi predpismi alebo oprávnenými záujmami autora či prevádzkovateľa.

Ak aplikácia obsahuje alebo využíva prvky tretích strán, najmä externé knižnice, fonty, ikony, obrázky, API služby, databázy, AI modely, analytické nástroje alebo iný softvér, tieto prvky sa riadia vlastnými licenčnými podmienkami ich príslušných vlastníkov alebo poskytovateľov. Ich použitie v aplikácii neznamená prevod práv na používateľa ani oprávnenie používať tieto prvky mimo rozsahu povoleného príslušnou licenciou.

Ak aplikácia umožňuje vytváranie, úpravu alebo generovanie obsahu pomocou umelej inteligencie, používateľ berie na vedomie, že takýto obsah môže byť vytvorený automatizovane alebo poloautomatizovane. Používateľ je zodpovedný za kontrolu, ďalšie použitie a prípadné zverejnenie takéhoto obsahu, najmä za to, aby jeho použitím neboli porušené autorské práva, ochranné známky, osobnostné práva, právo na ochranu osobných údajov alebo iné práva tretích osôb.

Je zakázané používať aplikáciu na vytváranie, šírenie alebo spracovanie obsahu, ktorý je nezákonný, zavádzajúci, poškodzujúci, diskriminačný, nenávistný, porušujúci práva tretích osôb alebo inak nevhodný. Prevádzkovateľ si vyhradzuje právo obmedziť alebo zablokovať prístup k aplikácii používateľovi, ktorý poruší tieto podmienky alebo použije aplikáciu v rozpore s jej účelom.

V prípade porušenia autorských práv, licenčných podmienok alebo neoprávneného zásahu do aplikácie si autor alebo prevádzkovateľ vyhradzuje právo uplatniť všetky dostupné právne prostriedky ochrany, vrátane nároku na náhradu škody, vydanie bezdôvodného obohatenia, odstránenie protiprávneho stavu a ďalšie nároky podľa platných právnych predpisov.

© 2026 e-housing / Martin Nagy - ITS. Všetky práva vyhradené.`;

function copyrightFooter() {
  return `<p class="app-copyright"><button type="button" data-copyright-legal>© 2026 e-housing / Martin Nagy - ITS. Všetky práva vyhradené.</button></p>`;
}

function openCopyrightDialog() {
  dialogSave.hidden = true;
  dialogTitle.textContent = "Autorské práva a ochrana aplikácie";
  dialogBody.innerHTML = `<article class="legal-text legal-dialog-text">${escapeHtml(COPYRIGHT_LEGAL_TEXT).replaceAll("\n", "<br>")}</article>`;
  dialog.showModal();
  enhanceIcons();
}

function render() {
  syncAppChrome();
  loginScreen.classList.toggle("hidden", state.loggedIn);
  appShell.classList.toggle("hidden", !state.loggedIn);
  syncMobileLayout();
  if (!state.loggedIn) {
    enhanceIcons();
    return;
  }

  if (isPendingOwner()) {
    title.textContent = "Čaká sa na autorizáciu";
    newItemBtn.hidden = true;
    syncNavigation(true);
    root.innerHTML = `${pendingAuthorizationView()}${copyrightFooter()}`;
    syncMobileLayout();
    enhanceIcons();
    return;
  }

  if (!canAccessView(state.view)) {
    state.view = firstAccessibleView();
  }

  syncNavigation();
  updateSidebarSummary();
  title.textContent = titles[state.view];
  newItemBtn.hidden = !canCreateInView();
  newItemBtn.innerHTML = `${icon("plus")}<span>${actionLabel()}</span>`;
  root.innerHTML = `${views[state.view]()}${copyrightFooter()}`;
  bindViewActions();
  syncMobileLayout();
  enhanceIcons();
  schedulePendingDeepLinkDetail();
}

function updateSidebarSummary() {
  if (!sidebarSummaryText) return;
  const pendingOwners = state.owners.filter((owner) => owner.approvalStatus === "pending").length;
  sidebarSummaryText.textContent = pendingOwners
    ? `${state.owners.length} vlastníkov, ${pendingOwners} čaká na autorizáciu`
    : `${state.owners.length} vlastníkov, žiadny nečaká`;
}

function pendingAuthorizationView() {
  const owner = currentOwner();
  return `
    <section class="panel">
      <span class="tag urgent">Registrácia čaká na potvrdenie</span>
      <h2>Váš účet ešte nebol autorizovaný predsedom SVB</h2>
      <p class="muted">Po registrácii musí predseda SVB overiť, že ste vlastníkom nehnuteľnosti v dome SVB a NP Družstevná 386. Do potvrdenia registrácie nemáte prístup k dokumentom, správam, hlasovaniam ani ostatným údajom domu.</p>
      <div class="grid three">
        ${systemCard("Registrovaný email", owner?.loginEmail || state.currentUserEmail)}
        ${systemCard("Byt", owner?.flat || "Čaká na doplnenie")}
        ${systemCard("Stav", owner?.accountStatus || "Čaká na autorizáciu")}
      </div>
    </section>
  `;
}

function actionLabel() {
  if (state.view === "documents") return "Nahrať dokument";
  if (state.view === "documentHistory") return "Pridať do histórie";
  if (state.view === "billing") return "Pridať vyúčtovanie";
  if (state.view === "executions") return "Pridať exekučný záznam";
  if (state.view === "finance") return canManageAll() ? "Pridať hospodársky záznam" : "Pridať podnet";
  if (state.view === "votes") return "Nové hlasovanie";
  if (state.view === "calendar") return "Pridať udalosť";
  if (state.view === "activities") return "Pridať záznam";
  if (state.view === "photoAlbum") return "Pridať fotku";
  if (state.view === "messages") return "Napísať správu";
  if (state.view === "owners") return "Pridať vlastníka";
  if (state.view === "emails") return "Nová šablóna";
  return "Pridať oznámenie";
}

function overviewRoleCopy({ pendingOwners, urgentDocuments, unreadMessages, openVotes, nextVote }) {
  const commonSystemCards = [
    { head: "Dokumenty", body: "Dokumenty a história sú dostupné podľa oprávnení prihlásenej role.", icon: "folder-open" },
    { head: "Komunikácia", body: "Správy sú dostupné ako verejné vlákna alebo súkromná komunikácia.", icon: "messages-square" },
    { head: "PWA", body: "Aplikácia je pripravená na inštaláciu z prehliadača na Android, macOS, iOS aj Windows.", icon: "smartphone" }
  ];

  if (state.role === "owner") {
    const owner = currentOwner();
    return {
      title: "Prehľad vlastníka nehnuteľnosti",
      subtitle: "Rýchly prístup k oznamom, dokumentom, hlasovaniam, kalendáru a správam relevantným pre vlastníka nehnuteľnosti.",
      stats: [
        { label: "Byt", value: owner?.flat || "Bez údaju", note: owner?.approvalStatus === "approved" ? "autorizovaný vlastník" : "čaká na autorizáciu", icon: "home" },
        { label: "Dokumenty", value: state.documents.length, note: "dostupné na prezeranie a stiahnutie", icon: "file-text" },
        { label: "Otvorené hlasovania", value: openVotes, note: nextVote ? `najbližšie končí ${formatDate(nextVote.closes)}` : "bez otvoreného hlasovania", icon: "vote" },
        { label: "Správy", value: unreadMessages, note: unreadMessages ? "nové alebo neprečítané" : "bez nových správ", icon: "mail" }
      ],
      sideTitle: "Kontakt na vedenie SVB",
      sideHtml: state.boardMembers.map(boardMemberCard).join(""),
      taskTitle: "Moje rýchle odkazy",
      tasks: [
        task("Pozrieť najnovšie dokumenty domu", "Dokumenty", "file-text"),
        task("Otvoriť komunikáciu s predsedom alebo vlastníkmi", "Komunikácia", "messages-square"),
        task("Skontrolovať otvorené hlasovania", "Hlasovania", "vote")
      ].join(""),
      bottomTitle: "Najnovšie dokumenty",
      bottomHtml: state.documents.slice(0, 3).map(documentCard).join(""),
      systemCards: commonSystemCards
    };
  }

  if (state.role === "board") {
    return {
      title: "Kontrolný prehľad dozornej rady",
      subtitle: "Sústredený pohľad na dokumenty, hlasovania, komunikáciu a denník aktivít, ktoré dozorná rada sleduje alebo dopĺňa.",
      stats: [
        { label: "Dokumenty", value: state.documents.length, note: urgentDocuments ? `${urgentDocuments} urgentné` : "bez urgentného dokumentu", icon: "file-check" },
        { label: "Otvorené hlasovania", value: openVotes, note: nextVote ? `najbližšie končí ${formatDate(nextVote.closes)}` : "bez otvoreného hlasovania", icon: "vote" },
        { label: "Neprečítané správy", value: unreadMessages, note: unreadMessages ? "vyžadujú kontrolu" : "všetko prečítané", icon: "mail-open" },
        { label: "Denník", value: state.activities.length, note: "evidované aktivity vedenia domu", icon: "notebook-tabs" }
      ],
      sideTitle: "Vedenie SVB",
      sideHtml: state.boardMembers.map(boardMemberCard).join(""),
      taskTitle: "Kontrolné úlohy",
      tasks: [
        urgentDocuments ? task(`Skontrolovať urgentné dokumenty: ${urgentDocuments}`, "Dokumenty", "file-warning") : "",
        openVotes ? task(`Sledovať otvorené hlasovania: ${openVotes}`, "Hlasovania", "vote") : "",
        task("Doplniť vlastné mesačné aktivity do denníka", "Denník", "notebook-pen")
      ].filter(Boolean).join(""),
      bottomTitle: "Denník za mesiac",
      bottomHtml: state.activities.slice(0, 3).map(activityCard).join(""),
      systemCards: commonSystemCards
    };
  }

  return {
    title: "Digitálna správa domu na jednom mieste",
    subtitle: "Dokumenty, oznamy, hlasovania, denník a komunikácia sú načítané z databázy podľa prihlásenej role.",
    stats: [
      { label: "Vlastníci", value: state.owners.length, note: pendingOwners ? `${pendingOwners} čaká na aktiváciu` : "žiadny nečaká na aktiváciu", icon: "users" },
      { label: "Dokumenty", value: state.documents.length, note: urgentDocuments ? `${urgentDocuments} urgentné` : "bez urgentného dokumentu", icon: "file-text" },
      { label: "Otvorené hlasovania", value: openVotes, note: nextVote ? `najbližšie končí ${formatDate(nextVote.closes)}` : "bez otvoreného hlasovania", icon: "vote" },
      { label: "Neprečítané správy", value: unreadMessages, note: unreadMessages ? "vyžadujú kontrolu" : "všetko prečítané", icon: "mail" }
    ],
    sideTitle: "Vedenie SVB",
    sideHtml: state.boardMembers.map(boardMemberCard).join(""),
    taskTitle: "Čo riešiť dnes",
    tasks: overviewTasks({ pendingOwners, urgentDocuments, unreadMessages, openVotes }),
    bottomTitle: "Denník za mesiac",
    bottomHtml: state.activities.slice(0, 3).map(activityCard).join(""),
    systemCards: [
      { head: "Prístup", body: "Role sú pripravené pre predsedu, dozornú radu a vlastníkov.", icon: "shield-check" },
      { head: "Notifikácie", body: "Každé nové oznámenie, dokument, hlasovanie alebo udalosť bude vedieť odoslať email.", icon: "bell-ring" },
      { head: "PWA", body: "Aplikácia je pripravená na inštaláciu z prehliadača na Android, macOS, iOS aj Windows.", icon: "smartphone" }
    ]
  };
}

const views = {
  overview() {
    const pendingOwners = state.owners.filter((owner) => owner.approvalStatus === "pending").length;
    const urgentDocuments = state.documents.filter((document) => document.urgent).length;
    const openVotes = state.votes.filter((vote) => ["open", "Prebieha", "prebieha"].includes(vote.status)).length;
    const unreadMessages = state.messages.filter((message) => !message.read).length;
    const nextEvent = nextCalendarEvent();
    const nextVote = nextOpenVote();
    const newestDocuments = state.documents.slice(0, 3);
    const newestAnnouncements = state.announcements.slice(0, 3);
    const roleCopy = overviewRoleCopy({ pendingOwners, urgentDocuments, unreadMessages, openVotes, nextVote });
    return `
      <section class="legal-banner">
        <div class="card-icon">${icon("scale")}</div>
        <div>
          <strong>Právny základ správy domu</strong>
          <p>SVB a NP Družstevná 386 sa pri výkone správy domu riadi zákonom č. 182/1993 Z. z. o vlastníctve bytov a nebytových priestorov.</p>
        </div>
        <a class="ghost button-link" href="https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/1993/182/" target="_blank" rel="noreferrer">${icon("external-link")}<span>Oficiálne znenie zákona</span></a>
      </section>
      <section class="overview-hero">
        <div>
          <span class="tag document">SVB a NP Družstevná 386</span>
          <h2>${roleCopy.title}</h2>
          <p class="muted">${roleCopy.subtitle}</p>
        </div>
        <div class="status-strip">
          ${statusMetric("Najbližšia udalosť", nextEvent?.value || "Nie je", nextEvent?.note || "bez plánovanej udalosti")}
          ${statusMetric("Hlasovania", openVotes, nextVote ? `najbližšie končí ${formatDate(nextVote.closes)}` : "bez otvoreného hlasovania")}
          ${statusMetric("Email notifikácie", state.notificationLog.length, "záznamy v databáze")}
        </div>
      </section>
      <div class="grid stats">
        ${roleCopy.stats.map((item) => stat(item.label, item.value, item.note, item.icon)).join("")}
      </div>
      <div class="grid two">
        <section class="panel">
          <h2>Najnovšie oznámenia</h2>
          <div class="list">${newestAnnouncements.map(announcementCard).join("")}</div>
        </section>
        <section class="panel">
          <h2>${roleCopy.sideTitle}</h2>
          <div class="list">${roleCopy.sideHtml}</div>
        </section>
      </div>
      <div class="grid two">
        <section class="panel">
          <h2>${roleCopy.taskTitle}</h2>
          <div class="list">${roleCopy.tasks}</div>
        </section>
        <section class="panel">
          <h2>${roleCopy.bottomTitle}</h2>
          <div class="list">${roleCopy.bottomHtml || newestDocuments.map(documentCard).join("")}</div>
        </section>
      </div>
      <section class="panel">
        <h2>Rýchly stav systému</h2>
        <div class="grid three">
          ${roleCopy.systemCards.map((item) => systemCard(item.head, item.body, item.icon)).join("")}
        </div>
      </section>
    `;
  },
  documents() {
    const docs = state.filter === "all" ? state.documents : state.documents.filter((doc) => doc.type === state.filter);
    return `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h2>Dokumenty aktuálneho roka</h2>
            <p class="muted">Zobrazujú sa dokumenty s dátumom uverejnenia v aktuálnom roku. Staršie alebo budúce roky sú automaticky v histórii dokumentov.</p>
          </div>
          <select class="search wide-select" data-document-filter aria-label="Filter podľa typu dokumentu">
            <option value="all" ${state.filter === "all" ? "selected" : ""}>Všetky typy dokumentov</option>
            ${documentTypeOptions().map((type) => `<option value="${escapeAttr(type)}" ${state.filter === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
          </select>
        </div>
        <div class="list" data-list="documents">
          ${docs.length ? docs.map(documentCard).join("") : systemCard("Bez dokumentov v aktuálnom roku", "Pre vybraný typ zatiaľ nie je v aktuálnom roku zverejnený dokument.", "file-text")}
        </div>
      </section>
    `;
  },
  documentHistory() {
    const items = state.documentHistoryFilter === "all"
      ? state.documentHistory
      : state.documentHistory.filter((item) => item.category === state.documentHistoryFilter);
    const categoryAdminPanel = state.role === "chair" ? `
        <section class="panel">
          <div class="toolbar">
            <h2>Kategórie filtra</h2>
            ${permissionFor(state.role, "documentHistory").write ? `<button class="primary" data-add-category>${icon("plus")}<span>Pridať kategóriu</span></button>` : ""}
          </div>
          <div class="list">${documentTypeOptions().map(categoryRow).join("")}</div>
        </section>
    ` : "";

    return `
      <div class="${state.role === "chair" ? "grid two" : ""}">
        <section class="panel">
          <div class="toolbar">
            <div>
              <h2>Archív a história dokumentov</h2>
              <p class="muted">Prehľad zápisníc, zmlúv, cenových ponúk a ďalších dokumentov dôležitých pre dom.</p>
            </div>
            <select class="search" data-document-history-filter>
              <option value="all" ${state.documentHistoryFilter === "all" ? "selected" : ""}>Všetky kategórie</option>
              ${documentTypeOptions().map((category) => `<option value="${escapeAttr(category)}" ${state.documentHistoryFilter === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
            </select>
          </div>
          <div class="list">${items.map(historyDocumentCard).join("")}</div>
        </section>
        ${categoryAdminPanel}
      </div>
    `;
  },
  billing() {
    const owner = currentOwner();
    const items = state.role === "owner"
      ? state.billingSettlements.filter((item) => item.ownerProfileId === state.currentUserId || item.email === state.currentUserEmail || item.flat === owner?.flat)
      : state.billingSettlements;
    return `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h2>História vyúčtovaní</h2>
            <p class="muted">Súkromné vyúčtovania priradené ku konkrétnemu registrovanému vlastníkovi bytu.</p>
          </div>
          <span class="tag document">${items.length} záznamy</span>
        </div>
        <div class="list">
          ${items.length ? items.map(billingSettlementCard).join("") : systemCard("Bez vyúčtovania", "Pre aktuálneho používateľa zatiaľ nie je zverejnené žiadne vyúčtovanie.", "receipt-text")}
        </div>
      </section>
    `;
  },
  executions() {
    const totalDebt = state.executionCases.reduce((sum, item) => sum + Number(item.debtAmount || 0), 0);
    const activeCount = state.executionCases.filter((item) => !["Ukončené", "Pozastavené"].includes(item.status)).length;
    return `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h2>Exekúcie a vymáhanie nedoplatkov</h2>
            <p class="muted">Evidencia vlastníkov a právneho stavu pohľadávok SVB. Záznamy slúžia ako interný prehľad podkladov, histórie dlhu a ďalších právnych krokov.</p>
          </div>
          <span class="tag urgent">${state.executionCases.length} záznamy</span>
        </div>
        <div class="grid stats">
          ${stat("Aktívne prípady", activeCount, "evidované na ďalší postup", "scale")}
          ${stat("Evidovaný dlh", formatMoney(totalDebt), "súčet dlhov v tejto evidencii", "receipt")}
          ${stat("Prístup", "Čítanie", "všetky role, edituje iba predseda SVB", "shield-check")}
        </div>
        <article class="notice">
          <strong>Právna poznámka</strong>
          <p>Táto časť je evidencia podkladov k vymáhaniu pohľadávok. Posúdenie, či je konkrétny podklad vykonateľným exekučným titulom, musí vychádzať z platných právnych predpisov a konkrétneho rozhodnutia alebo listiny.</p>
        </article>
        <div class="list">
          ${state.executionCases.length ? state.executionCases.map(executionCaseCard).join("") : systemCard("Bez exekučných záznamov", "Zatiaľ nie je evidovaný žiadny vlastník v časti Exekúcie.", "scale")}
        </div>
      </section>
    `;
  },
  finance() {
    const balance = latestFinanceBalance();
    const planned = financeTotal("planned_renovation");
    const other = financeTotal("other_expense");
    const ideas = state.innovationIdeas.reduce((sum, idea) => sum + Number(idea.estimatedCost || 0), 0);
    return `
      <div class="grid two wide-left">
        <section class="panel">
          <div class="toolbar">
            <div>
              <h2>Finančný prehľad domu</h2>
              <p class="muted">Stav bankového účtu, plánované renovácie, iné výdavky a odhadované náklady podnetov vlastníkov.</p>
            </div>
            <span class="tag document">Kategórie sa vyhodnocujú samostatne</span>
          </div>
          <div class="grid stats">
            ${stat("Bankový účet", formatMoney(balance), "posledný zadaný stav", "landmark")}
            ${stat("Renovácie", formatMoney(planned), "plánované výdavky", "paint-roller")}
            ${stat("Iné výdavky", formatMoney(other), "prevádzkové položky", "receipt")}
            ${stat("Podnety", formatMoney(ideas), "odhadované inovácie", "lightbulb")}
          </div>
          ${financeChart(financeRowsByYear())}
          ${financeLineChart(financeRowsByYear())}
          <div class="toolbar">
            <h2>Finančné položky</h2>
            <span class="tag">${state.financeEntries.length} záznamy</span>
          </div>
          <div class="list">${state.financeEntries.length ? state.financeEntries.map(financeEntryCard).join("") : systemCard("Bez finančných položiek", "Predseda SVB zatiaľ nepridal stav účtu ani plánované výdavky.", "chart-column")}</div>
        </section>
        <section class="panel">
          <div class="toolbar">
            <div>
              <h2>Podnety a inovácie</h2>
              <p class="muted">Vlastníci môžu pridávať nápady. Predseda ich doplní o stav, odhadovanú cenu a cenovú ponuku.</p>
            </div>
            <span class="tag vote">${state.innovationIdeas.length} podnety</span>
          </div>
          <div class="list">${state.innovationIdeas.length ? state.innovationIdeas.map(innovationIdeaCard).join("") : systemCard("Bez podnetov", "Zatiaľ nie je zadaný žiadny podnet na inováciu.", "lightbulb")}</div>
        </section>
      </div>
    `;
  },
  messages() {
    const messages = messageThreads().filter((message) =>
      state.messageFilter === "all" || message.scope === state.messageFilter || message.to === state.messageFilter
    );
    return `
      <div class="grid two wide-left">
        <section class="panel">
          <div class="toolbar">
            <div>
              <h2>Správy a vlákna</h2>
              <p class="muted">Čítanie verejných aj súkromných správ podľa oprávnenia role.</p>
            </div>
            <select class="search" data-message-filter>
              <option value="all" ${state.messageFilter === "all" ? "selected" : ""}>Všetky správy</option>
              <option value="Verejná diskusia" ${state.messageFilter === "Verejná diskusia" ? "selected" : ""}>Verejná diskusia</option>
              <option value="Súkromná správa" ${state.messageFilter === "Súkromná správa" ? "selected" : ""}>Súkromné správy</option>
              <option value="Predseda SVB" ${state.messageFilter === "Predseda SVB" ? "selected" : ""}>Predseda SVB</option>
              <option value="Podpredseda SVB" ${state.messageFilter === "Podpredseda SVB" ? "selected" : ""}>Podpredseda SVB</option>
              <option value="Ekonomická správa" ${state.messageFilter === "Ekonomická správa" ? "selected" : ""}>Ekonomická správa</option>
              <option value="Dozorná rada" ${state.messageFilter === "Dozorná rada" ? "selected" : ""}>Dozorná rada</option>
            </select>
          </div>
          <div class="message-list">
            ${messages.map(messageCard).join("")}
          </div>
        </section>
        <section class="panel">
          <h2>Adresáti</h2>
          <div class="list">
            ${systemCard("Verejná diskusia", "Správy k domu, ktoré môžu čítať všetky role.")}
            ${systemCard("Súkromná správa", "Správa smeruje na predsedu, podpredsedu, dozornú radu alebo konkrétneho vlastníka nehnuteľnosti.")}
            ${systemCard("Konkrétny vlastník", "Pri písaní správy si v poli Komu vyberiete vlastníka podľa mena a bytu.")}
          </div>
        </section>
      </div>
    `;
  },
  votes() {
    const votes = filteredVotes();
    const activeVote = currentVote(votes);
    const historyItems = historyVotes(votes, activeVote?.id);
    if (state.voteHistoryFilter !== "latest" && !historyItems.some((vote) => String(vote.id) === String(state.voteHistoryFilter))) {
      state.voteHistoryFilter = "latest";
    }
    const historyVote = selectedHistoryVote(historyItems);
    const activeQuestionOptions = voteQuestionFilterOptionsForVote(activeVote);
    const historyQuestionOptions = voteQuestionFilterOptionsForVote(historyVote);
    if (state.currentVoteQuestionFilter !== "all" && !activeQuestionOptions.some((option) => option.id === state.currentVoteQuestionFilter)) state.currentVoteQuestionFilter = "all";
    if (state.historyVoteQuestionFilter !== "all" && !historyQuestionOptions.some((option) => option.id === state.historyVoteQuestionFilter)) state.historyVoteQuestionFilter = "all";
    const activeTotals = voteTotalsForVoteFilter(activeVote, state.currentVoteQuestionFilter);
    const historyTotals = voteTotalsForVoteFilter(historyVote, state.historyVoteQuestionFilter);
    return `
      <section class="panel votes-dashboard">
          <div class="toolbar">
            <div>
              <h2>Hlasovanie</h2>
              <p class="muted">Elektronický prehľad je podkladový. Platné hlasovanie bude zaznamenané podľa pravidiel schôdze alebo písomného hlasovania.</p>
            </div>
            <div class="vote-filter-stack">
              <select class="search" data-vote-type-filter aria-label="Filter podľa typu hlasovania">
                <option value="all" ${state.voteTypeFilter === "all" ? "selected" : ""}>Všetky zákonné typy hlasovania</option>
                ${VOTE_TYPE_OPTIONS.map((option) => `<option value="${option.id}" ${state.voteTypeFilter === option.id ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="vote-summary-grid">
            ${voteSummaryCard("Hlasovali vlastníci", electronicVoterCount(activeVote), activeVote ? activeVote.title : "bez otvoreného hlasovania", "users")}
            ${voteSummaryCard("Za", activeTotals.yes, "stav aktuálneho hlasovania", "check-circle")}
            ${voteSummaryCard("Proti", activeTotals.no, "stav aktuálneho hlasovania", "x-circle")}
            ${voteSummaryCard("Zdržal sa", activeTotals.abstain, "stav aktuálneho hlasovania", "circle-minus")}
          </div>
          <div class="vote-section-block">
            <div>
              <h3>Aktuálne hlasovanie</h3>
              <p class="muted">Zobrazuje sa najbližšie otvorené hlasovanie podľa termínu uzavretia.</p>
            </div>
            <div class="vote-row">
              <div class="list vote-list">${activeVote ? voteCard(activeVote) : systemCard("Žiadne aktuálne hlasovanie", "Pre vybraný filter nie je otvorené hlasovanie.", "vote")}</div>
              ${activeVote ? voteQuestionChartBlock("current", activeVote, activeQuestionOptions, state.currentVoteQuestionFilter, activeTotals) : systemCard("Bez aktuálneho grafu", "Pre vybraný filter nie je otvorené aktuálne hlasovanie.", "pie-chart")}
            </div>
          </div>
          <div class="vote-section-block history">
            <div class="toolbar compact-toolbar">
              <div>
                <h3>História hlasovania</h3>
                <p class="muted">Vyberte si jedno historické hlasovanie podľa dátumu uverejnenia.</p>
              </div>
              <select class="search" data-vote-history-filter aria-label="Filter histórie podľa dátumu uverejnenia">
                <option value="latest" ${state.voteHistoryFilter === "latest" ? "selected" : ""}>Najnovšie v histórii</option>
                ${historyItems.map((vote) => `<option value="${vote.id}" ${String(state.voteHistoryFilter) === String(vote.id) ? "selected" : ""}>${escapeHtml(voteHistoryOptionLabel(vote))}</option>`).join("")}
              </select>
            </div>
            <div class="vote-row">
              <div class="list vote-list">${historyVote ? voteCard(historyVote) : systemCard("História je prázdna", "Po uzavretí alebo pridaní ďalších hlasovaní sa tu zobrazí vybrané historické hlasovanie.", "archive")}</div>
              ${historyVote ? voteQuestionChartBlock("history", historyVote, historyQuestionOptions, state.historyVoteQuestionFilter, historyTotals) : ""}
            </div>
          </div>
          <div class="list compact-list">
            ${voteLegalInfoCard()}
          </div>
      </section>
    `;
  },
  calendar() {
    const month = calendarMonthDate();
    const monthLabel = month.toLocaleDateString("sk-SK", { month: "long", year: "numeric" });
    const canCreate = canCreateInView("calendar");
    return `
      <section class="panel calendar-panel">
        <div class="calendar-head">
          <div>
            <h2>${escapeHtml(monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1))}</h2>
            <p class="muted">Schôdze, odstávky, termíny hlasovaní a udalosti domu.</p>
          </div>
          <div class="calendar-controls" aria-label="Ovládanie kalendára">
            <button class="ghost icon-only" data-calendar-prev aria-label="Predchádzajúci mesiac">${icon("chevron-left")}</button>
            <input class="calendar-month-input" type="month" data-calendar-month value="${state.calendarMonth}">
            <button class="ghost icon-only" data-calendar-next aria-label="Nasledujúci mesiac">${icon("chevron-right")}</button>
            <button class="ghost" data-calendar-today>${icon("calendar-clock")}<span>Dnes</span></button>
          </div>
        </div>
        <div class="calendar-weekdays">
          ${["Po", "Ut", "St", "Št", "Pi", "So", "Ne"].map((day) => `<span>${day}</span>`).join("")}
        </div>
        <div class="calendar-grid">
          ${calendarCells().map((cell) => dayCard(cell, canCreate)).join("")}
        </div>
        ${canCreate ? `<p class="calendar-hint">${icon("mouse-pointer-click")}<span>Kliknite na konkrétny deň a pridajte udalosť priamo do kalendára.</span></p>` : ""}
      </section>
    `;
  },
  activities() {
    const month = new Date().toISOString().slice(0, 7);
    const items = state.activities.filter((activity) => activity.month === month);
    return `
      <div class="grid two">
        <section class="panel">
          <div class="toolbar">
            <div>
              <h2>Denník predsedu a dozornej rady</h2>
              <p class="muted">Mesačný zápis vlastných aktivít vykonaných pre bytový dom. Záznamy vidia aj vlastníci nehnuteľností.</p>
            </div>
            <span class="tag document">${month}</span>
          </div>
          <div class="list">${(items.length ? items : state.activities).map(activityCard).join("")}</div>
        </section>
        <section class="panel">
          <h2>Prehľad hodín</h2>
          <div class="grid three">
            ${activitySummaryCard("Spolu", state.activities.reduce((sum, item) => sum + Number(item.hours || 0), 0))}
            ${activitySummaryCard("Predseda", state.activities.filter((item) => item.role === "Predseda SVB").reduce((sum, item) => sum + Number(item.hours || 0), 0))}
            ${activitySummaryCard("Podpredseda", state.activities.filter((item) => item.role === "Podpredseda SVB").reduce((sum, item) => sum + Number(item.hours || 0), 0))}
            ${activitySummaryCard("Ekonomická správa", state.activities.filter((item) => item.role === "Ekonomická správa").reduce((sum, item) => sum + Number(item.hours || 0), 0))}
            ${activitySummaryCard("Dozorná rada", state.activities.filter((item) => !["Predseda SVB", "Podpredseda SVB", "Ekonomická správa"].includes(item.role)).reduce((sum, item) => sum + Number(item.hours || 0), 0))}
          </div>
          <h2>Vedenie a kontakty</h2>
          <div class="list">${state.boardMembers.map(boardMemberCard).join("")}</div>
        </section>
      </div>
    `;
  },
  photoAlbum() {
    return `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h2>Fotoalbum domu</h2>
            <p class="muted">Spoločná fotodokumentácia domu. Fotky môžu pridávať všetky role, vymazávať ich môže iba predseda SVB.</p>
          </div>
          <span class="tag document">${state.photos.length} fotky</span>
        </div>
        <div class="photo-grid">
          ${state.photos.map(photoCard).join("")}
        </div>
      </section>
    `;
  },
  logs() {
    const logs = filteredActivityLogs();
    return `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h2>Auditné logy</h2>
            <p class="muted">Záznamy o prihlásení a aktivitách používateľov v aplikácii.</p>
          </div>
          <span class="tag document">${logs.length} záznamy</span>
        </div>
        <div class="toolbar log-filters">
          <select class="search" data-log-role-filter>
            ${logFilterOptions("role").map(([value, label]) => `<option value="${escapeAttr(value)}" ${state.logRoleFilter === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
          </select>
          <select class="search" data-log-user-filter>
            ${logFilterOptions("user").map(([value, label]) => `<option value="${escapeAttr(value)}" ${state.logUserFilter === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
          </select>
          <select class="search" data-log-activity-filter>
            ${logFilterOptions("activity").map(([value, label]) => `<option value="${escapeAttr(value)}" ${state.logActivityFilter === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
          </select>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Čas</th>
                <th>Používateľ</th>
                <th>Rola</th>
                <th>Aktivita</th>
                <th>Súvisiaca položka</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              ${logs.length ? logs.map(activityLogRow).join("") : `<tr><td colspan="6">Zatiaľ nie sú dostupné žiadne logy pre zvolený filter.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },
  profile() {
    const profile = currentProfile();
    const [firstName, ...surnameParts] = profile.name.split(" ");
    const surname = surnameParts.join(" ") || "";
    const personalPhotoPanel = `
      <div class="profile-photo-panel personal-photo">
        <img src="${escapeAttr(profile.photoUrl || profilePhotoFallback())}" alt="Aktuálna profilová fotka">
        <div class="field">
          <label for="profilePersonalPhoto">Profilová fotka</label>
          <input id="profilePersonalPhoto" type="file" accept="image/png,image/jpeg,image/webp">
          <p class="muted">Odporúčaná veľkosť fotky je 512 × 512 px, ideálne štvorcový záber tváre. Po uložení sa zobrazí v hlavnom paneli a pri riadiacich rolách aj v kontakte vedenia SVB.</p>
        </div>
      </div>
    `;
    const buildingPhotoPanel = canManageAll() ? `
      <div class="profile-photo-panel">
        <img src="${escapeAttr(state.buildingPhotoUrl || "./building-placeholder.svg")}" alt="Aktuálna fotka bytového domu">
        <div class="field">
          <label for="profileBuildingPhoto">Fotka domu na login stránke</label>
          <input id="profileBuildingPhoto" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
          <p class="muted">Po uložení profilu sa fotka zobrazí na prihlasovacej stránke aj v hlavičke aplikácie.</p>
        </div>
      </div>
      <div class="profile-form">
        <div class="field">
          <label for="operationModeText">Prevádzkový režim v hlavičke</label>
          <select id="operationModePreset">
            <option value="Live testovací režim" ${state.operationModeText === "Live testovací režim" ? "selected" : ""}>Live testovací režim</option>
            <option value="Režim testovania pred plnou prevádzkou" ${state.operationModeText === "Režim testovania pred plnou prevádzkou" ? "selected" : ""}>Režim testovania pred plnou prevádzkou</option>
            <option value="E-správa bytového domu je v plnej prevádzke" ${state.operationModeText === "E-správa bytového domu je v plnej prevádzke" ? "selected" : ""}>E-správa bytového domu je v plnej prevádzke</option>
            <option value="custom">Vlastný text</option>
          </select>
        </div>
        <div class="field">
          <label for="operationModeText">Vlastný text režimu</label>
          <input id="operationModeText" value="${escapeAttr(state.operationModeText)}" maxlength="90">
          <p class="muted">Text sa zobrazí v hornej hlavičke aplikácie pre všetkých používateľov.</p>
        </div>
      </div>
    ` : "";
    const gdprPanel = ["chair", "vice_chair"].includes(state.role) ? `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h2>GDPR a ochrana osobných údajov</h2>
            <p class="muted">Text sa zobrazí pri registrácii všetkých rolí a jeho akceptácia sa uloží k profilu používateľa.</p>
          </div>
          <span class="tag document">${escapeHtml(state.gdprVersion)}</span>
        </div>
        <div class="profile-form">
          <div class="field">
            <label for="gdprVersion">Verzia GDPR textu</label>
            <input id="gdprVersion" value="${escapeAttr(state.gdprVersion)}" maxlength="60">
          </div>
          <div class="field">
            <label for="gdprRequired">Vyžadovať potvrdenie pri registrácii</label>
            <select id="gdprRequired">
              <option value="true" ${state.gdprRequired ? "selected" : ""}>Áno, bez potvrdenia nepovoliť registráciu</option>
              <option value="false" ${!state.gdprRequired ? "selected" : ""}>Nie, iba zobraziť informáciu</option>
            </select>
          </div>
          <div class="field span-all">
            <label for="gdprText">GDPR informačný text</label>
            <textarea id="gdprText" class="legal-editor">${escapeHtml(state.gdprText || defaultGdprText())}</textarea>
            <p class="muted">Odporúčanie: pred ostrou prevádzkou nechajte text skontrolovať právnikom alebo osobou zodpovednou za ochranu osobných údajov.</p>
          </div>
        </div>
      </section>
    ` : "";
    const editableIdentityFields = `
      <div class="field">
        <label for="profileFirstName">Meno</label>
        <input id="profileFirstName" value="${escapeAttr(firstName || profile.name)}">
      </div>
      <div class="field">
        <label for="profileSurname">Priezvisko</label>
        <input id="profileSurname" value="${escapeAttr(surname)}">
      </div>
      <div class="field">
        <label for="profileFlat">Číslo bytu / poznámka</label>
        <input id="profileFlat" value="${escapeAttr(profile.flat)}">
      </div>
    `;
    const roleField = `
      <div class="field">
        <label for="profileRoleField">Rola</label>
        <select id="profileRoleField">
          <option value="Predseda SVB" ${profile.role === "Predseda SVB" ? "selected" : ""}>Predseda SVB</option>
          <option value="Podpredseda SVB" ${profile.role === "Podpredseda SVB" ? "selected" : ""}>Podpredseda SVB</option>
          <option value="Ekonomická správa" ${profile.role === "Ekonomická správa" ? "selected" : ""}>Ekonomická správa</option>
          <option value="Člen dozornej rady" ${profile.role === "Člen dozornej rady" ? "selected" : ""}>Člen dozornej rady</option>
        </select>
      </div>
    `;
    const readonlyFields = `
      ${readonlyField("Meno", firstName || profile.name)}
      ${readonlyField("Priezvisko", surname || "Neuvedené")}
      ${readonlyField("Číslo bytu", profile.flat)}
      ${readonlyField("Rola", profile.role)}
    `;
    return `
      <div class="grid two">
        <section class="panel">
          <div class="toolbar">
            <div>
              <h2>Môj profil</h2>
              <p class="muted">Osobné kontaktné údaje používateľa prihláseného do aplikácie.</p>
            </div>
            <span class="tag document">${profile.role}</span>
          </div>
          <div class="profile-grid">
            ${canManageAll() || profile.kind === "owner" ? `${editableIdentityFields}${canManageAll() ? roleField : ""}` : readonlyFields}
          </div>
          ${personalPhotoPanel}
          <div class="profile-form">
            <div class="field">
              <label for="profileEmail">Email</label>
              <input id="profileEmail" type="email" value="${escapeAttr(profile.email)}">
            </div>
            <div class="field">
              <label for="profilePhone">Telefón</label>
              <input id="profilePhone" value="${escapeAttr(profile.phone)}" placeholder="+421 ...">
            </div>
            ${profile.kind === "owner" ? `
              <div class="field span-all">
                <label for="profileCorrespondenceStreet">Korešpondenčná ulica</label>
                <input id="profileCorrespondenceStreet" value="${escapeAttr(profile.correspondenceStreet)}" placeholder="Ulica a číslo">
              </div>
              <div class="field">
                <label for="profileCorrespondenceCity">Korešpondenčné mesto</label>
                <input id="profileCorrespondenceCity" value="${escapeAttr(profile.correspondenceCity)}" placeholder="Mesto">
              </div>
              <div class="field">
                <label for="profileCorrespondencePostalCode">Korešpondenčné PSČ</label>
                <input id="profileCorrespondencePostalCode" value="${escapeAttr(profile.correspondencePostalCode)}" placeholder="PSČ">
              </div>
            ` : ""}
            <button class="primary" data-save-profile type="button">${icon("save")}<span>Uložiť profil</span></button>
          </div>
          ${buildingPhotoPanel}
        </section>
        <section class="panel">
          <h2>Zmena hesla</h2>
          <p class="muted">${profile.readonlyNote}. V lokálnom prototype sa heslo uloží iba do demo stavu aplikácie.</p>
          <div class="profile-form">
            <div class="field">
              <label for="profilePassword">Nové heslo</label>
              <input id="profilePassword" type="password" placeholder="Zadajte nové heslo">
            </div>
            <div class="field">
              <label for="profilePasswordRepeat">Zopakovať heslo</label>
              <input id="profilePasswordRepeat" type="password" placeholder="Zopakujte nové heslo">
            </div>
            <button class="primary" data-save-password type="button">${icon("key-round")}<span>Zmeniť heslo</span></button>
            <p class="muted" id="profileStatus"></p>
          </div>
        </section>
        <section class="panel">
          <div class="toolbar">
            <div>
              <h2>Notifikácie aplikácie</h2>
              <p class="muted">Systémové upozornenia pre nové notifikácie priradené k vášmu účtu.</p>
            </div>
            <span class="tag ${state.appNotificationsEnabled ? "vote" : "document"}">${state.appNotificationsEnabled ? "Zapnuté" : "Vypnuté"}</span>
          </div>
          <div class="list">
            ${systemCard("Stav zariadenia", notificationPermissionText())}
            ${systemCard("iPhone a iPad", "Na iOS fungujú notifikácie pre webové aplikácie až po nainštalovaní aplikácie na plochu a otvorení cez ikonu e-housing.")}
          </div>
          <div class="row-actions">
            <button class="primary" data-enable-app-notifications type="button">${icon("bell-ring")}<span>Zapnúť notifikácie</span></button>
            <button class="ghost" data-disable-app-notifications type="button">${icon("bell-off")}<span>Vypnúť notifikácie</span></button>
          </div>
        </section>
        <section class="panel">
          <h2>Inštalácia aplikácie</h2>
          <p class="muted">e-housing je pripravený ako webová aplikácia PWA. Po inštalácii sa otvorí ako samostatná aplikácia s vlastnou ikonou.</p>
          <div class="install-grid">
            <button class="primary" data-install-app="android" type="button">${icon("smartphone")}<span>Stiahnuť pre Android</span></button>
            <button class="ghost" data-install-app="windows" type="button">${icon("monitor-down")}<span>Nainštalovať pre PC</span></button>
            <button class="ghost" data-install-app="macos" type="button">${icon("monitor-down")}<span>Stiahnuť pre macOS</span></button>
            <button class="ghost" data-install-app="ios" type="button">${icon("tablet-smartphone")}<span>Nainštalovať pre iOS</span></button>
          </div>
        </section>
        ${gdprPanel}
      </div>
    `;
  },
  owners() {
    return `
      <section class="panel">
        <div class="toolbar">
          <input class="search" data-search placeholder="Hľadať vlastníka alebo byt">
          <span class="tag vote">Evidencia vlastníkov</span>
        </div>
        <div class="table-wrap">
          <table class="owner-table">
            <thead><tr><th>Byt</th><th>Vlastník</th><th>Login email</th><th>Účet</th><th>Autorizácia</th><th>Vlastník od</th><th>Dlžník</th><th>Dlh</th><th>Poznámka</th><th>Akcie</th></tr></thead>
            <tbody>${state.owners.map(ownerRow).join("")}</tbody>
          </table>
        </div>
      </section>
    `;
  },
  emails() {
    return `
      <div class="grid two">
        <section class="panel">
          <div class="toolbar">
            <h2>Šablóny automatických emailov</h2>
            <span class="tag document">Edituje predseda SVB</span>
          </div>
          <div class="list">
            ${state.emailTemplates.map(templateCard).join("")}
          </div>
        </section>
        <section class="panel">
          <h2>Automatizácie</h2>
          <div class="list">
            ${systemCard("Registrácia vlastníka", "Po pridaní alebo registrácii vlastníka sa odošle uvítací email s informáciou o prístupe.")}
            ${systemCard("Nová udalosť", "Po pridaní udalosti dostanú registrovaní vlastníci informačný email.")}
            ${systemCard("Nový dokument", "Po zverejnení dokumentu sa použije šablóna Nový dokument.")}
          </div>
          <h2>Posledné emailové udalosti</h2>
          <div class="list">${state.notificationLog.map(notificationRow).join("")}</div>
        </section>
      </div>
    `;
  },
  settings() {
    return `
      <div class="grid two">
        <section class="panel">
          <h2>Nastavenia domu</h2>
          ${toggle("Email notifikácie", true)}
          ${toggle("Súkromné správy vlastník ↔ predseda", true)}
          ${toggle("Správy medzi vlastníkmi", false)}
          ${toggle("Potvrdenie prečítania oznámení", true)}
          ${toggle("Vážené hlasovanie podľa podielov", true)}
        </section>
        <section class="panel">
          <h2>Bezpečnosť a audit</h2>
          <div class="list">
            ${systemCard("Dvojfaktorové overenie", "Odporúčané pre predsedu a dozornú radu.")}
            ${systemCard("História zmien", "Každý dokument, hlasovanie a správa bude mať auditnú stopu.")}
            ${systemCard("Exporty", "Výsledky hlasovaní a zoznamy vlastníkov pôjdu exportovať do PDF/CSV.")}
          </div>
        </section>
        ${serviceAdminSection()}
        <section class="panel span-all">
          <div class="toolbar">
            <div>
              <h2>Live chat integrácia</h2>
              <p class="muted">Vložte widget kód zo služby Tawk.to. Chat sa po uložení zobrazí na login stránke aj vo všetkých častiach aplikácie.</p>
            </div>
            <button class="primary" data-save-live-chat type="button">${icon("save")}<span>Uložiť live chat</span></button>
          </div>
          <div class="profile-form">
            <div class="field">
              <label for="liveChatEnabled">Stav live chatu</label>
              <select id="liveChatEnabled">
                <option value="true" ${state.liveChatEnabled ? "selected" : ""}>Zapnutý</option>
                <option value="false" ${!state.liveChatEnabled ? "selected" : ""}>Vypnutý</option>
              </select>
            </div>
            <div class="field span-all">
              <label for="liveChatWidgetCode">Tawk.to widget kód</label>
              <textarea id="liveChatWidgetCode" class="legal-editor" placeholder="Vložte celý Tawk.to script kód">${escapeHtml(state.liveChatWidgetCode || "")}</textarea>
              <p class="muted">Aplikácia použije iba adresu začínajúcu na https://embed.tawk.to/ a nespúšťa iný vložený JavaScript.</p>
            </div>
          </div>
          <p class="muted" id="liveChatStatus">${state.liveChatEnabled && extractTawkScriptSrc(state.liveChatWidgetCode) ? "Live chat je pripravený." : "Live chat je vypnutý alebo widget kód nie je vyplnený."}</p>
        </section>
        <section class="panel span-all">
          <div class="toolbar">
            <div>
              <h2>Správa prístupov podľa rolí</h2>
              <p class="muted">Ovládanie viditeľnosti záložiek a práv na čítanie, zápis/úpravu a vymazávanie záznamov.</p>
            </div>
            <button class="primary" data-save-permissions type="button">${icon("save")}<span>Uložiť prístupy</span></button>
          </div>
          <div class="permission-matrix">
            ${permissionMatrix()}
          </div>
          <p class="muted" id="permissionsStatus"></p>
        </section>
      </div>
    `;
  }
};

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function enhanceIcons() {
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function stat(label, value, note, iconName = "activity") {
  return `<section class="panel stat"><div class="card-icon">${icon(iconName)}</div><strong>${value}</strong><span>${label}</span><p class="muted">${note}</p></section>`;
}

function statusMetric(label, value, note) {
  return `<article class="status-metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
}

function serviceAdminSection() {
  const tawkSrc = extractTawkScriptSrc(state.liveChatWidgetCode);
  const services = [
    {
      name: "Vercel",
      status: "Aktívne",
      icon: "cloud",
      purpose: "Hosting produkčnej web/PWA aplikácie, HTTPS doména, statické súbory, cache a bezpečnostné hlavičky.",
      manageUrl: "https://vercel.com/dashboard",
      values: [
        ["Produkčná URL", LIVE_APP_URL],
        ["Projekt", "e-housing"],
        ["Konfigurácia", "vercel.json"],
        ["Aktuálny typ deploya", "Static web/PWA"]
      ],
      steps: [
        "Vytvorte alebo otvorte Vercel účet a projekt e-housing.",
        "Prepojte projekt s GitHub repozitárom alebo použite Vercel CLI z priečinka aplikácie.",
        "Skontrolujte, že v projekte existuje súbor vercel.json s rewrite pravidlom na /index.html.",
        "V prípade potreby doplňte produkčné environment variables pre funkcie alebo build.",
        "Spustite produkčný deploy príkazom npx vercel deploy --prod --yes.",
        `Po deployi skontrolujte alias ${LIVE_APP_URL}.`
      ]
    },
    {
      name: "Supabase",
      status: supabaseClient ? "Aktívne" : "Nenájdené",
      icon: "database",
      purpose: "Autentifikácia používateľov, databáza, RLS práva, úložisko súborov a serverové Edge Functions.",
      manageUrl: `https://supabase.com/dashboard/project/${SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1] || ""}`,
      values: [
        ["Project ref", SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1] || "nezistené"],
        ["Supabase URL", SUPABASE_URL],
        ["Auth redirect", authRedirectUrl()],
        ["Storage bucket", STORAGE_BUCKET],
        ["Verejný bucket", PUBLIC_ASSETS_BUCKET],
        ["Edge Functions", "send-notification, delete-owner-account, cleanup-orphan-auth-user, update-login-email"]
      ],
      steps: [
        "V Supabase vytvorte nový projekt a poznačte si Project URL a publishable key.",
        "V SQL editore spustite migrácie zo zložky supabase/migrations.",
        "Vytvorte storage buckety e-housing-files pre súkromné dokumenty a e-housing-public pre verejné obrázky.",
        "Skontrolujte RLS policies pre tabuľky profiles, owner_records, documents, messages, votes, app_settings a storage.objects.",
        "Deploynite Edge Functions: send-notification, delete-owner-account, cleanup-orphan-auth-user a update-login-email.",
        "Do Supabase Auth nastavte Site URL a Redirect URLs na produkčnú URL aplikácie."
      ]
    },
    {
      name: "Gmail / Google Cloud",
      status: "Aktívne pre notifikácie",
      icon: "mail",
      purpose: "Odosielanie emailových notifikácií cez Gmail API z účtu SVBDruzstevna386@gmail.com.",
      manageUrl: "https://console.cloud.google.com/apis/dashboard",
      values: [
        ["Odosielací účet", "SVBDruzstevna386@gmail.com"],
        ["Edge Function", "send-notification"],
        ["Scope", "https://www.googleapis.com/auth/gmail.send"],
        ["Secrets", "GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_FROM_EMAIL, GMAIL_FROM_NAME"]
      ],
      steps: [
        "V Google Cloud Console vytvorte projekt pre daný bytový dom.",
        "Zapnite Gmail API.",
        "V OAuth consent screen pridajte testovacích používateľov alebo aplikáciu publikujte podľa pravidiel Google.",
        "Vytvorte OAuth Client ID typu Web application.",
        "Získajte refresh token so scope gmail.send pre odosielací Gmail účet.",
        "Secrets uložte do Supabase Edge Functions, nie do verejného JavaScriptu.",
        "Otestujte notifikáciu z aplikácie cez vytvorenie udalosti alebo dokumentu."
      ]
    },
    {
      name: "Tawk.to Live Chat",
      status: state.liveChatEnabled && tawkSrc ? "Zapnuté" : "Vypnuté",
      icon: "messages-square",
      purpose: "Live chat widget dostupný na login stránke aj vo vnútri aplikácie.",
      manageUrl: "https://dashboard.tawk.to/",
      values: [
        ["Widget URL", tawkSrc || "nezadané"],
        ["Uloženie", "app_settings.live_chat_widget_code"],
        ["Stav", state.liveChatEnabled ? "Zapnutý" : "Vypnutý"]
      ],
      steps: [
        "V Tawk.to vytvorte Property pre bytový dom.",
        "V administrácii Tawk.to skopírujte JavaScript widget kód.",
        "V tejto záložke Nastavenia vložte celý widget kód do poľa Tawk.to widget kód.",
        "Nastavte stav na Zapnutý a uložte.",
        "Otvorte login stránku v anonymnom okne a skontrolujte, že sa widget načíta.",
        "V Tawk.to nastavte dostupnosť operátorov, automatické správy a jazyk chatu."
      ]
    },
    {
      name: "GitHub",
      status: "Odporúčané pre zdrojový kód",
      icon: "github",
      purpose: "Verziovanie zdrojového kódu, história zmien a prípadné prepojenie s Vercel deploymi.",
      manageUrl: "https://github.com/",
      values: [
        ["Repozitár", "e-housing / projekt aplikácie"],
        ["Hlavný priečinok", "outputs/e-housing"],
        ["Deployment", "Vercel projekt môže byť napojený na GitHub branch"]
      ],
      steps: [
        "Vytvorte súkromný GitHub repozitár pre konkrétny bytový dom.",
        "Nahrajte zdrojový kód aplikácie vrátane supabase/migrations a supabase/functions.",
        "Do repozitára nikdy neukladajte service role key, Gmail refresh token ani OAuth client secret.",
        "Vo Verceli prepojte repozitár s projektom a nastavte produkčný branch.",
        "Každú väčšiu zmenu commitnite s jasným popisom."
      ]
    },
    {
      name: "PWA / Inštalácia aplikácie",
      status: "Zapnuté",
      icon: "smartphone",
      purpose: "Inštalácia webovej aplikácie na Android, iOS, macOS a Windows cez prehliadač.",
      manageUrl: `${LIVE_APP_URL}/manifest.webmanifest`,
      values: [
        ["Manifest", "manifest.webmanifest"],
        ["Service worker", "sw.js"],
        ["Cache", "e-housing-v97"]
      ],
      steps: [
        "Skontrolujte manifest.webmanifest, názov aplikácie a ikony.",
        "Po každej väčšej zmene zvýšte CACHE_NAME v sw.js.",
        "Na Androide použite Inštalovať aplikáciu v Chrome.",
        "Na iOS použite Zdieľať a Pridať na plochu.",
        "Na macOS alebo Windows použite ikonu inštalácie v Chrome alebo Edge.",
        "Ak sa používateľovi drží stará verzia, nech obnoví stránku alebo odstráni a znova pridá PWA."
      ]
    }
  ];

  return `
    <section class="panel span-all">
      <div class="toolbar">
        <div>
          <h2>Admin sekcia online služieb</h2>
          <p class="muted">Prehľad služieb potrebných pre prevádzku aplikácie, ich správa a postup nastavenia pri novej alebo opravnej konfigurácii.</p>
        </div>
        <span class="tag document">${services.length} služieb</span>
      </div>
      <div class="service-grid">
        ${services.map(serviceCard).join("")}
      </div>
    </section>
  `;
}

function serviceCard(service) {
  return `
    <article class="service-card">
      <div class="message-head">
        <div>
          <div class="card-icon">${icon(service.icon)}</div>
          <h3>${escapeHtml(service.name)}</h3>
          <p class="muted">${escapeHtml(service.purpose)}</p>
        </div>
        <span class="tag ${service.status.includes("Aktív") || service.status.includes("Zapnut") ? "document" : ""}">${escapeHtml(service.status)}</span>
      </div>
      <div class="service-values">
        ${service.values.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
      </div>
      <details class="service-steps">
        <summary>Postup nastavenia</summary>
        <ol>
          ${service.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </details>
      <div class="row-actions">
        <a class="ghost button-link" href="${escapeAttr(service.manageUrl)}" target="_blank" rel="noreferrer">${icon("external-link")}<span>Otvoriť správu</span></a>
      </div>
    </article>
  `;
}

function task(titleText, tagText, iconName = "arrow-right") {
  return `<article class="item"><div><h3>${titleText}</h3><span class="tag">${tagText}</span></div><button class="ghost" data-open-view="${viewForTaskTag(tagText)}">${icon(iconName)}<span>Otvoriť</span></button></article>`;
}

function viewForTaskTag(tagText) {
  const map = {
    Vlastníci: "owners",
    Dokumenty: "documents",
    Komunikácia: "messages",
    Hlasovania: "votes",
    Kalendár: "calendar",
    Denník: "activities"
  };
  return map[tagText] || "overview";
}

function overviewTasks({ pendingOwners, urgentDocuments, unreadMessages, openVotes }) {
  const tasks = [];
  if (pendingOwners) tasks.push(task(`Schváliť vlastníkov čakajúcich na autorizáciu: ${pendingOwners}`, "Vlastníci"));
  if (urgentDocuments) tasks.push(task(`Skontrolovať urgentné dokumenty: ${urgentDocuments}`, "Dokumenty"));
  if (unreadMessages) tasks.push(task(`Prečítať nové správy: ${unreadMessages}`, "Komunikácia"));
  if (openVotes) tasks.push(task(`Sledovať otvorené hlasovania: ${openVotes}`, "Hlasovania"));
  if (!tasks.length) tasks.push(systemCard("Bez okamžitej úlohy", "V databáze nie je evidovaná žiadna čakajúca aktivácia, urgentný dokument ani neprečítaná správa."));
  return tasks.join("");
}

function nextCalendarEvent() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sorted = [...state.events].sort(sortByEventDateAsc);
  const event = sorted.find((item) => itemDateTimestamp(item, ["startsAt", "date"]) >= today.getTime()) || sorted[0];
  if (!event) return null;
  return { value: formatDate(event.startsAt || event.date), note: event.title };
}

function nextOpenVote() {
  const openVotes = state.votes.filter((vote) => ["open", "Prebieha", "prebieha"].includes(vote.status) && vote.closes);
  return openVotes.sort((a, b) => new Date(a.closes) - new Date(b.closes))[0] || null;
}

function systemCard(head, body, iconName = "info") {
  return `<article class="card icon-card"><div class="card-icon">${icon(iconName)}</div><h3>${head}</h3><p class="muted">${body}</p></article>`;
}

function readonlyField(label, value) {
  return `<article class="card readonly-field"><span>${label}</span><strong>${value}</strong></article>`;
}

function boardMemberCard(member) {
  const memberPhoto = member.photoUrl || profilePhotoFallback();
  return `<article class="item member-card">
    <img class="member-photo" src="${escapeAttr(memberPhoto)}" alt="Profilová fotka ${escapeAttr(member.name)}">
    <div>
      <h3>${member.name}</h3>
      <p class="muted">${member.role}</p>
      <div class="tag-row"><span class="tag">${member.email}</span><span class="tag">${member.phone}</span></div>
      <p>${member.note}</p>
    </div>
    <div class="row-actions">${adminEditButton("boardMember", member.id)}${!["Predseda SVB", "Podpredseda SVB", "Ekonomická správa"].includes(member.role) ? deleteButton("boardMember", member.id, member) : ""}</div>
  </article>`;
}

function activityCard(activity) {
  return `<article class="item searchable" data-text="${activity.month} ${activity.person} ${activity.role} ${activity.title} ${activity.status}">
    <div>
      <h3>${activity.title}</h3>
      <p class="muted">${activity.person} · ${activity.role} · ${activity.month}</p>
      <p>${activity.note}</p>
      <div class="tag-row"><span class="tag">${activity.status}</span><span class="tag">${activity.hours} h</span></div>
    </div>
    <div class="row-actions">${adminEditButton("activity", activity.id)}${deleteButton("activity", activity.id, activity)}</div>
  </article>`;
}

function activitySummaryCard(label, hours) {
  return `<article class="card stat"><strong>${Number(hours).toFixed(1)}</strong><span>${label}</span><p class="muted">hodín v evidencii</p></article>`;
}

function adminEditButton(type, id) {
  return canEditItem(type) ? `<button class="ghost" data-edit="${type}" data-id="${id}">${icon("pencil")}<span>Upraviť</span></button>` : "";
}

function deleteButton(type, id, item = null) {
  return canDeleteItem(type, item) ? `<button class="ghost" data-delete-item="${type}" data-id="${id}">${icon("trash-2")}<span>Vymazať</span></button>` : "";
}

function announcementCard(item) {
  return `<article class="item"><div><h3>${item.title}</h3><p>${item.body}</p><div class="tag-row"><span class="tag">${item.category}</span><span class="tag">${formatDate(item.date)}</span>${item.urgent ? '<span class="tag urgent">Urgentné</span>' : ""}</div></div><div class="row-actions">${adminEditButton("announcement", item.id)}<button class="ghost" data-detail="announcement" data-id="${item.id}">${icon("info")}<span>Detail</span></button>${deleteButton("announcement", item.id, item)}</div></article>`;
}

function documentCard(doc) {
  return `<article class="item searchable" data-text="${doc.title} ${doc.type} ${doc.author}"><div><h3>${doc.title}</h3><p class="muted">${doc.author} · ${formatDate(doc.date)} · ${doc.visibility}</p><div class="tag-row"><span class="tag document">${doc.type}</span>${doc.urgent ? '<span class="tag urgent">Email odoslaný</span>' : '<span class="tag">Email pripravený</span>'}</div></div><div class="row-actions">${adminEditButton("document", doc.id)}<button class="ghost" data-detail="document" data-id="${doc.id}">${icon("info")}<span>Detail</span></button>${documentFileActions(doc)}${deleteButton("document", doc.id, doc)}</div></article>`;
}

function historyDocumentCard(item) {
  return `<article class="item searchable" data-text="${item.title} ${item.category} ${item.owner}">
    <div>
      <h3>${item.title}</h3>
      <p class="muted">${item.owner} · ${formatDate(item.date)}</p>
      <p>${item.note}</p>
      <div class="tag-row"><span class="tag document">${item.category}</span></div>
    </div>
    <div class="row-actions">${adminEditButton("historyDocument", item.id)}<button class="ghost" data-detail="historyDocument" data-id="${item.id}">${icon("info")}<span>Detail</span></button>${documentFileActions(item)}${deleteButton("historyDocument", item.id, item)}</div>
  </article>`;
}

function billingSettlementCard(item) {
  return `<article class="item searchable" data-text="${item.title} ${item.year} ${item.ownerName} ${item.flat}">
    <div>
      <h3>${item.title}</h3>
      <p class="muted">${item.ownerName} · ${item.flat} · rok ${item.year || "neuvedený"}</p>
      <p>${escapeHtml(item.note || "Vyúčtovanie vlastníka nehnuteľnosti.")}</p>
      <div class="tag-row"><span class="tag document">Vyúčtovanie</span><span class="tag">${formatDate(item.date)}</span></div>
    </div>
    <div class="row-actions">
      <button class="ghost" data-detail="billingSettlement" data-id="${item.id}">${icon("info")}<span>Detail</span></button>
      ${documentFileActions(item)}
      ${deleteButton("billingSettlement", item.id, item)}
    </div>
  </article>`;
}

function executionCaseCard(item) {
  return `<article class="item searchable" data-text="${item.ownerName} ${item.flat} ${item.status} ${item.legalStatus} ${item.executionTitleStatus}">
    <div>
      <h3>${escapeHtml(item.ownerName)} · ${escapeHtml(item.flat)}</h3>
      <p class="muted">${escapeHtml(item.title || "Vymáhanie nedoplatku")} · dlh od ${item.debtSince ? formatDate(item.debtSince) : "neuvedené"}</p>
      <p>${escapeHtml(item.legalStatus || "Právny stav zatiaľ nie je doplnený.")}</p>
      <div class="tag-row">
        <span class="tag urgent">${formatMoney(item.debtAmount)}</span>
        <span class="tag document">${escapeHtml(item.status)}</span>
        <span class="tag">${escapeHtml(item.executionTitleStatus || "Exekučný titul neposúdený")}</span>
        ${item.nextStepDate ? `<span class="tag vote">Ďalší krok ${formatDate(item.nextStepDate)}</span>` : ""}
      </div>
    </div>
    <div class="row-actions">
      <button class="ghost" data-detail="executionCase" data-id="${item.id}">${icon("info")}<span>Detail</span></button>
      ${adminEditButton("executionCase", item.id)}
      ${deleteButton("executionCase", item.id, item)}
    </div>
  </article>`;
}

function financeTotal(type) {
  return state.financeEntries
    .filter((entry) => entry.type === type)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function latestFinanceBalance(entries = state.financeEntries) {
  const balanceEntries = entries
    .filter((entry) => entry.type === "balance")
    .sort((a, b) => financeEntryTimestamp(b) - financeEntryTimestamp(a));
  return Number(balanceEntries[0]?.amount || 0);
}

function financeEntryTimestamp(entry) {
  const parsedDate = new Date(entry.date || `${entry.year || new Date().getFullYear()}-12-31`);
  if (!Number.isNaN(parsedDate.getTime())) return parsedDate.getTime();
  return Number(entry.year || 0);
}

function financeTypeLabel(type) {
  return {
    balance: "Stav bankového účtu",
    planned_renovation: "Plánovaná renovácia",
    other_expense: "Iný výdavok"
  }[type] || "Finančný záznam";
}

function financeChart(values) {
  const rows = values.length ? values : [{ year: new Date().getFullYear(), balance: 0, planned: 0, other: 0, ideas: 0 }];
  const max = Math.max(...rows.flatMap((row) => [row.balance, row.planned, row.other, row.ideas].map((value) => Math.abs(Number(value || 0)))), 1);
  const mid = max / 2;
  return `
    <section class="finance-chart-shell" aria-label="XY graf hospodárenia podľa rokov a finančných ukazovateľov">
      <div class="finance-axis-title y-axis">EUR</div>
      <div class="finance-chart-scale" aria-hidden="true">
        <span>${formatMoney(max)}</span>
        <span>${formatMoney(mid)}</span>
        <span>${formatMoney(0)}</span>
      </div>
      <div class="finance-chart" role="img" aria-label="Os X zobrazuje roky, os Y zobrazuje peniaze v eurách">
        ${rows.map((row) => {
          const bars = [
            ["Účet", row.balance, "document"],
            ["Renov.", row.planned, "vote"],
            ["Iné", row.other, ""],
            ["Podnety", row.ideas, "urgent"]
          ];
          return `<article class="finance-year-group">
            <div class="finance-year-bars">
              ${bars.map(([label, amount, tone]) => {
                const height = Math.max(8, Math.round((Math.abs(Number(amount || 0)) / max) * 150));
                return `<div class="finance-mini-bar" title="${escapeAttr(`${row.year} · ${label}: ${formatMoney(amount)}`)}"><div class="bar-track"><span class="${tone}" style="height:${height}px"></span></div><small>${label}</small></div>`;
              }).join("")}
            </div>
            <strong>${row.year}</strong>
            <p class="muted">${formatMoney(row.balance)} stav účtu</p>
          </article>`;
        }).join("")}
      </div>
      <div class="finance-axis-title x-axis">Roky</div>
    </section>
    <div class="chart-legend">
      <span><i class="legend-box document"></i>Bankový účet</span>
      <span><i class="legend-box vote"></i>Renovácie</span>
      <span><i class="legend-box other"></i>Iné výdavky</span>
      <span><i class="legend-box urgent"></i>Podnety</span>
    </div>
  `;
}

function financeLineChart(values) {
  const rows = values.length ? values : [{ year: new Date().getFullYear(), balance: 0, planned: 0, other: 0, ideas: 0 }];
  const series = [
    { key: "balance", label: "Bankový účet", className: "document" },
    { key: "planned", label: "Renovácie", className: "vote" },
    { key: "other", label: "Iné výdavky", className: "other" },
    { key: "ideas", label: "Podnety", className: "urgent" }
  ];
  const width = 760;
  const height = 300;
  const pad = { top: 22, right: 28, bottom: 54, left: 88 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const max = Math.max(...rows.flatMap((row) => series.map((item) => Math.abs(Number(row[item.key] || 0)))), 1);
  const xFor = (index) => rows.length === 1 ? pad.left + chartWidth / 2 : pad.left + (index / (rows.length - 1)) * chartWidth;
  const yFor = (value) => pad.top + chartHeight - (Math.abs(Number(value || 0)) / max) * chartHeight;
  const gridValues = [max, max * 0.75, max * 0.5, max * 0.25, 0];
  return `
    <section class="finance-line-panel" aria-label="Čiarový graf vývoja hospodárenia">
      <div class="toolbar compact">
        <div>
          <h2>Vývoj finančných ukazovateľov</h2>
          <p class="muted">Čiarový graf: os X sú roky, os Y sú peniaze v EUR.</p>
        </div>
      </div>
      <svg class="finance-line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Čiarový graf hospodárenia podľa rokov a eur">
        <g class="line-grid">
          ${gridValues.map((value) => {
            const y = yFor(value);
            return `<line x1="${pad.left}" y1="${y.toFixed(2)}" x2="${width - pad.right}" y2="${y.toFixed(2)}"></line><text x="${pad.left - 10}" y="${(y + 4).toFixed(2)}">${escapeHtml(formatCompactMoney(value))}</text>`;
          }).join("")}
        </g>
        <line class="axis-line" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + chartHeight}"></line>
        <line class="axis-line" x1="${pad.left}" y1="${pad.top + chartHeight}" x2="${width - pad.right}" y2="${pad.top + chartHeight}"></line>
        <text class="axis-label y-label" x="18" y="${pad.top + chartHeight / 2}" transform="rotate(-90 18 ${pad.top + chartHeight / 2})">EUR</text>
        <text class="axis-label x-label" x="${pad.left + chartWidth / 2}" y="${height - 10}">Roky</text>
        <g class="year-labels">
          ${rows.map((row, index) => `<text x="${xFor(index).toFixed(2)}" y="${height - 32}">${row.year}</text>`).join("")}
        </g>
        ${series.map((item) => {
          const points = rows.map((row, index) => `${xFor(index).toFixed(2)},${yFor(row[item.key]).toFixed(2)}`).join(" ");
          return `<polyline class="finance-line ${item.className}" points="${points}"></polyline>${rows.map((row, index) => `<circle class="finance-point ${item.className}" cx="${xFor(index).toFixed(2)}" cy="${yFor(row[item.key]).toFixed(2)}" r="4"><title>${escapeHtml(`${row.year} · ${item.label}: ${formatMoney(row[item.key])}`)}</title></circle>`).join("")}`;
        }).join("")}
      </svg>
      <div class="chart-legend">
        ${series.map((item) => `<span><i class="legend-box ${item.className}"></i>${item.label}</span>`).join("")}
      </div>
    </section>
  `;
}

function formatCompactMoney(value) {
  const number = Number(value || 0);
  if (Math.abs(number) >= 1000000) return `${new Intl.NumberFormat("sk-SK", { maximumFractionDigits: 1 }).format(number / 1000000)} mil. €`;
  if (Math.abs(number) >= 1000) return `${new Intl.NumberFormat("sk-SK", { maximumFractionDigits: 0 }).format(number / 1000)} tis. €`;
  return `${new Intl.NumberFormat("sk-SK", { maximumFractionDigits: 0 }).format(number)} €`;
}

function financeRowsByYear() {
  const years = new Map();
  const yearValues = [];
  const ensureYear = (year) => {
    const numericYear = Number(year || new Date().getFullYear());
    if (!years.has(numericYear)) years.set(numericYear, { year: numericYear, balance: 0, planned: 0, other: 0, ideas: 0 });
    return years.get(numericYear);
  };
  state.financeEntries.forEach((entry) => {
    const row = ensureYear(entry.year);
    yearValues.push(Number(entry.year || new Date().getFullYear()));
    if (entry.type === "balance") {
      const timestamp = financeEntryTimestamp(entry);
      if (!row.balanceTimestamp || timestamp >= row.balanceTimestamp) {
        row.balance = Number(entry.amount || 0);
        row.balanceTimestamp = timestamp;
      }
    }
    if (entry.type === "planned_renovation") row.planned += Number(entry.amount || 0);
    if (entry.type === "other_expense") row.other += Number(entry.amount || 0);
  });
  state.innovationIdeas.forEach((idea) => {
    yearValues.push(Number(idea.year || new Date().getFullYear()));
    ensureYear(idea.year).ideas += Number(idea.estimatedCost || 0);
  });
  if (!yearValues.length) yearValues.push(new Date().getFullYear());
  const minYear = Math.min(...yearValues);
  const maxYear = Math.max(...yearValues);
  for (let year = minYear; year <= maxYear; year += 1) ensureYear(year);
  return [...years.values()].map(({ balanceTimestamp, ...row }) => row).sort((a, b) => a.year - b.year);
}

function financeEntryCard(entry) {
  return `<article class="item">
    <div>
      <h3>${entry.title}</h3>
      <p class="muted">${financeTypeLabel(entry.type)} · rok ${entry.year} · ${formatDate(entry.date)}</p>
      <p>${escapeHtml(entry.note || "Bez poznámky")}</p>
      <div class="tag-row"><span class="tag document">${formatMoney(entry.amount)}</span></div>
    </div>
    <div class="row-actions">${deleteButton("financeEntry", entry.id, entry)}</div>
  </article>`;
}

function voteTypeInfo(type = "present_majority") {
  return VOTE_TYPE_OPTIONS.find((option) => option.id === type) || VOTE_TYPE_OPTIONS[0];
}

function voteTypeOptions() {
  return VOTE_TYPE_OPTIONS.map((option) => [option.id, option.label]);
}

function filteredVotes() {
  return state.voteTypeFilter === "all"
    ? state.votes
    : state.votes.filter((vote) => (vote.type || "present_majority") === state.voteTypeFilter);
}

function voteFilterLabel() {
  return state.voteTypeFilter === "all" ? "všetky typy" : voteTypeInfo(state.voteTypeFilter).short;
}

function votePublicationDate(vote) {
  return vote.createdAt || vote.date || vote.closes || "";
}

function voteTimestamp(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function currentVote(votes = []) {
  const openVotes = votes
    .filter((vote) => !isVoteCancelled(vote) && !isVoteClosed(vote))
    .sort((a, b) => voteTimestamp(a.closes) - voteTimestamp(b.closes));
  return openVotes[0] || votes.slice().sort((a, b) => voteTimestamp(votePublicationDate(b)) - voteTimestamp(votePublicationDate(a)))[0] || null;
}

function historyVotes(votes = [], activeVoteId = null) {
  return votes
    .filter((vote) => String(vote.id) !== String(activeVoteId))
    .sort((a, b) => voteTimestamp(votePublicationDate(b)) - voteTimestamp(votePublicationDate(a)));
}

function selectedHistoryVote(votes = []) {
  if (!votes.length) return null;
  if (state.voteHistoryFilter !== "latest") {
    const selected = votes.find((vote) => String(vote.id) === String(state.voteHistoryFilter));
    if (selected) return selected;
  }
  return votes[0];
}

function voteHistoryOptionLabel(vote) {
  return `${formatDate(votePublicationDate(vote))} · ${vote.title}`;
}

function voteQuestionOptionId(vote, question) {
  return `${vote.id}::${question.id}`;
}

function voteQuestionFilterOptionsForVote(vote) {
  if (!vote) return [];
  return (vote.questions || []).map((question) => ({
    id: voteQuestionOptionId(vote, question),
    label: question.text
  }));
}

function selectedVoteQuestionForVote(vote, filterValue = "all") {
  if (!vote || filterValue === "all") return null;
  return (vote.questions || []).find((question) => voteQuestionOptionId(vote, question) === filterValue) || null;
}

function voteTotals(votes = []) {
  return votes.reduce((sum, vote) => ({
    yes: sum.yes + Number(vote.yes || 0),
    no: sum.no + Number(vote.no || 0),
    abstain: sum.abstain + Number(vote.abstain || 0)
  }), { yes: 0, no: 0, abstain: 0 });
}

function voteTotalsForVoteFilter(vote, filterValue = "all") {
  if (!vote) return { yes: 0, no: 0, abstain: 0 };
  const question = selectedVoteQuestionForVote(vote, filterValue);
  if (!question) {
    return {
      yes: Number(vote.yes || 0),
      no: Number(vote.no || 0),
      abstain: Number(vote.abstain || 0)
    };
  }
  return {
    yes: Number(question.yes || 0),
    no: Number(question.no || 0),
    abstain: Number(question.abstain || 0)
  };
}

function electronicVoterCount(vote) {
  if (!vote) return 0;
  if (Number.isFinite(Number(vote.electronicVoters))) return Number(vote.electronicVoters);
  const ids = new Set();
  (vote.questions || []).forEach((question) => {
    (question.voters || []).forEach((voter) => {
      const key = voter.profileId || voter.email || `${voter.name || ""}-${voter.flat || ""}`;
      if (String(key).trim()) ids.add(key);
    });
  });
  return ids.size;
}

function voteQuestionChartBlock(scope, vote, questionOptions, selectedValue, totals) {
  const selectedQuestion = selectedVoteQuestionForVote(vote, selectedValue);
  const filterAttr = scope === "history" ? "data-history-vote-question-filter" : "data-current-vote-question-filter";
  const scopeLabel = scope === "history" ? "História" : "Aktuálne";
  return `
    <div class="vote-inline-chart">
      <div class="toolbar compact-toolbar">
        <div>
          <h4>${scopeLabel}: ${escapeHtml(vote.title)}</h4>
          <p class="muted">${selectedQuestion ? `Graf zobrazuje otázku: ${escapeHtml(selectedQuestion.text)}` : "Graf zobrazuje súčet otázok v tomto hlasovaní."}</p>
        </div>
        <select class="search wide-select" ${filterAttr} aria-label="Filter otázok k hlasovaniu">
          <option value="all" ${selectedValue === "all" ? "selected" : ""}>Všetky otázky v tomto hlasovaní</option>
          ${questionOptions.map((option) => `<option value="${escapeAttr(option.id)}" ${selectedValue === option.id ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
        </select>
      </div>
      ${votePieChart(totals)}
    </div>
  `;
}

function voteSummaryCard(label, value, note, iconName) {
  return `<article class="status-metric vote-summary-card"><div class="card-icon">${icon(iconName)}</div><span>${label}</span><strong>${value}</strong><small>${escapeHtml(note)}</small></article>`;
}

function pieSegment(value, total, offset, color) {
  const portion = total ? value / total : 0;
  return `${color} ${offset * 100}% ${(offset + portion) * 100}%`;
}

function votePieChart(totals) {
  const total = totals.yes + totals.no + totals.abstain;
  const yesPortion = total ? totals.yes / total : 0;
  const noPortion = total ? totals.no / total : 0;
  const segments = total
    ? [
      pieSegment(totals.yes, total, 0, "var(--teal)"),
      pieSegment(totals.no, total, yesPortion, "var(--red)"),
      pieSegment(totals.abstain, total, yesPortion + noPortion, "var(--gold)")
    ].join(", ")
    : "#edf3f0 0 100%";
  return `
    <div class="vote-pie-wrap">
      <div class="vote-pie" style="background: conic-gradient(${segments});" role="img" aria-label="Koláčový graf hlasovania">
        <div><strong>${total}</strong><span>hlasov</span></div>
      </div>
      <div class="vote-legend">
        ${voteLegendItem("Za", totals.yes, total, "yes")}
        ${voteLegendItem("Proti", totals.no, total, "no")}
        ${voteLegendItem("Zdržal sa", totals.abstain, total, "abstain")}
      </div>
    </div>
  `;
}

function voteLegendItem(label, value, total, type) {
  const percent = total ? Math.round((Number(value || 0) / total) * 100) : 0;
  return `<div class="vote-legend-item ${type}"><span></span><strong>${label}</strong><em>${value} hlasov · ${percent}%</em></div>`;
}

function voteLegalInfoCard() {
  const info = state.voteTypeFilter === "all" ? null : voteTypeInfo(state.voteTypeFilter);
  return `
    <article class="card">
      <h3>${info ? escapeHtml(info.label) : "Zákonné typy hlasovania"}</h3>
      <p class="muted">${info ? escapeHtml(info.threshold) : "Filter vychádza z kategórií väčšiny podľa zákona č. 182/1993 Z. z. o vlastníctve bytov a nebytových priestorov."}</p>
      <p>${escapeHtml(info ? info.note : "Pri konkrétnom rozhodnutí je potrebné správne určiť zákonné kvórum podľa predmetu hlasovania a aktuálneho znenia zákona.")}</p>
    </article>
  `;
}

function innovationIdeaCard(idea) {
  return `<article class="item">
    <div>
      <h3>${idea.title}</h3>
      <p class="muted">${idea.author}${idea.flat ? ` · ${idea.flat}` : ""} · rok ${idea.year} · ${formatDate(idea.createdAt)}</p>
      <p>${escapeHtml(idea.description)}</p>
      <div class="tag-row"><span class="tag">${idea.status}</span><span class="tag document">${formatMoney(idea.estimatedCost)}</span>${idea.quoteUrl ? `<a class="tag" href="${idea.quoteUrl}" target="_blank" rel="noopener">Cenová ponuka</a>` : ""}</div>
      ${idea.comments.length ? `<div class="conversation-thread">${idea.comments.map(innovationCommentCard).join("")}</div>` : ""}
    </div>
    <div class="row-actions">
      ${canEditItem("innovationIdea") ? `<button class="ghost" data-edit="innovationIdea" data-id="${idea.id}">${icon("pencil")}<span>Upraviť</span></button>` : ""}
      <button class="primary" data-comment-idea="${idea.id}">${icon("message-circle")}<span>Vyjadriť sa</span></button>
      ${deleteButton("innovationIdea", idea.id, idea)}
    </div>
  </article>`;
}

function innovationCommentCard(comment) {
  return `<article class="message-reply"><div class="message-head"><div><strong>${escapeHtml(comment.author)}</strong><p class="muted">${comment.flat || roleLabel()} · ${formatDate(comment.date)}</p></div></div><p>${escapeHtml(comment.body)}</p></article>`;
}

function documentFileActions(item) {
  if (!item.fileUrl) return '<span class="tag">Bez súboru</span>';
  const title = escapeAttr(item.title || "dokument");
  return `<a class="ghost button-link" href="${item.fileUrl}" target="_blank" rel="noopener">${icon("eye")}<span>Pozrieť</span></a><a class="primary button-link" href="${item.fileUrl}" download="${title}">${icon("download")}<span>Stiahnuť</span></a>`;
}

function isImageAttachment(item) {
  const path = `${item.storagePath || ""} ${item.fileUrl || ""}`.toLowerCase();
  return /\.(png|jpe?g|webp|gif|bmp|avif)(\?|$)/i.test(path);
}

function mediaPreviewBlock(item) {
  const image = item.fileUrl && isImageAttachment(item)
    ? `<figure class="attachment-preview"><img src="${escapeAttr(item.fileUrl)}" alt="${escapeAttr(item.title || "Priložený obrázok")}"><figcaption>Priložený obrázok</figcaption></figure>`
    : "";
  const video = youtubePreviewBlock(item.youtubeUrl);
  return `${image}${video}`;
}

function youtubeVideoId(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    let id = "";
    if (url.hostname.includes("youtu.be")) {
      id = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/watch")) id = url.searchParams.get("v") || "";
      if (url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] || "";
      if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] || "";
    }
    if (!/^[a-zA-Z0-9_-]{6,20}$/.test(id)) return "";
    return id;
  } catch {
    return "";
  }
}

function youtubeEmbedUrl(value = "") {
  const id = youtubeVideoId(value);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

function youtubePreviewBlock(value = "") {
  const id = youtubeVideoId(value);
  if (!id) return "";
  const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return `
    <button class="youtube-preview" data-youtube-play="${escapeAttr(value)}" type="button" aria-label="Prehrať YouTube video">
      <img src="${escapeAttr(thumb)}" alt="YouTube video náhľad">
      <span class="youtube-play">${icon("play")}</span>
      <strong>Prehrať YouTube video</strong>
    </button>
  `;
}

function openYoutubeDialog(url) {
  const embedUrl = youtubeEmbedUrl(url);
  if (!embedUrl) {
    window.alert("YouTube odkaz nie je v podporovanom formáte.");
    return;
  }
  dialogSave.hidden = true;
  dialog.classList.add("video-dialog");
  dialogTitle.textContent = "YouTube video";
  dialogBody.innerHTML = `
    <div class="video-dialog-shell">
      <div class="video-frame">
        <iframe src="${escapeAttr(embedUrl)}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
    </div>
  `;
  if (!dialog.open) dialog.showModal();
}

function messageCard(message) {
  const own = message.from === roleLabel() || message.from === "Predseda" && canManageAll() ? " own" : "";
  const replies = message.replies || [];
  return `<article class="message${own}">
    <div class="message-head">
      <div>
        <h3>${message.subject || message.scope}</h3>
        <p class="muted">Od: ${message.from} · Komu: ${messageRecipientDisplay(message)}</p>
      </div>
      <span class="tag ${message.read ? "" : "urgent"}">${message.read ? "Prečítané" : "Nové"}</span>
    </div>
    <p>${message.text}</p>
    <div class="tag-row"><span class="tag">${message.scope}</span><span class="tag">${message.date}</span></div>
    ${replies.length ? `<div class="conversation-thread">${replies.map(messageReplyCard).join("")}</div>` : ""}
    <div class="row-actions">${messageActionButtons(message)}</div>
  </article>`;
}

function messageReplyCard(reply) {
  const own = reply.senderId === state.currentUserId ? " own" : "";
  return `<article class="message-reply${own}">
    <div class="message-head">
      <div>
        <strong>${reply.from}</strong>
        <p class="muted">Komu: ${messageRecipientDisplay(reply, "Konverzácia")} · ${reply.date}</p>
      </div>
      <span class="tag">${reply.scope}</span>
    </div>
    <p>${escapeHtml(reply.text)}</p>
    <div class="row-actions">${messageActionButtons(reply)}</div>
  </article>`;
}

function messageRecipientDisplay(message, fallback = "") {
  if (message.to) return escapeHtml(message.to);
  if (message.recipientLabel) return escapeHtml(message.recipientLabel);
  if (message.scopeRaw === "public" || message.scope === "Verejná diskusia") return "Verejná diskusia";
  return escapeHtml(fallback || "Súkromný adresát");
}

function messageActionButtons(message) {
  const actions = [];
  if (canEditMessage(message)) actions.push(`<button class="ghost" data-edit="message" data-id="${message.id}">${icon("pencil")}<span>Upraviť</span></button>`);
  if (canReplyMessage(message)) actions.push(`<button class="primary" data-reply-message="${message.id}">${icon("reply")}<span>Odpovedať</span></button>`);
  if (canDeleteItem("message", message)) actions.push(deleteButton("message", message.id, message));
  return actions.join("");
}

function canEditMessage(message) {
  return Boolean(state.currentUserId && message.senderId === state.currentUserId);
}

function canReplyMessage(message) {
  if (!permissionFor(state.role, "messages").write || !state.currentUserId || message.senderId === state.currentUserId) return false;
  if (message.scopeRaw === "public") return communicationPermissionFor(state.role, "publicDiscussion");
  if (!communicationPermissionFor(state.role, "replyOnly")) return false;
  if (message.recipientId === state.currentUserId) return true;
  if (canManageAll() || state.role === "board") return true;
  return false;
}

function photoCard(photo) {
  return `<article class="photo-card searchable" data-text="${photo.title} ${photo.category} ${photo.author}">
    <button class="photo-preview-button" type="button" data-photo-preview="${photo.id}" aria-label="Zväčšiť fotku ${escapeAttr(photo.title)}">
      <img src="${photo.image}" alt="${escapeAttr(photo.title)}">
    </button>
    <div>
      <h3><button class="text-link" type="button" data-photo-preview="${photo.id}">${escapeHtml(photo.title)}</button></h3>
      <p>${photo.description}</p>
      <div class="tag-row"><span class="tag">${photo.category}</span><span class="tag">${photo.author}</span><span class="tag">${formatDate(photo.date)}</span></div>
      <div class="row-actions">${deleteButton("photo", photo.id, photo)}</div>
    </div>
  </article>`;
}

function openPhotoPreview(id) {
  const photo = state.photos.find((item) => String(item.id) === String(id));
  if (!photo) return;
  dialogSave.hidden = true;
  dialogTitle.textContent = photo.title;
  dialogBody.innerHTML = `
    <figure class="photo-preview">
      <img src="${photo.image}" alt="${escapeAttr(photo.title)}">
      <figcaption>
        <div>
          <strong>${escapeHtml(photo.title)}</strong>
          <p>${escapeHtml(photo.description || "Bez popisu")}</p>
        </div>
        <div class="tag-row">
          <span class="tag">${escapeHtml(photo.category || "Fotoalbum")}</span>
          <span class="tag">${escapeHtml(photo.author || "Používateľ")}</span>
          <span class="tag">${formatDate(photo.date)}</span>
        </div>
      </figcaption>
    </figure>
  `;
  dialog.showModal();
  enhanceIcons();
}

function normalizedVoteStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function isVoteCancelled(vote) {
  return ["cancelled", "canceled", "zrušené", "zrusene"].includes(normalizedVoteStatus(vote?.status));
}

function isVoteClosed(vote) {
  const normalized = normalizedVoteStatus(vote?.status);
  if (["closed", "ukončené", "ukoncene", "archivované", "archivovane"].includes(normalized)) return true;
  if (!vote?.closes) return false;
  const closes = new Date(vote.closes);
  if (Number.isNaN(closes.getTime())) return false;
  return closes < new Date();
}

function voteStatusLabel(status) {
  const normalized = normalizedVoteStatus(status);
  if (normalized === "open") return "Prebieha";
  if (normalized === "cancelled" || normalized === "canceled") return "Zrušené";
  if (normalized === "closed") return "Ukončené";
  return status || "Prebieha";
}

function voteCard(vote) {
  const total = vote.yes + vote.no + vote.abstain;
  const percent = total ? Math.round((vote.yes / total) * 100) : 0;
  const questions = vote.questions?.length ? vote.questions : [{ text: vote.description || vote.title, yes: vote.yes, no: vote.no, abstain: vote.abstain }];
  const cancelled = isVoteCancelled(vote);
  const actions = voteActions(vote, cancelled);
  const typeInfo = voteTypeInfo(vote.type);
  return `<article class="item vote-card ${cancelled ? "is-muted" : ""}">
    <div>
      <div class="vote-card-head">
        <div>
          <h3>${escapeHtml(vote.title)}</h3>
          <p class="muted">Hlasovať do: ${formatDate(vote.closes)} · otázky: ${questions.length} · komentáre: ${vote.comments}</p>
        </div>
        <span class="tag ${cancelled ? "urgent" : "document"}">${voteStatusLabel(vote.status)}</span>
      </div>
      <div class="vote-type-box">
        <strong>${escapeHtml(typeInfo.label)}</strong>
        <span>${escapeHtml(typeInfo.threshold)}</span>
      </div>
      <ol class="question-list vote-question-stats">${questions.map((question) => `<li><span>${escapeHtml(question.text)}</span><div class="tag-row"><span class="tag vote">Za ${question.yes || 0}</span><span class="tag">Proti ${question.no || 0}</span><span class="tag">Zdržal sa ${question.abstain || 0}</span>${question.myAnswer ? `<span class="tag document">Môj hlas: ${escapeHtml(question.myAnswer)}</span>` : ""}</div></li>`).join("")}</ol>
      ${myVoteStatus(vote)}
      <div class="progress" aria-label="Celkový podiel hlasov za"><span style="width:${percent}%"></span></div>
      <div class="tag-row"><span class="tag vote">Spolu za ${vote.yes}</span><span class="tag">Spolu proti ${vote.no}</span><span class="tag">Spolu zdržal sa ${vote.abstain}</span><span class="tag">${total} hlasov spolu</span></div>
      ${voteThread(vote)}
    </div>
    <div class="row-actions">${actions}</div>
  </article>`;
}

function voteActions(vote, cancelled) {
  if (state.role === "owner") {
    if (cancelled || isVoteClosed(vote)) return communicationPermissionFor(state.role, "voteComments") ? `<button class="ghost" data-vote-comment="${vote.id}">${icon("message-circle")}<span>Komentovať</span></button>` : "";
    return `${communicationPermissionFor(state.role, "voteComments") ? `<button class="ghost" data-vote-comment="${vote.id}">${icon("message-circle")}<span>Komentovať</span></button>` : ""}<button class="primary" data-vote-answer="${vote.id}">${icon("check-circle")}<span>${hasMyVote(vote) ? "Zmeniť hlas" : "Hlasovať"}</span></button>`;
  }
  if (state.role !== "chair") {
    return `${communicationPermissionFor(state.role, "voteComments") ? `<button class="ghost" data-vote-comment="${vote.id}">${icon("message-circle")}<span>Komentovať</span></button>` : ""}${!cancelled && !isVoteClosed(vote) ? `<button class="primary" data-vote-answer="${vote.id}">${icon("check-circle")}<span>${hasMyVote(vote) ? "Zmeniť hlas" : "Hlasovať"}</span></button>` : ""}`;
  }
  return cancelled
    ? `<button class="ghost" data-detail="vote" data-id="${vote.id}">${icon("info")}<span>Detail</span></button>${adminEditButton("vote", vote.id)}${deleteButton("vote", vote.id, vote)}`
    : `<button class="ghost" data-detail="vote" data-id="${vote.id}">${icon("info")}<span>Detail</span></button>${adminEditButton("vote", vote.id)}${canEditItem("vote") ? `<button class="ghost" data-cancel-vote="${vote.id}">${icon("ban")}<span>Zrušiť</span></button>` : ""}${deleteButton("vote", vote.id, vote)}${communicationPermissionFor(state.role, "voteComments") ? `<button class="ghost" data-vote-comment="${vote.id}">${icon("message-circle")}<span>Komentovať</span></button>` : ""}<button class="primary" data-vote-answer="${vote.id}">${icon("check-circle")}<span>${hasMyVote(vote) ? "Zmeniť hlas" : "Hlasovať"}</span></button>`;
}

function hasMyVote(vote) {
  return Boolean(vote.questions?.some((question) => question.myAnswer));
}

function myVoteStatus(vote) {
  if (!hasMyVote(vote)) return "";
  const values = vote.questions.map((question) => question.myAnswer ? `${question.text}: ${question.myAnswer}` : "").filter(Boolean);
  return `<div class="notice vote-status"><strong>Stav môjho hlasovania</strong><p>${values.map(escapeHtml).join("<br>")}</p><p class="muted">Hlas môžete zmeniť až do uzavretia hlasovania, teda do dňa domovej schôdze.</p></div>`;
}

function voteThread(vote) {
  if (!vote.thread?.length) return "";
  const repliesByParent = new Map();
  vote.thread.filter((comment) => comment.parentId).forEach((reply) => {
    const replies = repliesByParent.get(reply.parentId) || [];
    replies.push(reply);
    repliesByParent.set(reply.parentId, replies);
  });
  return `<div class="conversation-thread vote-thread">${vote.thread.filter((comment) => !comment.parentId).map((comment) => voteCommentCard(comment, repliesByParent.get(comment.id) || [])).join("")}</div>`;
}

function voteCommentCard(comment, replies = []) {
  const privateTag = comment.visibility === "private_chair" ? `<span class="tag urgent">Súkromne predsedovi</span>` : `<span class="tag document">Verejne</span>`;
  const editedTag = comment.updatedAt ? `<span class="tag">Upravené</span>` : "";
  const actions = voteCommentActions(comment);
  const childThread = replies.length ? `<div class="conversation-thread vote-comment-replies">${replies.map((reply) => voteCommentCard(reply, [])).join("")}</div>` : "";
  return `<article class="message-reply${comment.authorId === state.currentUserId ? " own" : ""}"><div class="message-head"><div><strong>${escapeHtml(comment.author)}</strong><p class="muted">${escapeHtml(comment.flat || comment.authorRole || roleLabel())} · ${formatDateTime(comment.date)}</p></div><div class="tag-row">${privateTag}${editedTag}</div></div><p>${escapeHtml(comment.body)}</p>${actions ? `<div class="row-actions compact">${actions}</div>` : ""}${childThread}</article>`;
}

function voteCommentActions(comment) {
  const actions = [];
  if (canReplyVoteComment(comment)) actions.push(`<button class="ghost" data-vote-comment-reply="${comment.id}">${icon("reply")}<span>Odpovedať</span></button>`);
  if (canEditVoteComment(comment)) actions.push(`<button class="ghost" data-vote-comment-edit="${comment.id}">${icon("pencil")}<span>Upraviť</span></button>`);
  if (canDeleteVoteComment(comment)) actions.push(`<button class="ghost" data-vote-comment-delete="${comment.id}">${icon("trash-2")}<span>Vymazať</span></button>`);
  return actions.join("");
}

function canReplyVoteComment(comment) {
  if (!communicationPermissionFor(state.role, "voteComments")) return false;
  if (comment.visibility === "private_chair") return state.role === "chair";
  return true;
}

function canEditVoteComment(comment) {
  return Boolean(comment.authorId && comment.authorId === state.currentUserId);
}

function canDeleteVoteComment() {
  return state.role === "chair";
}

function chairProfileId() {
  return state.boardMembers.find((member) => member.role === "Predseda SVB")?.id || null;
}

function calendarMonthDate() {
  const [year, month] = (state.calendarMonth || new Date().toISOString().slice(0, 7)).split("-").map(Number);
  return new Date(year || new Date().getFullYear(), (month || 1) - 1, 1);
}

function calendarMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function calendarDateKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function eventDateKey(event) {
  if (event.date) return String(event.date).slice(0, 10);
  if (event.startsAt) return new Date(event.startsAt).toISOString().slice(0, 10);
  if (event.day) {
    const month = calendarMonthDate();
    return calendarDateKey(month.getFullYear(), month.getMonth(), event.day);
  }
  return "";
}

function normalizeEventDateInput(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return value;
  const day = Number.parseInt(value, 10);
  const month = calendarMonthDate();
  const safeDay = Number.isFinite(day) && day > 0 ? day : new Date().getDate();
  return calendarDateKey(month.getFullYear(), month.getMonth(), safeDay);
}

function eventDateToStartsAt(value) {
  return new Date(`${normalizeEventDateInput(value)}T09:00:00`).toISOString();
}

function calendarCells() {
  const month = calendarMonthDate();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startsOnMondayIndex = (month.getDay() + 6) % 7;
  const cells = Array.from({ length: startsOnMondayIndex }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = calendarDateKey(year, monthIndex, day);
    cells.push({
      day,
      date,
      isToday: date === new Date().toISOString().slice(0, 10),
      events: state.events.filter((event) => eventDateKey(event) === date).sort(sortByEventDateAsc)
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function dayCard(cell, canCreate = false) {
  if (!cell) return `<article class="day is-empty" aria-hidden="true"></article>`;
  const eventList = cell.events.map((event) => `
    <span class="event-dot">
      <span>${escapeHtml(event.title)}</span>
      <span class="event-actions">
        ${canEditItem("event") ? `<button data-edit="event" data-id="${event.id}" aria-label="Upraviť udalosť">${icon("pencil")}</button>` : ""}
        ${canDeleteItem("event", event) ? `<button data-delete-item="event" data-id="${event.id}" aria-label="Vymazať udalosť">${icon("trash-2")}</button>` : ""}
      </span>
    </span>
  `).join("");
  return `
    <article class="day ${cell.isToday ? "is-today" : ""} ${canCreate ? "is-clickable" : ""}" data-calendar-day="${cell.date}" title="${canCreate ? "Pridať udalosť" : ""}">
      <strong>${cell.day}</strong>
      ${eventList || `<span class="day-placeholder">${canCreate ? "Pridať udalosť" : "Bez udalostí"}</span>`}
    </article>
  `;
}

function ownerRow(owner) {
  const debt = owner.isDebtor ? "Áno" : "Nie";
  const debtClass = owner.isDebtor ? "debt" : "ok";
  const approval = approvalLabel(owner.approvalStatus);
  return `<tr class="searchable" data-text="${owner.flat} ${owner.name} ${owner.email} ${owner.loginEmail} ${owner.note}">
    <td>${owner.flat}</td>
    <td>${owner.name}</td>
    <td>${owner.loginEmail}</td>
    <td><span class="tag">${owner.accountStatus}</span></td>
    <td><span class="tag ${owner.approvalStatus === "approved" ? "document" : "urgent"}">${approval}</span></td>
    <td>${formatDate(owner.ownedFrom)}</td>
    <td><span class="${debtClass}">${debt}</span></td>
    <td>${formatMoney(owner.debtAmount)}</td>
    <td>${owner.note}</td>
    <td><div class="row-actions">${["pending", "rejected"].includes(owner.approvalStatus) && canEditItem("owner") ? `<button class="primary" data-approve-owner="${owner.id}">${icon("user-check")}<span>Schváliť</span></button>` : ""}<button class="ghost" data-detail="owner" data-id="${owner.id}">${icon("info")}<span>Detail</span></button>${adminEditButton("owner", owner.id)}${canDeleteItem("owner", owner) ? `<button class="ghost" data-delete-owner="${owner.id}">${icon("trash-2")}<span>Vymazať</span></button>` : ""}</div></td>
  </tr>`;
}

function approvalLabel(value) {
  const labels = {
    approved: "Schválený",
    pending: "Čaká",
    rejected: "Zamietnutý",
    disabled: "Deaktivovaný"
  };
  return labels[value] || "Čaká";
}

function categoryRow(category) {
  const isEditableCategory = state.documentCategories.includes(category);
  return `<article class="item">
    <div><h3>${escapeHtml(category)}</h3><p class="muted">${isEditableCategory ? "Editovateľná položka filtra pre históriu dokumentov" : "Predvolený typ dokumentu dostupný vo filtroch"}</p></div>
    <div class="row-actions">${permissionFor(state.role, "documentHistory").write && isEditableCategory ? `<button class="ghost" data-edit-category="${escapeAttr(category)}">${icon("pencil")}<span>Upraviť</span></button>` : ""}${permissionFor(state.role, "documentHistory").delete && isEditableCategory ? `<button class="ghost" data-delete-category="${escapeAttr(category)}">${icon("trash-2")}<span>Vymazať</span></button>` : ""}</div>
  </article>`;
}

function templateCard(template) {
  return `<article class="template-card">
    <h3>${template.title}</h3>
    <div class="field"><label>Predmet</label><input data-template-subject="${template.id}" value="${escapeAttr(template.subject)}"></div>
    <div class="field"><label>Text emailu</label><textarea data-template-body="${template.id}">${template.body}</textarea></div>
    <div class="row-actions">${canEditItem("emailTemplate") ? `<button class="primary" data-save-template="${template.id}">${icon("save")}<span>Uložiť šablónu</span></button>` : ""}${deleteButton("emailTemplate", template.id, template)}</div>
  </article>`;
}

function notificationRow(item) {
  return `<article class="notification-row"><span class="tag">${item.type}</span><div><strong>${item.subject}</strong><p class="muted">${item.status}</p></div><span class="muted">${item.time}</span></article>`;
}

function permissionMatrix() {
  const permissions = rolePermissions();
  const communication = communicationPermissions();
  return ROLE_DEFINITIONS.map(([role, label]) => `
    <section class="permission-role">
      <h3>${escapeHtml(label)}</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Záložka</th>
              <th>Zobraziť</th>
              <th>Zápis / úprava</th>
              <th>Vymazať</th>
            </tr>
          </thead>
          <tbody>
            ${PERMISSION_VIEWS.map((view) => {
              const item = permissions?.[role]?.[view] || { read: false, write: false, delete: false };
              return `
                <tr>
                  <td><strong>${escapeHtml(titles[view] || view)}</strong></td>
                  ${permissionCheckbox(role, view, "read", item.read)}
                  ${permissionCheckbox(role, view, "write", item.write)}
                  ${permissionCheckbox(role, view, "delete", item.delete)}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="table-wrap communication-permissions">
        <table>
          <thead>
            <tr>
              <th>Komunikácia</th>
              <th>Povoliť</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(COMMUNICATION_PERMISSION_LABELS).map(([action, actionLabel]) => `
              <tr>
                <td><strong>${escapeHtml(actionLabel)}</strong></td>
                <td><input type="checkbox" data-communication-permission data-role="${escapeAttr(role)}" data-action="${escapeAttr(action)}" ${communication?.[role]?.[action] ? "checked" : ""}></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `).join("");
}

function permissionCheckbox(role, view, action, checked) {
  return `<td><input type="checkbox" data-permission data-role="${escapeAttr(role)}" data-view="${escapeAttr(view)}" data-action="${escapeAttr(action)}" ${checked ? "checked" : ""}></td>`;
}

function filteredActivityLogs() {
  return state.activityLogs.filter((item) =>
    (state.logRoleFilter === "all" || item.actorRole === state.logRoleFilter)
    && (state.logUserFilter === "all" || item.actorId === state.logUserFilter || item.actorEmail === state.logUserFilter)
    && (state.logActivityFilter === "all" || item.activityType === state.logActivityFilter)
  );
}

function logFilterOptions(kind) {
  if (kind === "role") {
    const roles = [...new Set(state.activityLogs.map((item) => item.actorRole).filter(Boolean))].sort();
    return [["all", "Všetky role"], ...roles.map((role) => [role, role])];
  }
  if (kind === "user") {
    const seen = new Set();
    const users = state.activityLogs
      .map((item) => [item.actorId || item.actorEmail, `${item.actorName}${item.actorEmail ? ` · ${item.actorEmail}` : ""}`])
      .filter(([value]) => value && !seen.has(value) && seen.add(value))
      .sort((a, b) => a[1].localeCompare(b[1], "sk"));
    return [["all", "Všetci používatelia"], ...users];
  }
  const activities = [...new Set(state.activityLogs.map((item) => item.activityType).filter(Boolean))].sort();
  return [["all", "Všetky aktivity"], ...activities.map((activity) => [activity, activityLabel(activity)])];
}

function activityLabel(type) {
  return {
    login: "Prihlásenie",
    create: "Vytvorenie",
    update: "Úprava",
    delete: "Vymazanie",
    approve: "Schválenie",
    vote: "Hlasovanie",
    comment: "Komentár",
    reply: "Odpoveď",
    profile: "Profil",
    settings: "Nastavenia"
  }[type] || type;
}

function activityLogRow(item) {
  const related = [item.relatedTable, item.relatedId].filter(Boolean).join(" · ") || "Bez väzby";
  return `
    <tr>
      <td>${formatDateTime(item.createdAt)}</td>
      <td><strong>${escapeHtml(item.actorName)}</strong>${item.actorEmail ? `<br><span class="muted">${escapeHtml(item.actorEmail)}</span>` : ""}</td>
      <td><span class="tag">${escapeHtml(item.actorRole)}</span></td>
      <td><strong>${escapeHtml(activityLabel(item.activityType))}</strong><br><span class="muted">${escapeHtml(item.activityLabel)}</span></td>
      <td>${escapeHtml(related)}</td>
      <td><button class="ghost" data-detail="activityLog" data-id="${item.id}">${icon("info")}<span>Detail</span></button></td>
    </tr>
  `;
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function toggle(label, checked) {
  return `<label class="item"><span>${label}</span><input type="checkbox" ${checked ? "checked" : ""}></label>`;
}

function segment(value, label) {
  return `<button data-filter="${value}" class="${state.filter === value ? "active" : ""}">${label}</button>`;
}

function formatDate(value) {
  if (!value) return "Neuvedené";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Neuvedené";
  return new Intl.DateTimeFormat("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatDateTime(value) {
  if (!value) return "Neuvedené";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Neuvedené";
  return new Intl.DateTimeFormat("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function formatMoney(value) {
  return new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" }).format(Number(value || 0));
}

function messageRecipientOptions() {
  const options = [];
  if (communicationPermissionFor(state.role, "publicDiscussion")) {
    options.push("Verejná diskusia");
  }
  if (communicationPermissionFor(state.role, "leadership")) {
    options.push("Predseda SVB", "Podpredseda SVB", "Ekonomická správa", "Dozorná rada");
  }
  if (communicationPermissionFor(state.role, "individualOwners")) {
    state.owners.forEach((owner) => options.push(`${owner.name} · ${owner.flat}`));
  }
  return options.length ? options : ["Verejná diskusia"];
}

function isPublicRecipient(label) {
  return ["Verejná diskusia", "Všetci vlastníci"].includes(label);
}

function isLeadershipRecipient(label) {
  return ["Predseda SVB", "Podpredseda SVB", "Ekonomická správa", "Dozorná rada"].includes(label);
}

function isChairRecipientLabel(label = "") {
  return ["Predseda SVB", "Predseda", "Martin Nagy"].includes(String(label).trim());
}

function emailTemplateByKey(key) {
  return state.emailTemplates.find((template) => template.key === key || template.id === key);
}

function fillEmailTemplate(value = "", replacements = {}) {
  return String(value).replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] ?? "");
}

function canStartMessageTo(label) {
  if (isPublicRecipient(label)) return communicationPermissionFor(state.role, "publicDiscussion");
  if (isLeadershipRecipient(label)) return communicationPermissionFor(state.role, "leadership");
  return communicationPermissionFor(state.role, "individualOwners");
}

function messageThreads() {
  const repliesByParent = new Map();
  state.messages.filter((message) => message.parentId).forEach((reply) => {
    const rootId = reply.parentId;
    const replies = repliesByParent.get(rootId) || [];
    replies.push(reply);
    repliesByParent.set(rootId, replies);
  });
  return state.messages
    .filter((message) => !message.parentId)
    .map((message) => ({
      ...message,
      replies: (repliesByParent.get(message.id) || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }));
}

function bindViewActions() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });

  document.querySelectorAll("[data-search]").forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.value.trim().toLowerCase();
      document.querySelectorAll(".searchable").forEach((item) => {
        item.hidden = !item.dataset.text.toLowerCase().includes(value);
      });
    });
  });

  document.querySelectorAll("[data-save-template]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!canEditItem("emailTemplate")) return;
      const template = state.emailTemplates.find((item) => item.id === button.dataset.saveTemplate);
      if (!template) return;
      template.subject = document.querySelector(`[data-template-subject="${template.id}"]`).value.trim();
      template.body = document.querySelector(`[data-template-body="${template.id}"]`).value.trim();
      if (supabaseClient && state.currentUserId) {
        await supabaseClient.from("email_templates").update({ subject: template.subject, body: template.body }).eq("id", template.id);
        await writeActivityLog("update", `Úprava e-mail šablóny: ${template.title}`, {
          relatedTable: "email_templates",
          relatedId: template.id,
          metadata: { subject: template.subject }
        });
      }
      state.notificationLog.unshift({ time: "Teraz", type: "Šablóna", subject: template.title, status: "Text automatického emailu bol upravený" });
      render();
    });
  });

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canEditItem(button.dataset.edit)) return;
      openEditDialog(button.dataset.edit, button.dataset.id);
    });
  });

  document.querySelectorAll("[data-open-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.openView;
      if (!canAccessView(view)) return;
      state.view = view;
      render();
    });
  });

  document.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => openDetailDialog(button.dataset.detail, button.dataset.id));
  });

  document.querySelectorAll("[data-reset-owner-password]").forEach((button) => {
    button.addEventListener("click", () => sendOwnerPasswordReset(button.dataset.resetOwnerPassword));
  });

  document.querySelectorAll("[data-vote-answer]").forEach((button) => {
    button.addEventListener("click", () => openVoteDialog(button.dataset.voteAnswer));
  });

  document.querySelectorAll("[data-vote-comment]").forEach((button) => {
    button.addEventListener("click", () => openVoteCommentDialog(button.dataset.voteComment));
  });

  document.querySelectorAll("[data-vote-comment-reply]").forEach((button) => {
    button.addEventListener("click", () => openVoteCommentReplyDialog(button.dataset.voteCommentReply));
  });

  document.querySelectorAll("[data-vote-comment-edit]").forEach((button) => {
    button.addEventListener("click", () => openVoteCommentEditDialog(button.dataset.voteCommentEdit));
  });

  document.querySelectorAll("[data-vote-comment-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteVoteComment(button.dataset.voteCommentDelete));
  });

  document.querySelectorAll("[data-cancel-vote]").forEach((button) => {
    button.addEventListener("click", () => cancelVote(button.dataset.cancelVote));
  });

  document.querySelectorAll("[data-reply-message]").forEach((button) => {
    button.addEventListener("click", () => openReplyDialog(button.dataset.replyMessage));
  });

  document.querySelectorAll("[data-comment-idea]").forEach((button) => {
    button.addEventListener("click", () => openInnovationCommentDialog(button.dataset.commentIdea));
  });

  document.querySelectorAll("[data-photo-preview]").forEach((button) => {
    button.addEventListener("click", () => openPhotoPreview(button.dataset.photoPreview));
  });

  document.querySelectorAll("[data-youtube-play]").forEach((button) => {
    button.addEventListener("click", () => openYoutubeDialog(button.dataset.youtubePlay));
  });

  document.querySelectorAll("[data-enable-app-notifications]").forEach((button) => {
    button.addEventListener("click", () => enableAppNotifications());
  });

  document.querySelectorAll("[data-disable-app-notifications]").forEach((button) => {
    button.addEventListener("click", () => disableAppNotifications());
  });

  document.querySelectorAll("[data-document-history-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.documentHistoryFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-document-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.filter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-message-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.messageFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-vote-type-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.voteTypeFilter = select.value;
      state.voteQuestionFilter = "all";
      state.voteHistoryFilter = "latest";
      state.currentVoteQuestionFilter = "all";
      state.historyVoteQuestionFilter = "all";
      render();
    });
  });

  document.querySelectorAll("[data-current-vote-question-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.currentVoteQuestionFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-history-vote-question-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.historyVoteQuestionFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-vote-history-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.voteHistoryFilter = select.value;
      state.historyVoteQuestionFilter = "all";
      render();
    });
  });

  document.querySelectorAll("[data-log-role-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.logRoleFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-log-user-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.logUserFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-log-activity-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.logActivityFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-calendar-prev]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftCalendarMonth(-1);
    });
  });

  document.querySelectorAll("[data-calendar-next]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftCalendarMonth(1);
    });
  });

  document.querySelectorAll("[data-calendar-today]").forEach((button) => {
    button.addEventListener("click", () => {
      state.calendarMonth = new Date().toISOString().slice(0, 7);
      render();
    });
  });

  document.querySelectorAll("[data-calendar-month]").forEach((input) => {
    input.addEventListener("change", () => {
      state.calendarMonth = input.value || new Date().toISOString().slice(0, 7);
      render();
    });
  });

  document.querySelectorAll("[data-calendar-day]").forEach((day) => {
    day.addEventListener("click", (event) => {
      if (!canCreateInView("calendar") || event.target.closest("button")) return;
      openCreateDialog({ calendarDate: day.dataset.calendarDay });
    });
  });

  document.querySelectorAll("[data-add-category]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!permissionFor(state.role, "documentHistory").write) return;
      openCategoryDialog();
    });
  });

  document.querySelectorAll("[data-edit-category]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!permissionFor(state.role, "documentHistory").write) return;
      openCategoryDialog(button.dataset.editCategory);
    });
  });

  document.querySelectorAll("[data-delete-category]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!permissionFor(state.role, "documentHistory").delete) return;
      deleteCategory(button.dataset.deleteCategory);
    });
  });

  document.querySelectorAll("[data-delete-item]").forEach((button) => {
    button.addEventListener("click", () => deleteItem(button.dataset.deleteItem, button.dataset.id));
  });

  document.querySelectorAll("[data-approve-owner]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canEditItem("owner")) return;
      openApproveOwnerDialog(button.dataset.approveOwner);
    });
  });

  document.querySelectorAll("[data-delete-owner]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canDeleteItem("owner")) return;
      deleteOwner(button.dataset.deleteOwner);
    });
  });

  document.querySelectorAll("[data-save-profile]").forEach((button) => {
    button.addEventListener("click", () => saveProfile());
  });

  document.querySelectorAll("[data-permission]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if ((checkbox.dataset.action === "write" || checkbox.dataset.action === "delete") && checkbox.checked) {
        const read = document.querySelector(`[data-permission][data-role="${checkbox.dataset.role}"][data-view="${checkbox.dataset.view}"][data-action="read"]`);
        if (read) read.checked = true;
      }
    });
  });

  document.querySelectorAll("[data-save-permissions]").forEach((button) => {
    button.addEventListener("click", () => saveRolePermissions());
  });

  document.querySelectorAll("[data-save-live-chat]").forEach((button) => {
    button.addEventListener("click", () => saveLiveChatSettings());
  });

  const operationModePreset = document.querySelector("#operationModePreset");
  const operationModeText = document.querySelector("#operationModeText");
  if (operationModePreset && operationModeText) {
    operationModePreset.addEventListener("change", () => {
      if (operationModePreset.value !== "custom") operationModeText.value = operationModePreset.value;
    });
  }

  document.querySelectorAll("[data-save-password]").forEach((button) => {
    button.addEventListener("click", () => saveProfilePassword());
  });

  document.querySelectorAll("[data-install-app]").forEach((button) => {
    button.addEventListener("click", () => installPwa(button.dataset.installApp));
  });
}

function shiftCalendarMonth(offset) {
  const month = calendarMonthDate();
  month.setMonth(month.getMonth() + offset);
  state.calendarMonth = calendarMonthKey(month);
  render();
}

function openCreateDialog(defaults = {}) {
  const type = state.view;
  if (!canCreateInView(type)) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = actionLabel();
  dialogBody.innerHTML = formFor(type, defaults);
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveDialog(type);
  };
  dialog.showModal();
  enhanceIcons();
  bindDialogActions();
}

function openEditDialog(type, id) {
  if (!canEditItem(type)) return;
  const item = findEditable(type, id);
  if (!item) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = `Upraviť: ${editTitle(type, item)}`;
  dialogBody.innerHTML = editFormFor(type, item);
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveEditDialog(type, id);
  };
  dialog.showModal();
  enhanceIcons();
}

function openCategoryDialog(category = "") {
  if (!permissionFor(state.role, "documentHistory").write) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = category ? "Upraviť kategóriu" : "Nová kategória";
  dialogBody.innerHTML = fieldsWithValues([["title", "Názov kategórie", category || "Nová kategória"]]);
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    const nextName = document.querySelector("#title")?.value.trim();
    if (!nextName) return;

    if (supabaseClient && state.currentUserId) {
      if (category) {
        const { error } = await supabaseClient.from("document_categories").update({ name: nextName }).eq("name", category);
        if (error) {
          window.alert(`Úprava kategórie zlyhala: ${error.message}`);
          return;
        }
        await supabaseClient.from("documents").update({ category: nextName }).eq("category", category);
      } else {
        const { error } = await supabaseClient.from("document_categories").insert({ name: nextName, sort_order: state.documentCategories.length * 10 + 10 });
        if (error) {
          window.alert(`Pridanie kategórie zlyhalo: ${error.message}`);
          return;
        }
      }
      await writeActivityLog(category ? "update" : "create", category ? `Úprava kategórie dokumentov: ${category} -> ${nextName}` : `Vytvorenie kategórie dokumentov: ${nextName}`, {
        relatedTable: "document_categories",
        relatedId: nextName,
        metadata: { previousName: category || null, nextName }
      });
      await loadSupabaseData();
    } else {
      if (category) {
        state.documentCategories = state.documentCategories.map((item) => item === category ? nextName : item);
        state.documentHistory.forEach((item) => {
          if (item.category === category) item.category = nextName;
        });
        if (state.documentHistoryFilter === category) state.documentHistoryFilter = nextName;
      } else {
        state.documentCategories.push(nextName);
      }
    }

    dialog.close();
    render();
  };
  dialog.showModal();
  enhanceIcons();
}

function openDetailDialog(type, id) {
  const item = findEditable(type, id);
  if (!item) return;
  if (type === "vote") state.voteDetailOwnerFilter = "all";
  dialogSave.hidden = true;
  dialogTitle.textContent = detailTitle(type, item);
  dialogBody.innerHTML = detailBody(type, item);
  dialog.showModal();
  enhanceIcons();
  bindDialogActions();
}

function bindDialogActions() {
  dialogBody.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canEditItem(button.dataset.edit)) return;
      openEditDialog(button.dataset.edit, button.dataset.id);
    });
  });
  dialogBody.querySelectorAll("[data-reset-owner-password]").forEach((button) => {
    button.addEventListener("click", () => sendOwnerPasswordReset(button.dataset.resetOwnerPassword));
  });
  dialogBody.querySelectorAll("[data-youtube-play]").forEach((button) => {
    button.addEventListener("click", () => openYoutubeDialog(button.dataset.youtubePlay));
  });
  dialogBody.querySelectorAll("[data-vote-owner-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.voteDetailOwnerFilter = select.value;
      const voteId = dialogBody.querySelector("[data-vote-detail-id]")?.dataset.voteDetailId;
      const vote = state.votes.find((item) => String(item.id) === String(voteId));
      if (!vote) return;
      dialogBody.innerHTML = detailBody("vote", vote);
      bindDialogActions();
      enhanceIcons();
    });
  });
}

function detailTitle(type, item) {
  if (type === "activityLog") return `Log: ${activityLabel(item.activityType)}`;
  if (type === "owner") return `Vlastník: ${item.name}`;
  if (type === "announcement") return item.title;
  if (type === "document" || type === "historyDocument") return item.title;
  if (type === "billingSettlement") return item.title;
  if (type === "executionCase") return `${item.ownerName} · ${item.flat}`;
  if (type === "vote") return item.title;
  return editTitle(type, item);
}

function voteOwnerAnswerRows(questions) {
  const rows = questions.flatMap((question) =>
    (question.voters || []).map((voter) => ({ question: question.text, ...voter }))
  );
  if (!rows.length) return `<p class="muted">Zatiaľ nie je zaznamenovaný žiadny hlas vlastníka.</p>`;
  const ownerOptions = voteOwnerAnswerOptions(rows);
  const selectedOwner = ownerOptions.some((option) => option.id === state.voteDetailOwnerFilter) ? state.voteDetailOwnerFilter : "all";
  if (state.voteDetailOwnerFilter !== selectedOwner) state.voteDetailOwnerFilter = selectedOwner;
  const filteredRows = selectedOwner === "all" ? rows : rows.filter((row) => voteOwnerAnswerKey(row) === selectedOwner);
  return `
    <div class="toolbar compact-toolbar">
      <div>
        <h4>Stav hlasovania podľa vlastníka</h4>
        <p class="muted">${filteredRows.length} záznamov z celkového počtu ${rows.length}</p>
      </div>
      <select class="search wide-select" data-vote-owner-filter aria-label="Filter podľa vlastníka nehnuteľnosti">
        <option value="all" ${selectedOwner === "all" ? "selected" : ""}>Všetci vlastníci nehnuteľností</option>
        ${ownerOptions.map((owner) => `<option value="${escapeAttr(owner.id)}" ${selectedOwner === owner.id ? "selected" : ""}>${escapeHtml(owner.label)}</option>`).join("")}
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Otázka</th>
            <th>Byt</th>
            <th>Vlastník</th>
            <th>Hlas</th>
            <th>Komentár</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRows.map((row) => `
            <tr>
              <td>${escapeHtml(row.question)}</td>
              <td>${escapeHtml(row.flat)}</td>
              <td>${escapeHtml(row.name)}${row.email ? `<br><span class="muted">${escapeHtml(row.email)}</span>` : ""}</td>
              <td><span class="tag vote">${escapeHtml(row.answer)}</span></td>
              <td>${escapeHtml(row.comment || "")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function voteOwnerAnswerKey(row) {
  return row.profileId || row.email || `${row.name || "Vlastník"}|${row.flat || ""}`;
}

function voteOwnerAnswerOptions(rows) {
  const owners = new Map();
  rows.forEach((row) => {
    const key = voteOwnerAnswerKey(row);
    if (!key || owners.has(key)) return;
    const flat = row.flat ? ` · byt ${row.flat}` : "";
    owners.set(key, { id: key, label: `${row.name || "Vlastník nehnuteľnosti"}${flat}` });
  });
  return [...owners.values()].sort((a, b) => a.label.localeCompare(b.label, "sk"));
}

function detailBody(type, item) {
  if (type === "owner") {
    return `
      <div class="detail-grid">
        ${readonlyField("Meno a priezvisko", item.name || "Neuvedené")}
        ${readonlyField("Číslo bytu / poznámka", item.flat || "Bez bytu")}
        ${readonlyField("Login email", item.loginEmail || item.email || "Neuvedené")}
        ${readonlyField("Telefón", item.phone || "Neuvedené")}
        ${readonlyField("Stav účtu", item.accountStatus || item.status || "Neuvedené")}
        ${readonlyField("Autorizácia", approvalLabel(item.approvalStatus))}
        ${readonlyField("Vlastník od", item.ownedFrom ? formatDate(item.ownedFrom) : "Neuvedené")}
        ${readonlyField("Dlžník", item.isDebtor ? "Áno" : "Nie")}
        ${readonlyField("Výška dlhu", formatMoney(item.debtAmount))}
      </div>
      <section class="detail-section">
        <h3>Korešpondenčná adresa</h3>
        <p>${escapeHtml([item.correspondenceStreet, item.correspondencePostalCode, item.correspondenceCity].filter(Boolean).join(", ") || "Korešpondenčná adresa nie je doplnená.")}</p>
      </section>
      <section class="detail-section">
        <h3>Poznámka</h3>
        <p>${escapeHtml(item.note || "Bez poznámky.")}</p>
      </section>
      <div class="row-actions">
        ${canEditItem("owner") ? `<button class="primary" data-edit="owner" data-id="${item.id}">${icon("pencil")}<span>Upraviť vlastníka</span></button>` : ""}
        ${canEditItem("owner") ? `<button class="ghost" data-reset-owner-password="${item.id}">${icon("key-round")}<span>Odoslať reset hesla</span></button>` : ""}
      </div>
    `;
  }
  if (type === "activityLog") {
    return `
      <div class="detail-grid">
        ${readonlyField("Čas", formatDateTime(item.createdAt))}
        ${readonlyField("Používateľ", item.actorName)}
        ${readonlyField("Email", item.actorEmail || "Neuvedené")}
        ${readonlyField("Rola", item.actorRole)}
        ${readonlyField("Aktivita", activityLabel(item.activityType))}
        ${readonlyField("Súvisiaca tabuľka", item.relatedTable || "Bez väzby")}
        ${readonlyField("ID položky", item.relatedId || "Bez väzby")}
      </div>
      <section class="detail-section">
        <h3>Popis aktivity</h3>
        <p>${escapeHtml(item.activityLabel)}</p>
      </section>
      <section class="detail-section">
        <h3>Technický detail</h3>
        <pre class="metadata-box">${escapeHtml(JSON.stringify(item.metadata || {}, null, 2))}</pre>
      </section>
    `;
  }
  if (type === "announcement") {
    return `
      <div class="detail-grid">
        ${readonlyField("Kategória", item.category || "Oznam")}
        ${readonlyField("Dátum", formatDate(item.date))}
        ${readonlyField("Stav", item.urgent ? "Urgentné" : "Bežné")}
      </div>
      <article class="card"><p>${escapeHtml(item.body || "Bez textu")}</p></article>
      ${mediaPreviewBlock(item)}
      <div class="row-actions">${documentFileActions(item)}</div>
    `;
  }
  if (type === "document" || type === "historyDocument") {
    const category = item.type || item.category || "Dokument";
    const note = item.visibility || item.note || "Bez popisu";
    return `
      <div class="detail-grid">
        ${readonlyField("Kategória", category)}
        ${readonlyField("Dátum", formatDate(item.date))}
        ${readonlyField("Autor", item.author || item.owner || "SVB")}
      </div>
      <article class="card"><p>${escapeHtml(note)}</p></article>
      ${mediaPreviewBlock(item)}
      <div class="row-actions">${documentFileActions(item)}</div>
    `;
  }
  if (type === "billingSettlement") {
    return `
      <div class="detail-grid">
        ${readonlyField("Vlastník", item.ownerName || "Vlastník nehnuteľnosti")}
        ${readonlyField("Byt", item.flat || "Bez bytu")}
        ${readonlyField("Rok", item.year || "Neuvedené")}
        ${readonlyField("Dátum zverejnenia", formatDate(item.date))}
      </div>
      <article class="card"><p>${escapeHtml(item.note || "Vyúčtovanie vlastníka nehnuteľnosti.")}</p></article>
      <div class="row-actions">${documentFileActions(item)}</div>
    `;
  }
  if (type === "executionCase") {
    return `
      <div class="detail-grid">
        ${readonlyField("Vlastník", item.ownerName || "Neurčený vlastník")}
        ${readonlyField("Byt", item.flat || "Bez bytu")}
        ${readonlyField("Evidovaný dlh", formatMoney(item.debtAmount))}
        ${readonlyField("Dlh od", item.debtSince ? formatDate(item.debtSince) : "Neuvedené")}
        ${readonlyField("Stav prípadu", item.status || "Evidovaný dlh")}
        ${readonlyField("Exekučný titul", item.executionTitleStatus || "Neposúdené")}
        ${readonlyField("Posledný úkon", item.lastActionDate ? formatDate(item.lastActionDate) : "Neuvedené")}
        ${readonlyField("Ďalší krok", item.nextStepDate ? formatDate(item.nextStepDate) : "Neuvedené")}
      </div>
      <section class="detail-section">
        <h3>História vzniku dlhu</h3>
        <p>${escapeHtml(item.debtHistory || "História vzniku dlhu zatiaľ nie je doplnená.")}</p>
      </section>
      <section class="detail-section">
        <h3>Aktuálny právny stav</h3>
        <p>${escapeHtml(item.legalStatus || "Aktuálny právny stav zatiaľ nie je doplnený.")}</p>
      </section>
      <article class="notice">
        <strong>Poznámka</strong>
        <p>${escapeHtml(item.note || "Bez poznámky.")}</p>
      </article>
    `;
  }
  if (type === "vote") {
    const questions = item.questions?.length ? item.questions : [{ text: item.description || item.title, yes: item.yes, no: item.no, abstain: item.abstain }];
    const chairAnswers = canManageAll() ? `
      <section class="detail-section">
        <h3>Hlasovanie podľa vlastníkov</h3>
        ${voteOwnerAnswerRows(questions)}
      </section>
    ` : "";
    return `
      <span class="hidden" data-vote-detail-id="${escapeAttr(item.id)}"></span>
      <div class="detail-grid">
        ${readonlyField("Typ hlasovania", voteTypeInfo(item.type).label)}
        ${readonlyField("Potrebné kvórum", voteTypeInfo(item.type).threshold)}
        ${readonlyField("Uzatvorenie", formatDate(item.closes))}
        ${readonlyField("Stav", voteStatusLabel(item.status))}
        ${readonlyField("Komentáre", item.comments || 0)}
      </div>
      <ol class="question-list vote-question-stats">
        ${questions.map((question) => `<li><span>${escapeHtml(question.text)}</span><div class="tag-row"><span class="tag vote">Za ${question.yes || 0}</span><span class="tag">Proti ${question.no || 0}</span><span class="tag">Zdržal sa ${question.abstain || 0}</span></div></li>`).join("")}
      </ol>
      <div class="tag-row"><span class="tag vote">Za ${item.yes}</span><span class="tag">Proti ${item.no}</span><span class="tag">Zdržal sa ${item.abstain}</span></div>
      ${chairAnswers}
    `;
  }
  return `<article class="card"><p>Detail položky je dostupný v príslušnej záložke.</p></article>`;
}

function openVoteDialog(id) {
  const vote = state.votes.find((item) => String(item.id) === String(id));
  if (!vote) return;
  if (isVoteCancelled(vote)) {
    window.alert("Toto hlasovanie bolo zrušené a nie je možné v ňom hlasovať.");
    return;
  }
  if (isVoteClosed(vote)) {
    window.alert("Toto hlasovanie je uzavreté a hlas už nie je možné meniť.");
    return;
  }
  const questions = vote.questions?.length ? vote.questions : [{ id: "", text: vote.description || vote.title }];
  dialogSave.hidden = false;
  dialogTitle.textContent = `Hlasovanie: ${vote.title}`;
  dialogBody.innerHTML = `
    <p class="muted">Hlasovať do: ${formatDate(vote.closes)}</p>
    <div class="vote-question-form">
      ${questions.map((question, index) => `
        <div class="field">
          <label for="voteAnswer-${index}">${index + 1}. ${escapeHtml(question.text)}</label>
          <select id="voteAnswer-${index}" data-vote-question-id="${question.id || ""}">
            <option value="Za" ${question.myAnswer === "Za" ? "selected" : ""}>Za</option>
            <option value="Proti" ${question.myAnswer === "Proti" ? "selected" : ""}>Proti</option>
            <option value="Zdržal sa" ${question.myAnswer === "Zdržal sa" ? "selected" : ""}>Zdržal sa</option>
          </select>
        </div>
      `).join("")}
    </div>
    ${communicationPermissionFor(state.role, "voteComments") ? fieldsWithValues([["voteComment", "Komentár k hlasovaniu", "", "textarea"]]) : ""}
  `;
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveVoteAnswer(vote.id);
  };
  dialog.showModal();
  enhanceIcons();
}

function openVoteCommentDialog(id) {
  if (!communicationPermissionFor(state.role, "voteComments")) return;
  const vote = state.votes.find((item) => String(item.id) === String(id));
  if (!vote) return;
  if (isVoteCancelled(vote)) {
    window.alert("Toto hlasovanie bolo zrušené a nie je možné k nemu dopĺňať komentáre.");
    return;
  }
  dialogSave.hidden = false;
  dialogTitle.textContent = `Komentár: ${vote.title}`;
  dialogBody.innerHTML = fieldsWithValues([
    ["voteCommentVisibility", "Adresovanie komentára", "public", "select", [["public", "Verejne pri hlasovaní"], ["private_chair", "Súkromne predsedovi SVB"]]],
    ["voteComment", "Komentár", "", "textarea"]
  ]);
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveVoteAnswer(vote.id, true);
  };
  dialog.showModal();
  enhanceIcons();
}

function openVoteCommentReplyDialog(id) {
  const comment = findVoteComment(id);
  if (!comment || !canReplyVoteComment(comment)) return;
  const vote = state.votes.find((item) => String(item.id) === String(comment.voteId));
  if (!vote || isVoteCancelled(vote)) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = `Odpoveď k hlasovaniu: ${vote.title}`;
  const visibilityLabel = comment.visibility === "private_chair" ? "Súkromná konverzácia s predsedom SVB" : "Verejná diskusia";
  dialogBody.innerHTML = `
    <article class="card">
      <span class="tag ${comment.visibility === "private_chair" ? "urgent" : "document"}">${visibilityLabel}</span>
      <p class="muted">Pôvodný komentár od ${escapeHtml(comment.author)}</p>
      <p>${escapeHtml(comment.body)}</p>
    </article>
    ${fieldsWithValues([["voteComment", "Odpoveď", "", "textarea"]])}
  `;
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveVoteComment(vote.id, {
      body: document.querySelector("#voteComment")?.value.trim() || "",
      visibility: comment.visibility,
      parentId: comment.id,
      recipientId: comment.visibility === "private_chair" ? privateVoteReplyRecipient(comment) : null
    });
  };
  dialog.showModal();
  enhanceIcons();
}

function openVoteCommentEditDialog(id) {
  const comment = findVoteComment(id);
  if (!comment || !canEditVoteComment(comment)) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = "Upraviť komentár k hlasovaniu";
  dialogBody.innerHTML = fieldsWithValues([["voteComment", "Komentár", comment.body, "textarea"]]);
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await updateVoteComment(comment.id, document.querySelector("#voteComment")?.value.trim() || "");
  };
  dialog.showModal();
  enhanceIcons();
}

function openReplyDialog(id) {
  const message = state.messages.find((item) => String(item.id) === String(id));
  if (!message || !canReplyMessage(message)) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = `Odpoveď: ${message.subject}`;
  dialogBody.innerHTML = `
    <article class="card">
      <span class="tag">${message.scope}</span>
      <p class="muted">Pôvodná správa od ${message.from}</p>
      <p>${escapeHtml(message.text)}</p>
    </article>
    ${fieldsWithValues([
      ["title", "Predmet", message.subject.startsWith("Re:") ? message.subject : `Re: ${message.subject}`],
      ["note", "Odpoveď", "", "textarea"]
    ])}
  `;
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveMessageReply(message);
  };
  dialog.showModal();
  enhanceIcons();
}

function openInnovationCommentDialog(id) {
  const idea = state.innovationIdeas.find((item) => String(item.id) === String(id));
  if (!idea) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = `Vyjadrenie k podnetu: ${idea.title}`;
  dialogBody.innerHTML = fieldsWithValues([["note", "Komentár", "", "textarea"]]);
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await saveInnovationComment(idea);
  };
  dialog.showModal();
  enhanceIcons();
}

async function saveInnovationComment(idea) {
  const body = document.querySelector("#note")?.value.trim();
  if (!body) {
    window.alert("Napíšte komentár k podnetu.");
    return;
  }
  if (supabaseClient && state.currentUserId) {
    const { error } = await supabaseClient.from("innovation_comments").insert({
      idea_id: idea.id,
      profile_id: state.currentUserId,
      body
    });
    if (error) {
      window.alert(`Komentár sa nepodarilo uložiť: ${error.message}`);
      return;
    }
    await writeActivityLog("comment", `Komentár k podnetu: ${idea.title}`, {
      relatedTable: "innovation_ideas",
      relatedId: idea.id,
      metadata: { comment: body.slice(0, 500) }
    });
    await loadSupabaseData();
  } else {
    idea.comments.push({ id: Date.now(), ideaId: idea.id, author: roleLabel(), body, date: new Date().toISOString() });
  }
  dialog.close();
  render();
}

function openApproveOwnerDialog(id) {
  if (!canEditItem("owner")) return;
  const owner = state.owners.find((item) => String(item.id) === String(id));
  if (!owner) return;
  dialogSave.hidden = false;
  dialogTitle.textContent = `Schváliť registráciu: ${owner.name}`;
  dialogBody.innerHTML = `
    <article class="card">
      <p class="muted">Po potvrdení bude vlastník aktivovaný a získa prístup k prostrediu vlastníka nehnuteľnosti.</p>
      <div class="detail-grid">
        ${readonlyField("Byt", owner.flat)}
        ${readonlyField("Email", owner.loginEmail || owner.email || "Bez emailu")}
      </div>
    </article>
    ${notificationFields("individual", owner.profileId || owner.id)}
  `;
  dialogSave.onclick = async (event) => {
    event.preventDefault();
    await approveOwner(owner.id, collectNotificationOptions(owner.profileId || owner.id));
  };
  dialog.showModal();
  enhanceIcons();
}

async function saveMessageReply(original) {
  const subject = document.querySelector("#title")?.value.trim() || `Re: ${original.subject}`;
  const body = document.querySelector("#note")?.value.trim();
  if (!body) {
    window.alert("Napíšte text odpovede.");
    return;
  }

  if (supabaseClient && state.currentUserId) {
    const parentId = original.parentId || original.id;
    const { data, error } = await supabaseClient.from("messages").insert({
      parent_id: parentId,
      sender_id: state.currentUserId,
      recipient_id: original.senderId || null,
      recipient_label: original.from || "Odpoveď v konverzácii",
      subject,
      body,
      scope: "private"
    }).select("id").single();
    if (error) {
      window.alert(`Odpoveď sa nepodarilo uložiť: ${error.message}`);
      return;
    }
    if (isChairRecipientLabel(original.from)) {
      await notifyChairAboutMessage({
        subject,
        message: body,
        scope: "Súkromná odpoveď predsedovi SVB",
        recipient: original.from || "Predseda SVB",
        relatedId: data?.id || parentId
      });
    }
    await writeActivityLog("reply", `Odpoveď na správu: ${original.subject}`, {
      relatedTable: "messages",
      relatedId: parentId,
      metadata: { subject, recipient: original.from }
    });
    await loadSupabaseData();
  } else {
    state.messages.unshift({ id: Date.now(), parentId: original.parentId || original.id, scope: "Súkromná správa", scopeRaw: "private", senderId: state.currentUserId, recipientId: original.senderId || null, recipientLabel: original.from, from: roleLabel(), to: original.from, subject, text: body, date: "Teraz", createdAt: new Date().toISOString(), read: false });
  }
  dialog.close();
  render();
}

async function approveOwner(id, notification = { target: "none", ownerId: "" }) {
  if (!canManageAll()) return;
  const owner = state.owners.find((item) => String(item.id) === String(id));
  if (!owner) return;
  if (supabaseClient && state.currentUserId) {
    const { error } = await supabaseClient.from("owner_records").update({
      approval_status: "approved",
      account_status: "Aktívny",
      updated_at: new Date().toISOString()
    }).eq("id", owner.id);
    if (error) {
      window.alert(`Schválenie vlastníka zlyhalo: ${error.message}`);
      return;
    }
    if (owner.profileId) {
      await supabaseClient.from("profiles").update({ approval_status: "approved" }).eq("id", owner.profileId);
    }
  }
  owner.approvalStatus = "approved";
  owner.accountStatus = "Aktívny";
  owner.status = "Aktívny";
  state.notificationLog.unshift({ time: "Teraz", type: "Autorizácia", subject: owner.name, status: `Registrácia vlastníka ${owner.loginEmail} bola schválená predsedom SVB` });
  await writeActivityLog("approve", `Schválenie registrácie: ${owner.name}`, {
    relatedTable: "owner_records",
    relatedId: owner.id,
    metadata: { ownerName: owner.name, flat: owner.flat, email: owner.loginEmail || owner.email }
  });
  await notifyByChoice("Registrácia vlastníka schválená", owner.name, `Registrácia vlastníka ${owner.name} pre byt ${owner.flat} bola schválená.`, notification, "owner_records", owner.id);
  dialog.close();
  if (supabaseClient && state.currentUserId) await loadSupabaseData();
  render();
}

async function deleteOwner(id) {
  if (!canDeleteItem("owner")) return;
  const owner = state.owners.find((item) => String(item.id) === String(id));
  if (!owner) return;
  const confirmed = window.confirm(`Vymazať vlastníka ${owner.name} (${owner.flat}) vrátane jeho prihlasovacieho účtu? Po vymazaní sa už nebude vedieť prihlásiť a email bude možné zaregistrovať znova.`);
  if (!confirmed) return;
  if (supabaseClient && state.currentUserId) {
    const { data, error } = await supabaseClient.functions.invoke("delete-owner-account", {
      body: {
        ownerRecordId: owner.id,
        profileId: owner.profileId || "",
        email: owner.loginEmail || owner.email || ""
      }
    });
    if (error || data?.error) {
      window.alert(`Vymazanie vlastníka zlyhalo: ${data?.error || error.message}`);
      return;
    }
    await writeActivityLog("delete", `Vymazanie vlastníka: ${owner.name}`, {
      relatedTable: "owner_records",
      relatedId: owner.id,
      metadata: { ownerName: owner.name, flat: owner.flat, email: owner.loginEmail || owner.email }
    });
    await loadSupabaseData();
  } else {
    state.owners = state.owners.filter((item) => String(item.id) !== String(id));
  }
  state.notificationLog.unshift({ time: "Teraz", type: "Vlastník", subject: owner.name, status: "Vlastník aj jeho prihlasovací účet boli vymazané" });
  render();
}

async function deleteCategory(category) {
  if (!permissionFor(state.role, "documentHistory").delete || !category) return;
  const usedCount = state.documentHistory.filter((item) => item.category === category).length + state.documents.filter((item) => item.type === category).length;
  const warning = usedCount ? `\n\nKategória je použitá pri ${usedCount} dokumentoch. Dokumenty ostanú uložené, ale ich kategóriu bude vhodné upraviť.` : "";
  const confirmed = window.confirm(`Vymazať kategóriu "${category}"?${warning}`);
  if (!confirmed) return;
  if (supabaseClient && state.currentUserId) {
    const { error } = await supabaseClient.from("document_categories").delete().eq("name", category);
    if (error) {
      window.alert(`Vymazanie kategórie zlyhalo: ${error.message}`);
      return;
    }
    await writeActivityLog("delete", `Vymazanie kategórie dokumentov: ${category}`, {
      relatedTable: "document_categories",
      relatedId: category,
      metadata: { category, usedCount }
    });
    await loadSupabaseData();
  } else {
    state.documentCategories = state.documentCategories.filter((item) => item !== category);
    if (state.documentHistoryFilter === category) state.documentHistoryFilter = "all";
  }
  render();
}

async function deleteItem(type, id) {
  const item = findEditable(type, id)
    || (type === "photo" ? state.photos.find((photo) => String(photo.id) === String(id)) : null)
    || (type === "emailTemplate" ? state.emailTemplates.find((template) => String(template.id) === String(id)) : null)
    || (type === "financeEntry" ? state.financeEntries.find((entry) => String(entry.id) === String(id)) : null)
    || (type === "innovationIdea" ? state.innovationIdeas.find((idea) => String(idea.id) === String(id)) : null);
  if (!item || !canDeleteItem(type, item)) return;
  if (type === "owner") {
    await deleteOwner(id);
    return;
  }
  const label = deleteItemLabel(type, item);
  const confirmed = window.confirm(`Naozaj vymazať položku "${label}"?`);
  if (!confirmed) return;

  if (supabaseClient && state.currentUserId) {
    try {
      await deleteItemFromSupabase(type, item);
      await writeActivityLog("delete", `Vymazanie položky: ${label}`, {
        relatedTable: type,
        relatedId: id,
        metadata: { title: label }
      });
      await loadSupabaseData();
    } catch (error) {
      window.alert(`Vymazanie zlyhalo: ${error.message}`);
      return;
    }
  } else {
    deleteItemFromState(type, id);
  }

  state.notificationLog.unshift({ time: "Teraz", type: "Vymazanie", subject: label, status: "Položka bola vymazaná" });
  render();
}

function deleteItemLabel(type, item) {
  if (type === "message") return item.subject || "Správa";
  if (type === "boardMember") return item.name;
  if (type === "executionCase") return `${item.ownerName} · ${item.flat}`;
  return item.title || item.name || item.category || "Položka";
}

async function deleteItemFromSupabase(type, item) {
  if (type === "document" || type === "historyDocument") {
    if (item.storagePath) await supabaseClient.storage.from(STORAGE_BUCKET).remove([item.storagePath]);
    const { error } = await supabaseClient.from("documents").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "announcement") {
    const { error } = await supabaseClient.from("announcements").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "event") {
    const { error } = await supabaseClient.from("events").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "activity") {
    const { error } = await supabaseClient.from("activities").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "message") {
    const { error } = await supabaseClient.from("messages").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "billingSettlement") {
    if (item.storagePath) await supabaseClient.storage.from(STORAGE_BUCKET).remove([item.storagePath]);
    const { error } = await supabaseClient.from("billing_settlements").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "executionCase") {
    const { error } = await supabaseClient.from("execution_cases").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "vote") {
    const { error } = await supabaseClient.from("votes").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "photo") {
    if (item.storagePath) await supabaseClient.storage.from(STORAGE_BUCKET).remove([item.storagePath]);
    const { error } = await supabaseClient.from("photos").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "emailTemplate") {
    const { error } = await supabaseClient.from("email_templates").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "financeEntry") {
    const { error } = await supabaseClient.from("finance_entries").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "innovationIdea") {
    if (item.quoteStoragePath) await supabaseClient.storage.from(STORAGE_BUCKET).remove([item.quoteStoragePath]);
    const { error } = await supabaseClient.from("innovation_ideas").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }
  if (type === "boardMember") {
    const { error } = await supabaseClient.from("profiles").delete().eq("id", item.id).not("role", "in", "(chair,vice_chair,economic)");
    if (error) throw new Error(error.message);
    return;
  }
  throw new Error("Nepodporovaný typ položky.");
}

function deleteItemFromState(type, id) {
  const matches = (item) => String(item.id) !== String(id);
  if (type === "document") state.documents = state.documents.filter(matches);
  if (type === "historyDocument") state.documentHistory = state.documentHistory.filter(matches);
  if (type === "announcement") state.announcements = state.announcements.filter(matches);
  if (type === "event") state.events = state.events.filter(matches);
  if (type === "activity") state.activities = state.activities.filter(matches);
  if (type === "message") state.messages = state.messages.filter((item) => String(item.id) !== String(id) && String(item.parentId) !== String(id));
  if (type === "billingSettlement") state.billingSettlements = state.billingSettlements.filter(matches);
  if (type === "executionCase") state.executionCases = state.executionCases.filter(matches);
  if (type === "financeEntry") state.financeEntries = state.financeEntries.filter(matches);
  if (type === "innovationIdea") state.innovationIdeas = state.innovationIdeas.filter(matches);
  if (type === "vote") state.votes = state.votes.filter(matches);
  if (type === "photo") state.photos = state.photos.filter(matches);
  if (type === "emailTemplate") state.emailTemplates = state.emailTemplates.filter(matches);
  if (type === "boardMember") state.boardMembers = state.boardMembers.filter(matches);
}

async function saveProfile() {
  const profile = currentProfile();
  const firstName = document.querySelector("#profileFirstName")?.value.trim();
  const surname = document.querySelector("#profileSurname")?.value.trim();
  const flatValue = document.querySelector("#profileFlat")?.value.trim();
  const roleValue = document.querySelector("#profileRoleField")?.value.trim();
  const nextEmail = document.querySelector("#profileEmail")?.value.trim() || profile.email;
  const nextPhone = document.querySelector("#profilePhone")?.value.trim() || "";
  const correspondenceStreetValue = document.querySelector("#profileCorrespondenceStreet")?.value.trim() || "";
  const correspondenceCityValue = document.querySelector("#profileCorrespondenceCity")?.value.trim() || "";
  const correspondencePostalCodeValue = document.querySelector("#profileCorrespondencePostalCode")?.value.trim() || "";
  const previousEmail = state.authEmail || state.currentUserEmail || profile.email;
  const canEditIdentity = canManageAll() || profile.kind === "owner";
  const nextFullName = canEditIdentity ? [firstName, surname].filter(Boolean).join(" ") || profile.name : profile.name;
  const status = document.querySelector("#profileStatus");
  const personalPhotoFile = document.querySelector("#profilePersonalPhoto")?.files?.[0];
  const buildingPhotoFile = document.querySelector("#profileBuildingPhoto")?.files?.[0];
  const operationModeValue = document.querySelector("#operationModeText")?.value.trim() || state.operationModeText || "Live testovací režim";
  const gdprTextValue = document.querySelector("#gdprText")?.value.trim() || state.gdprText || defaultGdprText();
  const gdprVersionValue = document.querySelector("#gdprVersion")?.value.trim() || state.gdprVersion || "GDPR-SVB-2026-01";
  const gdprRequiredValue = document.querySelector("#gdprRequired")?.value || (state.gdprRequired ? "true" : "false");

  if (supabaseClient && state.currentUserId) {
    let emailMessage = "";
    let photoMessage = "";
    let personalPhotoPath = "";
    let modeMessage = "";
    let gdprMessage = "";
    if (personalPhotoFile) {
      try {
        personalPhotoPath = await saveProfilePhoto(personalPhotoFile);
        photoMessage = " Profilová fotka bola aktualizovaná.";
      } catch (error) {
        if (status) status.textContent = `Profilovú fotku sa nepodarilo uložiť: ${error.message}`;
        return;
      }
    }
    if (canManageAll() && buildingPhotoFile) {
      try {
        await saveBuildingPhoto(buildingPhotoFile);
        photoMessage += " Fotka domu bola aktualizovaná.";
      } catch (error) {
        if (status) status.textContent = `Fotku domu sa nepodarilo uložiť: ${error.message}`;
        return;
      }
    }
    if (canManageAll() && operationModeValue !== state.operationModeText) {
      try {
        await saveOperationMode(operationModeValue);
        modeMessage = " Prevádzkový režim bol aktualizovaný.";
      } catch (error) {
        if (status) status.textContent = `Prevádzkový režim sa nepodarilo uložiť: ${error.message}`;
        return;
      }
    }
    if (["chair", "vice_chair"].includes(state.role) && (gdprTextValue !== state.gdprText || gdprVersionValue !== state.gdprVersion || (gdprRequiredValue === "true") !== state.gdprRequired)) {
      try {
        await saveGdprSettings(gdprTextValue, gdprVersionValue, gdprRequiredValue === "true");
        gdprMessage = " GDPR nastavenia boli aktualizované.";
      } catch (error) {
        if (status) status.textContent = `GDPR nastavenia sa nepodarilo uložiť: ${error.message}`;
        return;
      }
    }
    if (nextEmail !== previousEmail) {
      if (canManageAll()) {
        const { data: loginEmailData, error: loginEmailError } = await supabaseClient.functions.invoke("update-login-email", {
          body: { email: nextEmail }
        });
        if (loginEmailError || loginEmailData?.error) {
          if (status) status.textContent = `Zmena login emailu zlyhala: ${loginEmailData?.error || loginEmailError.message}`;
          return;
        }
        state.authEmail = loginEmailData.email || nextEmail;
        state.currentUserEmail = state.authEmail;
        loginEmail.value = state.authEmail;
        emailMessage = " Nový email je už nastavený ako login email administrátorskej role.";
      } else {
        const { error: authError } = await supabaseClient.auth.updateUser({ email: nextEmail }, { emailRedirectTo: authRedirectUrl() });
        if (authError) {
          if (status) status.textContent = `Zmena login emailu zlyhala: ${authError.message}`;
          return;
        }
        emailMessage = " Potvrdzovací email na zmenu login emailu bol odoslaný zo Supabase.";
      }
    }

    const profileUpdate = {
      full_name: nextFullName,
      email: nextEmail,
      phone: nextPhone,
      flat_number: flatValue || profile.flat,
      correspondence_street: correspondenceStreetValue || null,
      correspondence_city: correspondenceCityValue || null,
      correspondence_postal_code: correspondencePostalCodeValue || null,
      role: canManageAll() ? roleFieldToAppRole(roleValue, state.role) : state.role
    };
    if (personalPhotoPath) profileUpdate.profile_photo_path = personalPhotoPath;
    const { error: profileError } = await supabaseClient.from("profiles").update(profileUpdate).eq("id", state.currentUserId);
    if (profileError) {
      if (status) status.textContent = `Profil sa nepodarilo uložiť: ${profileError.message}`;
      return;
    }

    if (profile.kind === "owner") {
      const { error: ownerRecordError } = await supabaseClient.from("owner_records").update({
        full_name: nextFullName,
        flat_number: flatValue || profile.flat,
        login_email: nextEmail,
        phone: nextPhone,
        correspondence_street: correspondenceStreetValue || null,
        correspondence_city: correspondenceCityValue || null,
        correspondence_postal_code: correspondencePostalCodeValue || null,
        updated_at: new Date().toISOString()
      }).eq("profile_id", state.currentUserId);
      if (ownerRecordError) {
        if (status) status.textContent = `Údaje vlastníka sa nepodarilo uložiť: ${ownerRecordError.message}`;
        return;
      }
    }

    await writeActivityLog("profile", "Úprava profilu používateľa", {
      relatedTable: "profiles",
      relatedId: state.currentUserId,
      metadata: { emailChanged: nextEmail !== previousEmail, phoneChanged: nextPhone !== profile.phone, role: canManageAll() ? roleFieldToAppRole(roleValue, state.role) : state.role }
    });
    await loadSupabaseData();
    render();
    const nextStatus = document.querySelector("#profileStatus");
    if (nextStatus) nextStatus.textContent = `Profil bol uložený.${emailMessage}${photoMessage}${modeMessage}${gdprMessage}`;
    return;
  }

  if (profile.kind === "owner" && profile.source) {
    profile.source.name = nextFullName;
    profile.source.flat = flatValue || profile.source.flat;
    profile.source.email = nextEmail;
    profile.source.loginEmail = nextEmail;
    profile.source.phone = nextPhone;
    profile.source.correspondenceStreet = correspondenceStreetValue;
    profile.source.correspondenceCity = correspondenceCityValue;
    profile.source.correspondencePostalCode = correspondencePostalCodeValue;
    if (personalPhotoFile) profile.source.photoUrl = URL.createObjectURL(personalPhotoFile);
  }

  if (profile.kind === "board" && profile.source) {
    if (canManageAll()) {
      profile.source.name = [firstName, surname].filter(Boolean).join(" ") || profile.source.name;
      profile.source.flat = flatValue || profile.source.flat || "Nie je viazané na byt";
    profile.source.role = roleValue || profile.source.role;
    }
    profile.source.email = nextEmail;
    profile.source.phone = nextPhone;
    if (personalPhotoFile) profile.source.photoUrl = URL.createObjectURL(personalPhotoFile);
  }

  if (state.passwords[previousEmail] !== undefined && previousEmail !== nextEmail) {
    state.passwords[nextEmail] = state.passwords[previousEmail];
    delete state.passwords[previousEmail];
  }

  state.currentUserEmail = nextEmail;
  loginEmail.value = nextEmail;
  if (canManageAll() && buildingPhotoFile) {
    state.buildingPhotoUrl = URL.createObjectURL(buildingPhotoFile);
  }
  if (canManageAll()) {
    state.operationModeText = operationModeValue;
    syncAppChrome();
  }
  if (["chair", "vice_chair"].includes(state.role)) {
    state.gdprText = gdprTextValue;
    state.gdprVersion = gdprVersionValue;
    state.gdprRequired = gdprRequiredValue === "true";
    syncAppChrome();
  }
  if (personalPhotoFile) syncProfileChrome();
  if (status) status.textContent = "Profil bol uložený.";
}

async function saveProfilePhoto(file) {
  if (!file.type.startsWith("image/")) throw new Error("Vybraný súbor musí byť obrázok.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `profile-photos/${state.currentUserId || "user"}-${Date.now()}-${safeName}`;
  const upload = await supabaseClient.storage.from(PUBLIC_ASSETS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true
  });
  if (upload.error) throw new Error(upload.error.message);
  return path;
}

async function saveBuildingPhoto(file) {
  if (!file.type.startsWith("image/")) throw new Error("Vybraný súbor musí byť obrázok.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `building/login-${Date.now()}-${safeName}`;
  const upload = await supabaseClient.storage.from(PUBLIC_ASSETS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true
  });
  if (upload.error) throw new Error(upload.error.message);

  const { error } = await supabaseClient.from("app_settings").upsert({
    key: BUILDING_PHOTO_SETTING_KEY,
    value: path,
    updated_by: state.currentUserId,
    updated_at: new Date().toISOString()
  });
  if (error) throw new Error(error.message);

  state.buildingPhotoUrl = publicStorageUrl(path);
  syncAppChrome();
}

async function saveOperationMode(value) {
  const nextValue = value.trim() || "Live testovací režim";
  const { error } = await supabaseClient.from("app_settings").upsert({
    key: OPERATION_MODE_SETTING_KEY,
    value: nextValue,
    updated_by: state.currentUserId,
    updated_at: new Date().toISOString()
  });
  if (error) throw new Error(error.message);
  state.operationModeText = nextValue;
  syncAppChrome();
}

async function saveGdprSettings(text, version, required) {
  const entries = [
    { key: GDPR_TEXT_SETTING_KEY, value: text.trim() || defaultGdprText(), updated_by: state.currentUserId, updated_at: new Date().toISOString() },
    { key: GDPR_VERSION_SETTING_KEY, value: version.trim() || "GDPR-SVB-2026-01", updated_by: state.currentUserId, updated_at: new Date().toISOString() },
    { key: GDPR_REQUIRED_SETTING_KEY, value: required ? "true" : "false", updated_by: state.currentUserId, updated_at: new Date().toISOString() }
  ];
  const { error } = await supabaseClient.from("app_settings").upsert(entries);
  if (error) throw new Error(error.message);
  state.gdprText = entries[0].value;
  state.gdprVersion = entries[1].value;
  state.gdprRequired = required;
}

async function saveLiveChatSettings() {
  const status = document.querySelector("#liveChatStatus");
  if (!permissionFor(state.role, "settings").write) {
    if (status) status.textContent = "Nemáte oprávnenie upravovať nastavenia live chatu.";
    return;
  }
  const widgetCode = document.querySelector("#liveChatWidgetCode")?.value.trim() || "";
  const enabled = document.querySelector("#liveChatEnabled")?.value === "true";
  const scriptSrc = extractTawkScriptSrc(widgetCode);
  if (enabled && !scriptSrc) {
    if (status) status.textContent = "Widget kód musí obsahovať platnú adresu https://embed.tawk.to/...";
    return;
  }
  if (supabaseClient && state.currentUserId) {
    const { error } = await supabaseClient.from("app_settings").upsert([
      { key: LIVE_CHAT_WIDGET_SETTING_KEY, value: widgetCode, updated_by: state.currentUserId, updated_at: new Date().toISOString() },
      { key: LIVE_CHAT_ENABLED_SETTING_KEY, value: enabled ? "true" : "false", updated_by: state.currentUserId, updated_at: new Date().toISOString() }
    ]);
    if (error) {
      if (status) status.textContent = `Live chat sa nepodarilo uložiť: ${error.message}`;
      return;
    }
    await writeActivityLog("settings", "Úprava live chat integrácie", {
      relatedTable: "app_settings",
      relatedId: LIVE_CHAT_WIDGET_SETTING_KEY,
      metadata: { enabled, scriptSrc }
    });
  }
  state.liveChatWidgetCode = widgetCode;
  state.liveChatEnabled = enabled;
  syncAppChrome();
  if (status) status.textContent = enabled ? "Live chat bol uložený a zapnutý." : "Live chat bol uložený a vypnutý.";
}

async function saveProfilePassword() {
  const password = document.querySelector("#profilePassword")?.value || "";
  const repeat = document.querySelector("#profilePasswordRepeat")?.value || "";
  const status = document.querySelector("#profileStatus");
  if (password !== repeat) {
    if (status) status.textContent = "Heslá sa nezhodujú.";
    return;
  }
  state.passwords[state.currentUserEmail] = password;
  if (supabaseClient && state.currentUserId && password) {
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) {
      if (status) status.textContent = `Heslo sa nepodarilo zmeniť: ${error.message}`;
      return;
    }
    await writeActivityLog("profile", "Zmena hesla používateľa", {
      relatedTable: "profiles",
      relatedId: state.currentUserId,
      metadata: { passwordChanged: true }
    });
  }
  loginPassword.value = password;
  if (status) status.textContent = password ? "Heslo bolo zmenené." : "Heslo bolo nastavené ako prázdne.";
}

async function saveRolePermissions() {
  const status = document.querySelector("#permissionsStatus");
  if (!permissionFor(state.role, "settings").write) {
    if (status) status.textContent = "Nemáte oprávnenie upravovať nastavenia prístupov.";
    return;
  }
  const next = defaultRolePermissions();
  ROLE_DEFINITIONS.forEach(([role]) => {
    PERMISSION_VIEWS.forEach((view) => {
      next[role][view] = {
        read: Boolean(document.querySelector(`[data-permission][data-role="${role}"][data-view="${view}"][data-action="read"]`)?.checked),
        write: Boolean(document.querySelector(`[data-permission][data-role="${role}"][data-view="${view}"][data-action="write"]`)?.checked),
        delete: Boolean(document.querySelector(`[data-permission][data-role="${role}"][data-view="${view}"][data-action="delete"]`)?.checked)
      };
      if (next[role][view].write || next[role][view].delete) next[role][view].read = true;
    });
  });
  const normalized = normalizeRolePermissions(next);
  const nextCommunication = defaultCommunicationPermissions();
  ROLE_DEFINITIONS.forEach(([role]) => {
    Object.keys(COMMUNICATION_PERMISSION_LABELS).forEach((action) => {
      nextCommunication[role][action] = Boolean(document.querySelector(`[data-communication-permission][data-role="${role}"][data-action="${action}"]`)?.checked);
    });
  });
  const normalizedCommunication = normalizeCommunicationPermissions(nextCommunication);

  if (supabaseClient && state.currentUserId) {
    const { error } = await supabaseClient.from("app_settings").upsert([
      {
        key: ROLE_PERMISSIONS_SETTING_KEY,
        value: JSON.stringify(normalized),
        updated_at: new Date().toISOString()
      },
      {
        key: COMMUNICATION_PERMISSIONS_SETTING_KEY,
        value: JSON.stringify(normalizedCommunication),
        updated_at: new Date().toISOString()
      }
    ]);
    if (error) {
      if (status) status.textContent = `Prístupy sa nepodarilo uložiť: ${error.message}`;
      return;
    }
    await writeActivityLog("settings", "Úprava prístupov podľa rolí", {
      relatedTable: "app_settings",
      relatedId: ROLE_PERMISSIONS_SETTING_KEY,
      metadata: { roles: ROLE_DEFINITIONS.map(([role]) => role) }
    });
  }

  state.rolePermissions = normalized;
  state.communicationPermissions = normalizedCommunication;
  if (status) status.textContent = "Prístupy podľa rolí boli uložené.";
  if (!canAccessView(state.view)) {
    state.view = firstAccessibleView();
    render();
    return;
  }
  syncNavigation();
}

function findEditable(type, id) {
  if (type === "activityLog") return state.activityLogs.find((item) => String(item.id) === String(id));
  if (type === "announcement") return state.announcements.find((item) => String(item.id) === String(id));
  if (type === "document") return state.documents.find((item) => String(item.id) === String(id));
  if (type === "activity") return state.activities.find((item) => String(item.id) === String(id));
  if (type === "boardMember") return state.boardMembers.find((item) => String(item.id) === String(id));
  if (type === "vote") return state.votes.find((item) => String(item.id) === String(id));
  if (type === "owner") return state.owners.find((item) => String(item.id) === String(id));
  if (type === "event") return state.events.find((item) => String(item.id) === String(id));
  if (type === "historyDocument") return state.documentHistory.find((item) => String(item.id) === String(id));
  if (type === "message") return state.messages.find((item) => String(item.id) === String(id));
  if (type === "billingSettlement") return state.billingSettlements.find((item) => String(item.id) === String(id));
  if (type === "executionCase") return state.executionCases.find((item) => String(item.id) === String(id));
  if (type === "innovationIdea") return state.innovationIdeas.find((item) => String(item.id) === String(id));
  return null;
}

function editTitle(type, item) {
  if (type === "owner") return item.name;
  if (type === "boardMember") return item.name;
  if (type === "executionCase") return item.title || `${item.ownerName} · ${item.flat}`;
  return item.title;
}

function formFor(type, defaults = {}) {
  if (type === "documents") {
    return fieldsWithValues([
      ["title", "Názov dokumentu", "Pozvánka na schôdzu"],
      ["category", "Typ dokumentu", documentTypeOptions()[0] || "Iné dokumenty", "select", documentTypeOptions()],
      ["documentDate", "Dátum uverejnenia", new Date().toISOString().slice(0, 10), "date"],
      ["youtubeUrl", "YouTube video link", ""],
      ["note", "Poznámka", "Dokument sa v ostrej verzii nahrá ako PDF alebo obrázok.", "textarea"]
    ]) + uploadField("Súbor dokumentu") + notificationFields("all");
  }
  if (type === "documentHistory") {
    return fieldsWithValues([
      ["title", "Názov dokumentu", "Zápisnica zo schôdze"],
      ["category", "Kategória", documentTypeOptions()[0] || "Iné dokumenty", "select", documentTypeOptions()],
      ["documentDate", "Dátum uverejnenia", new Date().toISOString().slice(0, 10), "date"],
      ["youtubeUrl", "YouTube video link", ""],
      ["note", "Poznámka", "Stručný popis dokumentu alebo jeho významu pre dom.", "textarea"]
    ]) + uploadField("Súbor do histórie") + notificationFields("all");
  }
  if (type === "billing") {
    return fieldsWithValues([
      ["title", "Názov vyúčtovania", `Vyúčtovanie ${new Date().getFullYear()}`],
      ["category", "Vlastník nehnuteľnosti", "", "select", billingOwnerOptions()],
      ["settlementYear", "Rok vyúčtovania", String(new Date().getFullYear() - 1)],
      ["note", "Poznámka", "Ročné vyúčtovanie nákladov pre konkrétneho vlastníka nehnuteľnosti.", "textarea"]
    ]) + uploadField("Súbor vyúčtovania") + notificationFields("individual");
  }
  if (type === "executions") {
    return fieldsWithValues([
      ["title", "Názov prípadu", "Vymáhanie nedoplatku"],
      ["category", "Vlastník nehnuteľnosti", "", "select", executionOwnerOptions()],
      ["amount", "Aktuálna výška dlhu v EUR", "0"],
      ["ownedFrom", "Dlh evidovaný od", new Date().toISOString().slice(0, 10)],
      ["status", "Stav prípadu", "Evidovaný dlh", "select", ["Evidovaný dlh", "Predžalobná výzva", "Súdne konanie", "Právoplatné rozhodnutie", "Návrh na exekúciu", "Exekúcia prebieha", "Splátkový kalendár", "Uhradené", "Pozastavené", "Ukončené"]],
      ["executionTitleStatus", "Stav exekučného titulu", "Neposúdené", "select", ["Neposúdené", "Podklady sa pripravujú", "Predžalobná výzva odoslaná", "Žaloba podaná", "Rozhodnutie nadobudlo právoplatnosť", "Rozhodnutie je vykonateľné", "Návrh na vykonanie exekúcie podaný", "Exekúcia začatá", "Nevhodné na exekúciu"]],
      ["nextStepDate", "Termín ďalšieho kroku", ""],
      ["legalStatus", "Aktuálny právny stav", "Popíšte aktuálny právny stav, napr. výzva, dohoda, súdne konanie, právoplatné rozhodnutie.", "textarea"],
      ["note", "História vzniku dlhu a poznámky", "Uveďte obdobia, z ktorých dlh vznikol, výzvy, úhrady, splátky a dôležité dátumy.", "textarea"]
    ]) + notificationFields("individual");
  }
  if (type === "finance") {
    const kindOptions = canManageAll()
      ? [["idea", "Podnet / inovácia"], ["balance", "Stav bankového účtu"], ["planned_renovation", "Plánovaná renovácia"], ["other_expense", "Iný výdavok"]]
      : [["idea", "Podnet / inovácia"]];
    return fieldsWithValues([
      ["financeKind", "Typ záznamu", "idea", "select", kindOptions],
      ["title", "Názov", "Nový podnet alebo finančná položka"],
      ["financeYear", "Rok", String(new Date().getFullYear())],
      ["amount", "Suma / odhadovaná cena v EUR", "0"],
      ["note", "Popis", "Popíšte podnet, plánovaný výdavok alebo stav účtu.", "textarea"]
    ]) + uploadField("Cenová ponuka k podnetu alebo príloha");
  }
  if (type === "votes") {
    return `
      <article class="notice">
        <strong>Informačné upozornenie</strong>
        <p>Toto hlasovanie predstavuje elektronické hlasovanie v aplikácii e-housing. Platné hlasovanie bude zaznamenané až počas domovej schôdze po úplnom odhlasovaní všetkých vlastníkov bytov prítomných na schôdzi.</p>
      </article>
    ` + fieldsWithValues([
      ["title", "Názov hlasovania", "Hlasovanie o opravách domu"],
      ["category", "Typ hlasovania podľa zákonného kvóra", "present_majority", "select", voteTypeOptions()],
      ["voteDeadline", "Hlasovať do", new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)],
      ["note", "Doplňujúci text k hlasovaniu", "Stručný popis návrhu, podklady alebo právny rámec.", "textarea"],
      ["voteQuestions", "Hlasovacie otázky", "Súhlasíte s realizáciou navrhovanej opravy?\nSúhlasíte s použitím prostriedkov z fondu opráv?", "textarea"]
    ]) + notificationFields("all");
  }
  if (type === "messages") {
    const recipientOptions = messageRecipientOptions();
    return fieldsWithValues([
      ["title", "Predmet", "Nová správa"],
      ["category", "Komu", recipientOptions[0] || "", "select", recipientOptions],
      ["note", "Správa", "Napíšte správu.", "textarea"]
    ]) + notificationFields("individual");
  }
  if (type === "photoAlbum") {
    return fieldsWithValues([
      ["title", "Názov fotky", "Fotodokumentácia domu"],
      ["category", "Kategória", "Spoločné priestory", "select", ["Exteriér", "Spoločné priestory", "Opravy", "Revízie", "Oznamy", "Iné"]],
      ["note", "Popis", "Stručný popis fotky.", "textarea"]
    ]) + uploadField("Fotka alebo obrázok") + notificationFields("all");
  }
  if (type === "owners") {
    return fieldsWithValues([
      ["title", "Meno vlastníka", "Nový vlastník"],
      ["category", "Byt", "A-02"],
      ["ownerLoginEmail", "Login email", "vlastnik@example.com"],
      ["accountStatus", "Stav účtu", "Registračný email odoslaný", "select", ["Aktívny", "Neaktívny", "Čaká na autorizáciu", "Pozvánka odoslaná", "Pozastavený", "Zamietnutý", "Registračný email odoslaný"]],
      ["approvalStatus", "Autorizácia", "approved", "select", ["approved", "pending", "rejected", "disabled"]],
      ["ownedFrom", "Vlastník od", new Date().toISOString().slice(0, 10)],
      ["debtAmount", "Výška dlhu v EUR", "0"],
      ["isDebtor", "Dlžník", "nie", "select", ["nie", "áno"]],
      ["note", "Poznámka", "Poznámka k vlastníkovi", "textarea"]
    ]) + notificationFields("individual");
  }
  if (type === "calendar") {
    const selectedDate = defaults.calendarDate || `${state.calendarMonth}-${String(new Date().getDate()).padStart(2, "0")}`;
    return fieldsWithValues([
      ["title", "Názov udalosti", "Schôdza vlastníkov"],
      ["category", "Dátum udalosti", selectedDate, "date"],
      ["note", "Poznámka pre email", "Vlastníkom sa odošle informačný email.", "textarea"]
    ]) + uploadField("Príloha k udalosti") + notificationFields("all");
  }
  if (type === "activities") {
    return fieldsWithValues([
      ["title", "Názov aktivity", "Kontrola dokumentov"],
      ["person", "Meno", diaryPersonName()],
      ["roleField", "Rola", diaryRoleLabel(), "select", ["Predseda SVB", "Podpredseda SVB", "Ekonomická správa", "Člen dozornej rady"]],
      ["month", "Mesiac", new Date().toISOString().slice(0, 7)],
      ["hours", "Počet hodín", "1"],
      ["status", "Stav", "Dokončené", "select", ["Návrh", "Prebieha", "Dokončené", "Archivované"]],
      ["note", "Popis práce", "Stručný popis vykonanej aktivity.", "textarea"]
    ]) + notificationFields("none");
  }
  if (type === "emails") {
    return fields([
      ["title", "Názov šablóny", "Nová emailová šablóna"],
      ["category", "Predmet", "Nová správa zo SVB"],
      ["note", "Text emailu", "Dobrý deň, v aplikácii e-housing pribudla nová informácia.", "textarea"]
    ]);
  }
  return fieldsWithValues([
    ["title", "Názov", "Nové oznámenie"],
    ["category", "Kategória", "Prevádzka", "select", ["Prevádzka", "Údržba", "Schôdza", "Hlasovanie", "Oznam"]],
    ["youtubeUrl", "YouTube video link", ""],
    ["note", "Text", "Text oznámenia pre vlastníkov.", "textarea"]
  ]) + uploadField("Príloha k oznámeniu") + notificationFields("all");
}

function notificationFields(defaultTarget = "none", defaultOwnerId = "") {
  if (!canSendEmailNotifications()) return "";
  return `
    <article class="notice">
      <strong>Emailová notifikácia</strong>
      <p>Vyberte, či sa má po uložení odoslať email všetkým vlastníkom bytov alebo iba konkrétnemu vlastníkovi.</p>
      ${fieldsWithValues([
        ["notifyTarget", "Odoslať email", defaultTarget, "select", [
          ["none", "Neodoslať email"],
          ["all", "Všetkým vlastníkom bytov"],
          ["individual", "Konkrétnemu vlastníkovi bytu"]
        ]],
        ["notifyOwner", "Konkrétny vlastník", defaultOwnerId, "select", ownerNotificationOptions()]
      ])}
    </article>
  `;
}

function ownerNotificationOptions() {
  const owners = state.owners.filter((ownerItem) => ownerItem.loginEmail || ownerItem.email);
  return [["", "Vyberte vlastníka"], ...owners.map((ownerItem) => [ownerItem.profileId || ownerItem.id, `${ownerItem.name} · ${ownerItem.flat}`])];
}

function billingOwnerOptions() {
  const owners = state.owners.filter((ownerItem) => ownerItem.profileId && ownerItem.approvalStatus === "approved");
  return [["", "Vyberte registrovaného vlastníka"], ...owners.map((ownerItem) => [ownerItem.profileId, `${ownerItem.name} · ${ownerItem.flat}`])];
}

function executionOwnerOptions() {
  const owners = state.owners.filter((ownerItem) => ownerItem.id || ownerItem.profileId);
  return [["", "Vyberte vlastníka nehnuteľnosti"], ...owners.map((ownerItem) => [ownerItem.id || ownerItem.profileId, `${ownerItem.name} · ${ownerItem.flat}`])];
}

function fields(items) {
  return items.map(([id, label, placeholder, kind]) => `
    <div class="field">
      <label for="${id}">${label}</label>
      ${kind === "textarea" ? `<textarea id="${id}" placeholder="${placeholder}"></textarea>` : `<input id="${id}" placeholder="${placeholder}">`}
    </div>
  `).join("");
}

function uploadField(label) {
  return `
    <div class="field">
      <label for="uploadFile">${label}</label>
      <input id="uploadFile" type="file" multiple>
      <p class="upload-note">Súbor sa po uložení nahrá do Supabase Storage bucketu e-housing-files.</p>
    </div>
  `;
}

function editFormFor(type, item) {
  if (type === "owner") {
    return fieldsWithValues([
      ["title", "Meno vlastníka", item.name],
      ["category", "Byt", item.flat],
      ["ownerLoginEmail", "Login email", item.loginEmail || item.email],
      ["phone", "Telefón", item.phone || "", "tel"],
      ["correspondenceStreet", "Korešpondenčná ulica", item.correspondenceStreet || ""],
      ["correspondenceCity", "Korešpondenčné mesto", item.correspondenceCity || ""],
      ["correspondencePostalCode", "Korešpondenčné PSČ", item.correspondencePostalCode || ""],
      ["accountStatus", "Stav účtu", item.accountStatus || item.status, "select", ["Aktívny", "Neaktívny", "Čaká na autorizáciu", "Pozvánka odoslaná", "Pozastavený", "Zamietnutý"]],
      ["approvalStatus", "Autorizácia", item.approvalStatus || "pending", "select", ["approved", "pending", "rejected", "disabled"]],
      ["ownedFrom", "Vlastník od", item.ownedFrom || new Date().toISOString().slice(0, 10)],
      ["debtAmount", "Výška dlhu v EUR", String(item.debtAmount || 0)],
      ["isDebtor", "Dlžník", item.isDebtor ? "áno" : "nie", "select", ["nie", "áno"]],
      ["note", "Poznámka", item.note || "", "textarea"]
    ]) + `<article class="notice"><strong>Zmena hesla</strong><p>Heslo sa nemení ručne v administrácii. Vlastníkovi odošlite bezpečný email s odkazom na nastavenie nového hesla.</p><button class="ghost" type="button" data-reset-owner-password="${item.id}">${icon("key-round")}<span>Odoslať reset hesla</span></button></article>`;
  }
  if (type === "executionCase") {
    return fieldsWithValues([
      ["title", "Názov prípadu", item.title || "Vymáhanie nedoplatku"],
      ["category", "Vlastník nehnuteľnosti", item.ownerRecordId || item.ownerProfileId || "", "select", executionOwnerOptions()],
      ["amount", "Aktuálna výška dlhu v EUR", String(item.debtAmount || 0)],
      ["ownedFrom", "Dlh evidovaný od", item.debtSince || new Date().toISOString().slice(0, 10)],
      ["status", "Stav prípadu", item.status || "Evidovaný dlh", "select", ["Evidovaný dlh", "Predžalobná výzva", "Súdne konanie", "Právoplatné rozhodnutie", "Návrh na exekúciu", "Exekúcia prebieha", "Splátkový kalendár", "Uhradené", "Pozastavené", "Ukončené"]],
      ["executionTitleStatus", "Stav exekučného titulu", item.executionTitleStatus || "Neposúdené", "select", ["Neposúdené", "Podklady sa pripravujú", "Predžalobná výzva odoslaná", "Žaloba podaná", "Rozhodnutie nadobudlo právoplatnosť", "Rozhodnutie je vykonateľné", "Návrh na vykonanie exekúcie podaný", "Exekúcia začatá", "Nevhodné na exekúciu"]],
      ["nextStepDate", "Termín ďalšieho kroku", item.nextStepDate || ""],
      ["legalStatus", "Aktuálny právny stav", item.legalStatus || "", "textarea"],
      ["note", "História vzniku dlhu a poznámky", item.debtHistory || item.note || "", "textarea"]
    ]);
  }
  if (type === "event") {
    return fieldsWithValues([
      ["title", "Názov udalosti", item.title],
      ["category", "Dátum udalosti", eventDateKey(item), "date"],
      ["note", "Poznámka", item.note || "Pri uložení bude pripravený email pre vlastníkov.", "textarea"]
    ]);
  }
  if (type === "activity") {
    return fieldsWithValues([
      ["title", "Názov aktivity", item.title],
      ["person", "Meno", item.person],
      ["roleField", "Rola", item.role, "select", ["Predseda SVB", "Podpredseda SVB", "Ekonomická správa", "Člen dozornej rady"]],
      ["month", "Mesiac", item.month],
      ["hours", "Počet hodín", String(item.hours)],
      ["status", "Stav", item.status, "select", ["Návrh", "Prebieha", "Dokončené", "Archivované"]],
      ["note", "Popis práce", item.note, "textarea"]
    ]);
  }
  if (type === "boardMember") {
    return fieldsWithValues([
      ["title", "Meno", item.name],
      ["roleField", "Funkcia", item.role, "select", ["Predseda SVB", "Podpredseda SVB", "Ekonomická správa", "Člen dozornej rady"]],
      ["email", "Email", item.email],
      ["phone", "Telefón", item.phone],
      ["note", "Poznámka", item.note, "textarea"]
    ]);
  }
  if (type === "vote") {
    return fieldsWithValues([
      ["title", "Názov hlasovania", item.title],
      ["category", "Typ hlasovania podľa zákonného kvóra", item.type || "present_majority", "select", voteTypeOptions()],
      ["voteDeadline", "Hlasovať do", item.closes ? String(item.closes).slice(0, 10) : new Date().toISOString().slice(0, 10), "date"],
      ["status", "Stav hlasovania", item.status || "Prebieha", "select", ["Návrh", "Prebieha", "Ukončené", "Zrušené", "Archivované"]],
      ["note", "Doplňujúci text", item.description || "Predseda môže upraviť text návrhu a termín.", "textarea"]
    ]);
  }
  if (type === "message") {
    return fieldsWithValues([
      ["title", "Predmet", item.subject],
      ["note", "Správa", item.text, "textarea"]
    ]);
  }
  if (type === "innovationIdea") {
    return fieldsWithValues([
      ["title", "Názov podnetu", item.title],
      ["status", "Stav podnetu", item.status || "Nový podnet", "select", ["Nový podnet", "V posúdení", "Cenová ponuka vyžiadaná", "Pripravené na hlasovanie", "Schválené", "Zamietnuté", "Realizované"]],
      ["financeYear", "Rok", String(item.year || new Date().getFullYear())],
      ["amount", "Odhadovaná cena v EUR", String(item.estimatedCost || 0)],
      ["note", "Popis", item.description || "", "textarea"]
    ]) + uploadField("Cenová ponuka k podnetu");
  }
  if (type === "document") {
    return fieldsWithValues([
      ["title", "Názov dokumentu", item.title],
      ["category", "Typ dokumentu", item.type, "select", documentTypeOptions()],
      ["documentDate", "Dátum uverejnenia", documentDateForSave(item.date), "date"],
      ["urgent", "Stav emailu", item.urgent ? "Email odoslaný" : "Email pripravený", "select", ["Email pripravený", "Email odoslaný", "Bez emailu"]],
      ["youtubeUrl", "YouTube video link", item.youtubeUrl || ""],
      ["note", "Popis", item.visibility, "textarea"]
    ]) + uploadField("Nahradiť alebo doplniť súbor");
  }
  if (type === "historyDocument") {
    return fieldsWithValues([
      ["title", "Názov dokumentu", item.title],
      ["category", "Kategória", item.category, "select", documentTypeOptions()],
      ["documentDate", "Dátum uverejnenia", documentDateForSave(item.date), "date"],
      ["youtubeUrl", "YouTube video link", item.youtubeUrl || ""],
      ["note", "Poznámka", item.note, "textarea"]
    ]) + uploadField("Doplniť prílohu do histórie");
  }
  return fieldsWithValues([
    ["title", "Názov", item.title],
    ["category", "Kategória", item.category, "select", ["Prevádzka", "Údržba", "Schôdza", "Hlasovanie", "Oznam"]],
    ["youtubeUrl", "YouTube video link", item.youtubeUrl || ""],
    ["note", "Text", item.body, "textarea"]
  ]) + uploadField("Nahradiť alebo doplniť prílohu k oznámeniu");
}

function fieldsWithValues(items) {
  return items.map(([id, label, value, kind, options]) => `
    <div class="field">
      <label for="${id}">${label}</label>
      ${fieldControl(id, value, kind, options)}
    </div>
  `).join("");
}

function fieldControl(id, value, kind, options = []) {
  if (kind === "textarea") return `<textarea id="${id}">${value}</textarea>`;
  if (kind === "select") {
    return `<select id="${id}">${options.map((option) => {
      const optionValue = Array.isArray(option) ? option[0] : option;
      const optionLabel = Array.isArray(option) ? option[1] : option;
      return `<option value="${escapeAttr(optionValue)}" ${String(optionValue) === String(value) ? "selected" : ""}>${escapeHtml(String(optionLabel))}</option>`;
    }).join("")}</select>`;
  }
  if (["date", "month", "number", "email", "tel", "password"].includes(kind)) return `<input id="${id}" type="${kind}" value="${escapeAttr(value)}">`;
  return `<input id="${id}" value="${escapeAttr(value)}">`;
}

function parseVoteQuestions(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function cancelVote(voteId) {
  if (!canEditItem("vote")) return;
  const vote = state.votes.find((item) => String(item.id) === String(voteId));
  if (!vote || isVoteCancelled(vote)) return;
  if (!window.confirm(`Naozaj chcete zrušiť hlasovanie "${vote.title}"?`)) return;

  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from("votes")
        .update({ status: "cancelled" })
        .eq("id", vote.id);
      if (error) throw new Error(error.message);
      await writeActivityLog("update", `Zrušenie hlasovania: ${vote.title}`, {
        relatedTable: "votes",
        relatedId: vote.id,
        metadata: { status: "cancelled" }
      });
      await loadSupabaseData();
    } catch (error) {
      window.alert(`Hlasovanie sa nepodarilo zrušiť: ${error.message}`);
      return;
    }
  } else {
    vote.status = "cancelled";
  }

  render();
}

async function saveVoteAnswer(voteId, commentOnly = false) {
  if (commentOnly && !communicationPermissionFor(state.role, "voteComments")) {
    window.alert("Nemáte oprávnenie vyjadrovať sa k hlasovaniam.");
    return;
  }
  const vote = state.votes.find((item) => String(item.id) === String(voteId));
  if (!vote) return;
  if (isVoteCancelled(vote)) {
    window.alert("Toto hlasovanie bolo zrušené.");
    return;
  }
  if (!commentOnly && isVoteClosed(vote)) {
    window.alert("Toto hlasovanie je uzavreté a hlas už nie je možné meniť.");
    return;
  }
  const comment = document.querySelector("#voteComment")?.value.trim() || null;
  if (commentOnly && !comment) {
    window.alert("Napíšte komentár k hlasovaniu.");
    return;
  }
  if (comment && !communicationPermissionFor(state.role, "voteComments")) {
    window.alert("Nemáte oprávnenie pridať komentár k hlasovaniu.");
    return;
  }
  const commentVisibility = document.querySelector("#voteCommentVisibility")?.value || "public";

  if (supabaseClient && state.currentUserId) {
    try {
      const answerControls = [...document.querySelectorAll("[data-vote-question-id]")];
      const questions = vote.questions?.length ? vote.questions : [];
      let payload = [];
      if (!commentOnly) {
        payload = answerControls.map((control, index) => ({
          id: control.dataset.voteQuestionId || questions[index]?.id,
          answer: control.value || "Za"
        })).filter((question) => question.id).map((question) => ({
          vote_id: voteId,
          question_id: question.id,
          profile_id: state.currentUserId,
          answer: question.answer,
          comment: null
        }));
        if (!payload.length) throw new Error("Hlasovanie nemá žiadne otázky.");
        const { error } = await supabaseClient.from("vote_answers").upsert(payload, { onConflict: "vote_id,question_id,profile_id" });
        if (error) throw new Error(error.message);
        await refreshVoteCounts(voteId);
      }
      if (comment) {
        const chairId = chairProfileId();
        await insertVoteComment({
          voteId,
          body: comment,
          visibility: commentVisibility,
          recipientId: commentVisibility === "private_chair" ? chairId : null
        });
      }
      await writeActivityLog(commentOnly ? "comment" : "vote", commentOnly ? `Komentár k hlasovaniu: ${vote.title}` : `Hlasovanie používateľa: ${vote.title}`, {
        relatedTable: "votes",
        relatedId: voteId,
        metadata: { commentOnly, answers: payload.map((item) => ({ questionId: item.question_id, answer: item.answer })), hasComment: Boolean(comment) }
      });
      await loadSupabaseData();
    } catch (error) {
      window.alert(`Hlasovanie sa nepodarilo uložiť: ${error.message}`);
      return;
    }
  } else {
    if (!commentOnly) {
      [...document.querySelectorAll("[data-vote-question-id]")].forEach((control, index) => {
        const question = vote.questions?.[index];
        if (question) {
          question.yes = (question.yes || 0) + (control.value === "Za" ? 1 : 0);
          question.no = (question.no || 0) + (control.value === "Proti" ? 1 : 0);
          question.abstain = (question.abstain || 0) + (control.value === "Zdržal sa" ? 1 : 0);
          question.myAnswer = control.value;
        }
        vote.yes += control.value === "Za" ? 1 : 0;
        vote.no += control.value === "Proti" ? 1 : 0;
        vote.abstain += control.value === "Zdržal sa" ? 1 : 0;
      });
    }
    if (comment) {
      vote.thread = vote.thread || [];
      vote.thread.push({ id: Date.now(), voteId, authorId: state.currentUserId, author: roleLabel(), visibility: commentVisibility, body: comment, date: new Date().toISOString() });
      vote.comments += 1;
    }
  }

  dialog.close();
  render();
}

function findVoteComment(id) {
  return state.voteComments.find((comment) => String(comment.id) === String(id))
    || state.votes.flatMap((vote) => vote.thread || []).find((comment) => String(comment.id) === String(id));
}

function privateVoteReplyRecipient(comment) {
  if (state.role === "chair") return comment.authorId === state.currentUserId ? comment.recipientId : comment.authorId;
  return chairProfileId();
}

async function insertVoteComment({ voteId, body, visibility = "public", parentId = null, recipientId = null }) {
  if (!body) throw new Error("Napíšte komentár k hlasovaniu.");
  const { data, error } = await supabaseClient.from("vote_comments").insert({
    vote_id: voteId,
    profile_id: state.currentUserId,
    recipient_id: visibility === "private_chair" ? recipientId : null,
    parent_id: parentId,
    visibility,
    body
  }).select("id").single();
  if (error) throw new Error(error.message);
  const shouldNotifyChair = visibility === "private_chair" && state.role !== "chair" && (!recipientId || recipientId === chairProfileId());
  if (shouldNotifyChair) {
    const vote = state.votes.find((item) => String(item.id) === String(voteId));
    await notifyChairAboutMessage({
      subject: vote ? `Komentár k hlasovaniu: ${vote.title}` : "Komentár k hlasovaniu",
      message: body,
      scope: parentId ? "Súkromná odpoveď predsedovi pri hlasovaní" : "Súkromný komentár predsedovi pri hlasovaní",
      recipient: "Predseda SVB",
      relatedTable: "vote_comments",
      relatedId: data?.id,
      view: "votes",
      detailType: "vote",
      detailId: voteId,
      eventType: parentId ? "Odpoveď k hlasovaniu pre predsedu SVB" : "Komentár k hlasovaniu pre predsedu SVB"
    });
  }
}

async function saveVoteComment(voteId, options) {
  if (!communicationPermissionFor(state.role, "voteComments")) {
    window.alert("Nemáte oprávnenie pridať komentár k hlasovaniu.");
    return;
  }
  const vote = state.votes.find((item) => String(item.id) === String(voteId));
  if (!vote || isVoteCancelled(vote)) return;
  try {
    if (supabaseClient && state.currentUserId) {
      await insertVoteComment({ ...options, voteId });
      await writeActivityLog("comment", `Odpoveď k hlasovaniu: ${vote.title}`, {
        relatedTable: "votes",
        relatedId: voteId,
        metadata: { parentId: options.parentId, visibility: options.visibility }
      });
      await loadSupabaseData();
    } else {
      vote.thread = vote.thread || [];
      vote.thread.push({ id: Date.now(), voteId, parentId: options.parentId, authorId: state.currentUserId, author: roleLabel(), visibility: options.visibility, body: options.body, date: new Date().toISOString() });
      vote.comments += 1;
    }
  } catch (error) {
    window.alert(`Komentár sa nepodarilo uložiť: ${error.message}`);
    return;
  }
  dialog.close();
  render();
}

async function updateVoteComment(id, body) {
  const comment = findVoteComment(id);
  if (!comment || !canEditVoteComment(comment)) return;
  if (!body) {
    window.alert("Komentár nemôže byť prázdny.");
    return;
  }
  try {
    if (supabaseClient && state.currentUserId) {
      const { error } = await supabaseClient.from("vote_comments").update({ body, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error(error.message);
      await writeActivityLog("update", "Úprava komentára k hlasovaniu", {
        relatedTable: "vote_comments",
        relatedId: id,
        metadata: { voteId: comment.voteId }
      });
      await loadSupabaseData();
    } else {
      comment.body = body;
      comment.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    window.alert(`Komentár sa nepodarilo upraviť: ${error.message}`);
    return;
  }
  dialog.close();
  render();
}

async function deleteVoteComment(id) {
  const comment = findVoteComment(id);
  if (!comment || !canDeleteVoteComment(comment)) return;
  const confirmed = window.confirm("Naozaj vymazať tento komentár aj jeho odpovede?");
  if (!confirmed) return;
  try {
    if (supabaseClient && state.currentUserId) {
      const { error } = await supabaseClient.from("vote_comments").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await writeActivityLog("delete", "Vymazanie komentára k hlasovaniu", {
        relatedTable: "vote_comments",
        relatedId: id,
        metadata: { voteId: comment.voteId }
      });
      await loadSupabaseData();
    } else {
      state.voteComments = state.voteComments.filter((item) => String(item.id) !== String(id) && String(item.parentId) !== String(id));
      state.votes.forEach((vote) => {
        vote.thread = (vote.thread || []).filter((item) => String(item.id) !== String(id) && String(item.parentId) !== String(id));
        vote.comments = vote.thread.length;
      });
    }
  } catch (error) {
    window.alert(`Komentár sa nepodarilo vymazať: ${error.message}`);
    return;
  }
  render();
}

function existingVoteAnswer() {
  return null;
}

async function refreshVoteCounts(voteId) {
  const { error } = await supabaseClient.rpc("recalculate_vote_counts", { target_vote_id: voteId });
  if (error) throw new Error(error.message);
}

async function saveDialog(type) {
  if (!canCreateInView(type)) return;
  const titleValue = document.querySelector("#title")?.value.trim() || "Nová položka";
  const categoryValue = document.querySelector("#category")?.value.trim() || "Prevádzka";
  const noteValue = document.querySelector("#note")?.value.trim() || "Bez doplňujúceho textu.";
  const loginEmailValue = document.querySelector("#ownerLoginEmail")?.value.trim();
  const accountStatusValue = document.querySelector("#accountStatus")?.value.trim();
  const approvalStatusValue = document.querySelector("#approvalStatus")?.value.trim();
  const correspondenceStreetValue = document.querySelector("#correspondenceStreet")?.value.trim();
  const correspondenceCityValue = document.querySelector("#correspondenceCity")?.value.trim();
  const correspondencePostalCodeValue = document.querySelector("#correspondencePostalCode")?.value.trim();
  const statusValue = document.querySelector("#status")?.value.trim();
  const legalStatusValue = document.querySelector("#legalStatus")?.value.trim();
  const executionTitleStatusValue = document.querySelector("#executionTitleStatus")?.value.trim();
  const nextStepDateValue = document.querySelector("#nextStepDate")?.value.trim();
  const personValue = document.querySelector("#person")?.value.trim();
  const roleFieldValue = document.querySelector("#roleField")?.value.trim();
  const monthValue = document.querySelector("#month")?.value.trim();
  const hoursValue = document.querySelector("#hours")?.value.trim();
  const financeKindValue = document.querySelector("#financeKind")?.value.trim();
  const financeYearValue = document.querySelector("#financeYear")?.value.trim();
  const amountValue = document.querySelector("#amount")?.value.trim();
  const settlementYearValue = document.querySelector("#settlementYear")?.value.trim();
  const documentDateValue = document.querySelector("#documentDate")?.value.trim();
  const youtubeUrlValue = document.querySelector("#youtubeUrl")?.value.trim();
  const ownedFromValue = document.querySelector("#ownedFrom")?.value.trim();
  const debtAmountValue = document.querySelector("#debtAmount")?.value.trim();
  const isDebtorValue = document.querySelector("#isDebtor")?.value.trim().toLowerCase();
  const voteDeadlineValue = document.querySelector("#voteDeadline")?.value.trim();
  const voteQuestionsValue = document.querySelector("#voteQuestions")?.value.trim();
  const notification = collectNotificationOptions();

  if (supabaseClient && state.currentUserId) {
    try {
      await saveDialogToSupabase(type, { titleValue, categoryValue, noteValue, loginEmailValue, accountStatusValue, approvalStatusValue, statusValue, legalStatusValue, executionTitleStatusValue, nextStepDateValue, personValue, roleFieldValue, monthValue, hoursValue, financeKindValue, financeYearValue, amountValue, settlementYearValue, documentDateValue, youtubeUrlValue, ownedFromValue, debtAmountValue, isDebtorValue, voteDeadlineValue, voteQuestionsValue, notification });
      await writeActivityLog("create", `Vytvorenie položky: ${titleValue}`, {
        relatedTable: type,
        metadata: {
          view: type,
          category: categoryValue,
          notificationTarget: notification.target || "none"
        }
      });
    } catch (error) {
      window.alert(`Uloženie zlyhalo: ${error.message}`);
      return;
    }
    dialog.close();
    await loadSupabaseData();
    render();
    return;
  }

  if (type === "documents") {
    const documentDate = documentDateValue || new Date().toISOString().slice(0, 10);
    const card = { id: Date.now(), title: titleValue, type: categoryValue, category: categoryValue, date: documentDate, author: roleLabel(), owner: roleLabel(), visibility: "Všetci vlastníci", note: noteValue, urgent: false, youtubeUrl: youtubeUrlValue || "" };
    if (isCurrentYearDocument(card)) state.documents.unshift(card);
    else state.documentHistory.unshift(documentToHistoryCard(card));
    state.documents.sort(sortByDocumentDateDesc);
    state.documentHistory.sort(sortByDocumentDateDesc);
  } else if (type === "documentHistory") {
    state.documentHistory.unshift({ id: Date.now(), title: titleValue, category: categoryValue, date: documentDateValue || new Date().toISOString().slice(0, 10), owner: roleLabel(), note: noteValue, youtubeUrl: youtubeUrlValue || "" });
    state.documentHistory.sort(sortByDocumentDateDesc);
  } else if (type === "billing") {
    const owner = state.owners.find((item) => item.profileId === categoryValue);
    state.billingSettlements.unshift({ id: Date.now(), title: titleValue, year: settlementYearValue || new Date().getFullYear(), ownerProfileId: owner?.profileId, ownerName: owner?.name || "Vlastník nehnuteľnosti", flat: owner?.flat || "", email: owner?.email || "", note: noteValue, date: new Date().toISOString() });
  } else if (type === "executions") {
    const owner = state.owners.find((item) => String(item.id) === String(categoryValue) || String(item.profileId) === String(categoryValue));
    state.executionCases.unshift({ id: Date.now(), title: titleValue, ownerRecordId: owner?.id, ownerProfileId: owner?.profileId, ownerName: owner?.name || "Vlastník nehnuteľnosti", flat: owner?.flat || "", email: owner?.email || owner?.loginEmail || "", debtAmount: Number.parseFloat(amountValue || "0"), debtSince: ownedFromValue || new Date().toISOString().slice(0, 10), status: statusValue || "Evidovaný dlh", executionTitleStatus: executionTitleStatusValue || "Neposúdené", legalStatus: legalStatusValue || "", debtHistory: noteValue, note: "", lastActionDate: new Date().toISOString(), nextStepDate: nextStepDateValue || "" });
  } else if (type === "finance") {
    if (financeKindValue === "idea" || !canManageAll()) {
      state.innovationIdeas.unshift({ id: Date.now(), title: titleValue, description: noteValue, status: "Nový podnet", estimatedCost: Number.parseFloat(amountValue || "0"), year: Number.parseInt(financeYearValue || `${new Date().getFullYear()}`, 10), author: roleLabel(), comments: [], createdAt: new Date().toISOString() });
    } else {
      state.financeEntries.unshift({ id: Date.now(), type: financeKindValue || "other_expense", title: titleValue, amount: Number.parseFloat(amountValue || "0"), year: Number.parseInt(financeYearValue || `${new Date().getFullYear()}`, 10), date: new Date().toISOString(), note: noteValue });
    }
  } else if (type === "votes") {
    state.votes.unshift({ id: Date.now(), title: titleValue, description: noteValue, type: categoryValue || "present_majority", closes: voteDeadlineValue || "2026-07-15", status: "Prebieha", yes: 0, no: 0, abstain: 0, comments: 0, questions: parseVoteQuestions(voteQuestionsValue || titleValue).map((text, index) => ({ id: `local-${Date.now()}-${index}`, text })) });
  } else if (type === "messages") {
    if (!canStartMessageTo(categoryValue)) {
      window.alert("Nemáte oprávnenie odoslať správu vybranému adresátovi.");
      return;
    }
    const isPublic = ["Verejná diskusia", "Všetci vlastníci"].includes(categoryValue);
    state.messages.unshift({ id: Date.now(), scope: isPublic ? "Verejná diskusia" : "Súkromná správa", scopeRaw: isPublic ? "public" : "private", senderId: state.currentUserId, recipientLabel: categoryValue, from: roleLabel(), to: categoryValue, subject: titleValue, text: noteValue, date: "Teraz", createdAt: new Date().toISOString(), read: false });
  } else if (type === "owners") {
    state.owners.push({
      flat: categoryValue,
      name: titleValue,
      email: loginEmailValue || "vlastnik@example.com",
      loginEmail: loginEmailValue || "vlastnik@example.com",
      accountStatus: accountStatusValue || "Registračný email odoslaný",
      approvalStatus: approvalStatusValue || "approved",
      ownedFrom: ownedFromValue || new Date().toISOString().slice(0, 10),
      isDebtor: isDebtorValue ? isDebtorValue === "áno" : Number.parseFloat(debtAmountValue || "0") > 0,
      debtAmount: Number.parseFloat(debtAmountValue || "0"),
      status: accountStatusValue || "Registračný email odoslaný",
      note: noteValue
    });
    state.notificationLog.unshift({ time: "Teraz", type: "Registrácia", subject: titleValue, status: `Automatický email odoslaný na ${loginEmailValue || "vlastnik@example.com"}` });
  } else if (type === "calendar") {
    const date = normalizeEventDateInput(categoryValue);
    state.calendarMonth = date.slice(0, 7);
    state.events.push({ id: Date.now(), day: Number(date.slice(8, 10)), date, title: titleValue, note: noteValue });
    state.events.sort(sortByEventDateAsc);
    state.notificationLog.unshift({ time: "Teraz", type: "Udalosť", subject: titleValue, status: "Automatický email pripravený pre registrovaných vlastníkov" });
  } else if (type === "emails") {
    state.emailTemplates.push({ id: `custom-${Date.now()}`, title: titleValue, subject: categoryValue, body: noteValue });
  } else if (type === "activities") {
    state.activities.unshift({ id: Date.now(), month: monthValue || new Date().toISOString().slice(0, 7), person: personValue || diaryPersonName(), role: roleFieldValue || diaryRoleLabel(), title: titleValue, hours: Number.parseFloat(hoursValue || "0"), status: document.querySelector("#status")?.value.trim() || "Dokončené", note: noteValue });
  } else if (type === "photoAlbum") {
    state.photos.unshift({ id: Date.now(), title: titleValue, category: categoryValue, author: roleLabel(), date: new Date().toISOString(), description: noteValue, image: "building-placeholder.svg" });
  } else {
    state.announcements.unshift({ id: Date.now(), title: titleValue, body: noteValue, date: new Date().toISOString(), category: categoryValue, urgent: false, youtubeUrl: youtubeUrlValue || "" });
  }

  dialog.close();
  render();
}

function collectNotificationOptions(fallbackOwnerId = "") {
  if (!canSendEmailNotifications()) return { target: "none", ownerId: "" };
  return {
    target: document.querySelector("#notifyTarget")?.value || "none",
    ownerId: document.querySelector("#notifyOwner")?.value || fallbackOwnerId || ""
  };
}

async function saveDialogToSupabase(type, values) {
  const filePath = await uploadSelectedFile(type);
  if (type === "documents" || type === "documentHistory") {
    const publishedAt = documentDateForSave(values.documentDateValue);
    const isHistoryByYear = !isCurrentYearDocument({ date: publishedAt });
    const response = assertSupabaseOk(await supabaseClient.from("documents").insert({
      created_by: state.currentUserId,
      title: values.titleValue,
      category: values.categoryValue,
      description: values.noteValue,
      published_at: publishedAt,
      storage_path: filePath,
      youtube_url: values.youtubeUrlValue || null,
      is_history: type === "documentHistory" || isHistoryByYear
    }).select("id").single());
    await notifyByChoice(type === "documentHistory" ? "Nový dokument v histórii" : "Nový dokument", values.titleValue, values.noteValue, values.notification, "documents", response.data.id, type === "documentHistory"
      ? { view: "documentHistory", detailType: "historyDocument", sectionLabel: titles.documentHistory }
      : { view: "documents", detailType: "document", sectionLabel: titles.documents });
  } else if (type === "billing") {
    if (!values.categoryValue) throw new Error("Vyberte registrovaného vlastníka nehnuteľnosti.");
    if (!filePath) throw new Error("Nahrajte súbor vyúčtovania.");
    const response = assertSupabaseOk(await supabaseClient.from("billing_settlements").insert({
      created_by: state.currentUserId,
      owner_profile_id: values.categoryValue,
      title: values.titleValue,
      settlement_year: Number.parseInt(values.settlementYearValue || `${new Date().getFullYear()}`, 10),
      note: values.noteValue,
      storage_path: filePath
    }).select("id").single());
    const billingNotification = { ...values.notification };
    if (billingNotification.target === "individual" && !billingNotification.ownerId) billingNotification.ownerId = values.categoryValue;
    await notifyByChoice("Nové vyúčtovanie", values.titleValue, values.noteValue, billingNotification, "billing_settlements", response.data.id);
  } else if (type === "executions") {
    if (!values.categoryValue) throw new Error("Vyberte vlastníka nehnuteľnosti.");
    const owner = state.owners.find((ownerItem) => String(ownerItem.id) === String(values.categoryValue) || String(ownerItem.profileId) === String(values.categoryValue));
    const response = assertSupabaseOk(await supabaseClient.from("execution_cases").insert({
      created_by: state.currentUserId,
      owner_record_id: owner?.id || null,
      owner_profile_id: owner?.profileId || null,
      title: values.titleValue,
      owner_name: owner?.name || "Vlastník nehnuteľnosti",
      flat_number: owner?.flat || null,
      owner_email: owner?.email || owner?.loginEmail || null,
      debt_amount: Number.parseFloat(values.amountValue || "0"),
      debt_since: values.ownedFromValue || null,
      status: values.statusValue || "Evidovaný dlh",
      execution_title_status: values.executionTitleStatusValue || "Neposúdené",
      legal_status: values.legalStatusValue || null,
      debt_history: values.noteValue || null,
      last_action_date: new Date().toISOString().slice(0, 10),
      next_step_date: values.nextStepDateValue || null,
      note: null
    }).select("id").single());
    const executionNotification = { ...values.notification };
    if (executionNotification.target === "individual" && !executionNotification.ownerId) executionNotification.ownerId = owner?.profileId || owner?.id || "";
    await notifyByChoice("Exekučný záznam", values.titleValue, values.noteValue, executionNotification, "execution_cases", response.data.id);
  } else if (type === "finance") {
    const amount = Number.parseFloat(values.amountValue || "0");
    const financeYear = Number.parseInt(values.financeYearValue || `${new Date().getFullYear()}`, 10);
    if (values.financeKindValue === "idea" || !canManageAll()) {
      assertSupabaseOk(await supabaseClient.from("innovation_ideas").insert({
        created_by: state.currentUserId,
        title: values.titleValue,
        description: values.noteValue,
        status: "Nový podnet",
        estimated_cost: amount,
        finance_year: financeYear,
        quote_storage_path: filePath
      }));
    } else {
      assertSupabaseOk(await supabaseClient.from("finance_entries").insert({
        created_by: state.currentUserId,
        entry_type: values.financeKindValue || "other_expense",
        title: values.titleValue,
        amount,
        finance_year: financeYear,
        entry_date: new Date().toISOString().slice(0, 10),
        note: values.noteValue
      }));
    }
  } else if (type === "messages") {
    if (!canStartMessageTo(values.categoryValue)) throw new Error("Nemáte oprávnenie odoslať správu vybranému adresátovi.");
    const isPublic = isPublicRecipient(values.categoryValue);
    const recipient = findProfileRecipient(values.categoryValue);
    const response = assertSupabaseOk(await supabaseClient.from("messages").insert({
      sender_id: state.currentUserId,
      recipient_id: isPublic ? null : recipient?.id || null,
      recipient_label: values.categoryValue,
      subject: values.titleValue,
      body: values.noteValue,
      scope: isPublic ? "public" : "private"
    }).select("id").single());
    if (isPublic || isChairRecipientLabel(values.categoryValue)) {
      await notifyChairAboutMessage({
        subject: values.titleValue,
        message: values.noteValue,
        scope: isPublic ? "Verejná diskusia" : "Súkromná správa predsedovi SVB",
        recipient: values.categoryValue,
        relatedId: response.data.id
      });
    }
    const messageNotification = { ...values.notification };
    if (messageNotification.target === "individual" && !messageNotification.ownerId && recipient?.ownerId) messageNotification.ownerId = recipient.ownerId;
    await notifyByChoice("Nová správa", values.titleValue, values.noteValue, messageNotification, "messages", response.data.id);
  } else if (type === "calendar") {
    const startsAt = eventDateToStartsAt(values.categoryValue);
    state.calendarMonth = normalizeEventDateInput(values.categoryValue).slice(0, 7);
    const response = assertSupabaseOk(await supabaseClient.from("events").insert({ created_by: state.currentUserId, title: values.titleValue, description: values.noteValue, starts_at: startsAt }).select("id").single());
    await notifyByChoice("Nová udalosť", values.titleValue, values.noteValue, values.notification, "events", response.data.id);
  } else if (type === "activities") {
    const response = assertSupabaseOk(await supabaseClient.from("activities").insert({ profile_id: state.currentUserId, person: values.personValue || diaryPersonName(), role: values.roleFieldValue || diaryRoleLabel(), title: values.titleValue, month: values.monthValue || new Date().toISOString().slice(0, 7), hours: Number.parseFloat(values.hoursValue || "0"), status: document.querySelector("#status")?.value.trim() || "Dokončené", note: values.noteValue }).select("id").single());
    await notifyByChoice("Nový záznam v denníku", values.titleValue, values.noteValue, values.notification, "activities", response.data.id);
  } else if (type === "photoAlbum") {
    const response = assertSupabaseOk(await supabaseClient.from("photos").insert({ created_by: state.currentUserId, title: values.titleValue, category: values.categoryValue, description: values.noteValue, storage_path: filePath }).select("id").single());
    await notifyByChoice("Nová fotka vo fotoalbume", values.titleValue, values.noteValue, values.notification, "photos", response.data.id);
  } else if (type === "emails") {
    assertSupabaseOk(await supabaseClient.from("email_templates").insert({ key: `custom-${Date.now()}`, title: values.titleValue, subject: values.categoryValue, body: values.noteValue }));
  } else if (type === "votes") {
    const questions = parseVoteQuestions(values.voteQuestionsValue);
    if (!questions.length) throw new Error("Zadajte aspoň jednu hlasovaciu otázku.");
    const closesAt = values.voteDeadlineValue
      ? new Date(`${values.voteDeadlineValue}T23:59:59`).toISOString()
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const voteResponse = assertSupabaseOk(await supabaseClient.from("votes").insert({
      created_by: state.currentUserId,
      title: values.titleValue,
      description: values.noteValue,
      vote_type: values.categoryValue || "present_majority",
      status: "open",
      closes_at: closesAt
    }).select("id").single());
    assertSupabaseOk(await supabaseClient.from("vote_questions").insert(questions.map((question, index) => ({
      vote_id: voteResponse.data.id,
      question,
      sort_order: (index + 1) * 10
    }))));
    await notifyByChoice("Nové hlasovanie", values.titleValue, values.noteValue, values.notification, "votes", voteResponse.data.id);
  } else if (type === "owners") {
    const { data, error } = await supabaseClient.from("owner_records").insert({
      full_name: values.titleValue,
      flat_number: values.categoryValue,
      share_text: "0,00 %",
      login_email: values.loginEmailValue || null,
      account_status: values.accountStatusValue || "Čaká na autorizáciu",
      approval_status: values.approvalStatusValue || "pending",
      owned_from: values.ownedFromValue || null,
      is_debtor: values.isDebtorValue ? ["áno", "ano", "yes", "true", "1"].includes(values.isDebtorValue) : Number.parseFloat(values.debtAmountValue || "0") > 0,
      debt_amount: Number.parseFloat(values.debtAmountValue || "0"),
      note: values.noteValue
    }).select("id").single();
    if (error) throw new Error(error.message);
    await supabaseClient.from("notification_log").insert({ subject: `Pozvánka pre ${values.titleValue}`, channel: "email", error: `Vlastník bol uložený do evidencie. Účet si vytvorí cez úvodné prihlasovacie okno: ${values.loginEmailValue || "bez emailu"}` });
    const ownerNotification = { ...values.notification };
    if (ownerNotification.target === "individual" && !ownerNotification.ownerId) ownerNotification.ownerId = data?.id || "";
    await notifyByChoice("Nový vlastník v evidencii", values.titleValue, values.noteValue, ownerNotification, "owner_records", data?.id);
  } else {
    const response = assertSupabaseOk(await supabaseClient.from("announcements").insert({ created_by: state.currentUserId, title: values.titleValue, body: values.noteValue, category: values.categoryValue, storage_path: filePath, youtube_url: values.youtubeUrlValue || null }).select("id").single());
    await notifyByChoice("Nové oznámenie", values.titleValue, values.noteValue, values.notification, "announcements", response.data.id);
  }
}

async function uploadSelectedFile(type) {
  const input = document.querySelector("#uploadFile");
  const file = input?.files?.[0];
  if (!supabaseClient || !file) return null;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${type}/${Date.now()}-${safeName}`;
  const { error } = await supabaseClient.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
  if (error) {
    window.alert(`Upload zlyhal: ${error.message}`);
    return null;
  }
  return path;
}

function findProfileRecipient(label) {
  if (isLeadershipRecipient(label)) {
    const roleMap = {
      "Predseda SVB": ["Predseda SVB"],
      "Podpredseda SVB": ["Podpredseda SVB"],
      "Ekonomická správa": ["Ekonomická správa"],
      "Dozorná rada": ["Člen dozornej rady", "Dozorná rada"]
    };
    const member = state.boardMembers.find((item) => roleMap[label]?.includes(item.role));
    return { id: member?.id || null, ownerId: member?.id || "", email: member?.email || "", label };
  }
  const flat = label?.split("·").pop()?.trim();
  const owner = state.owners.find((item) => item.flat === flat || item.name === label);
  if (!owner) return null;
  return { id: owner.profileId || null, ownerId: owner.profileId || owner.id || "", email: owner.email, label: `${owner.name} · ${owner.flat}` };
}

async function notifyByChoice(subject, titleText, messageText, notification = {}, relatedTable = null, relatedId = null, metadata = {}) {
  if (!supabaseClient || !canSendEmailNotifications()) return;
  const target = notification.target || "none";
  if (target === "none") return;
  if (target === "individual" && !notification.ownerId) {
    window.alert("Email nebol odoslaný: pri voľbe konkrétneho vlastníka vyberte vlastníka zo zoznamu.");
    return;
  }
  const meta = notificationMetaFor(relatedTable, relatedId, { eventType: subject, ...metadata });
  const template = emailTemplateByKey("notification-detail") || {};
  const replacements = {
    eventType: meta.eventType || subject,
    section: meta.sectionLabel,
    title: titleText || subject,
    message: messageText || "",
    actionUrl: meta.actionUrl,
    sender: roleLabel() || state.currentUserEmail || "Používateľ"
  };
  const emailSubject = fillEmailTemplate(template.subject || "{{eventType}}: {{title}}", replacements);
  const emailBody = fillEmailTemplate(template.body || "Dobrý deň,\n\nv aplikácii e-housing bola vytvorená alebo upravená udalosť.\n\nTyp udalosti: {{eventType}}\nZáložka: {{section}}\nNázov: {{title}}\n\n{{message}}\n\nDetail otvoríte kliknutím na tento odkaz:\n{{actionUrl}}", replacements);
  try {
    const { data, error } = await supabaseClient.functions.invoke("send-notification", {
      body: {
        target,
        ownerId: notification.ownerId || null,
        subject: emailSubject,
        title: titleText,
        message: emailBody,
        relatedTable,
        relatedId,
        eventType: meta.eventType || subject,
        section: meta.sectionLabel,
        actionUrl: meta.actionUrl,
        view: meta.view,
        detailType: meta.detailType,
        detailId: meta.detailId
      }
    });
    if (error || data?.error) throw new Error(data?.error || error.message);
    if (Array.isArray(data?.errors) && data.errors.length) throw new Error(data.errors[0]);
    if (Number(data?.recipients || 0) > 0 && Number(data?.sent || 0) === 0) throw new Error("Email sa nepodarilo odoslať žiadnemu príjemcovi.");
  } catch (error) {
    const message = error?.message || "Email funkcia čaká na konfiguráciu alebo sa odoslanie nepodarilo";
    window.alert(`Položka bola uložená, ale email sa nepodarilo odoslať: ${message}`);
    state.notificationLog.unshift({ time: "Teraz", type: "Email", subject: titleText, status: message });
  }
}

async function notifyChairAboutMessage({ subject, message, scope, recipient, relatedTable = "messages", relatedId, view, detailType, detailId, actionUrl, eventType }) {
  if (!supabaseClient || !state.currentUserId || state.role === "chair") return;
  const template = emailTemplateByKey("message-to-chair") || {};
  const replacements = {
    subject,
    message,
    scope,
    recipient,
    sender: roleLabel() || state.currentUserEmail || "Používateľ"
  };
  const emailSubject = fillEmailTemplate(template.subject || "Nová správa pre predsedu SVB: {{subject}}", replacements);
  const emailBody = fillEmailTemplate(template.body || "V aplikácii e-housing bola vytvorená nová správa.\n\nOdosielateľ: {{sender}}\nPredmet: {{subject}}\nText správy:\n{{message}}", replacements);
  const meta = notificationMetaFor(relatedTable, relatedId, {
    view,
    detailType,
    detailId,
    actionUrl,
    eventType: eventType || (relatedTable === "vote_comments" ? "Komentár k hlasovaniu pre predsedu SVB" : "Správa pre predsedu SVB")
  });
  try {
    const { data, error } = await supabaseClient.functions.invoke("send-notification", {
      body: {
        target: "chair",
        subject: emailSubject,
        title: subject,
        message: emailBody,
        relatedTable,
        relatedId,
        eventType: meta.eventType,
        section: meta.sectionLabel,
        actionUrl: meta.actionUrl,
        view: meta.view,
        detailType: meta.detailType,
        detailId: meta.detailId
      }
    });
    if (error || data?.error) throw new Error(data?.error || error.message);
    if (Array.isArray(data?.errors) && data.errors.length) throw new Error(data.errors[0]);
  } catch (error) {
    const status = error?.message || "Email predsedovi sa nepodarilo odoslať.";
    window.alert(`Správa bola uložená, ale notifikácia predsedovi sa nepodarila odoslať: ${status}`);
    state.notificationLog.unshift({ time: "Teraz", type: "Email", subject, status });
  }
}

async function saveEditDialog(type, id) {
  if (!canEditItem(type)) return;
  const item = findEditable(type, id);
  if (!item) return;
  const titleValue = document.querySelector("#title")?.value.trim() || editTitle(type, item);
  const categoryValue = document.querySelector("#category")?.value.trim() || "";
  const loginEmailValue = document.querySelector("#ownerLoginEmail")?.value.trim();
  const accountStatusValue = document.querySelector("#accountStatus")?.value.trim();
  const approvalStatusValue = document.querySelector("#approvalStatus")?.value.trim();
  const statusValue = document.querySelector("#status")?.value.trim();
  const urgentValue = document.querySelector("#urgent")?.value.trim();
  const personValue = document.querySelector("#person")?.value.trim();
  const roleFieldValue = document.querySelector("#roleField")?.value.trim();
  const monthValue = document.querySelector("#month")?.value.trim();
  const hoursValue = document.querySelector("#hours")?.value.trim();
  const emailValue = document.querySelector("#email")?.value.trim();
  const phoneValue = document.querySelector("#phone")?.value.trim();
  const amountValue = document.querySelector("#amount")?.value.trim();
  const financeYearValue = document.querySelector("#financeYear")?.value.trim();
  const ownedFromValue = document.querySelector("#ownedFrom")?.value.trim();
  const documentDateValue = document.querySelector("#documentDate")?.value.trim();
  const youtubeUrlValue = document.querySelector("#youtubeUrl")?.value.trim();
  const voteDeadlineValue = document.querySelector("#voteDeadline")?.value.trim();
  const legalStatusValue = document.querySelector("#legalStatus")?.value.trim();
  const executionTitleStatusValue = document.querySelector("#executionTitleStatus")?.value.trim();
  const nextStepDateValue = document.querySelector("#nextStepDate")?.value.trim();
  const correspondenceStreetValue = document.querySelector("#correspondenceStreet")?.value.trim();
  const correspondenceCityValue = document.querySelector("#correspondenceCity")?.value.trim();
  const correspondencePostalCodeValue = document.querySelector("#correspondencePostalCode")?.value.trim();
  const debtAmountValue = document.querySelector("#debtAmount")?.value.trim();
  const isDebtorValue = document.querySelector("#isDebtor")?.value.trim().toLowerCase();
  const noteValue = document.querySelector("#note")?.value.trim() || "";

  if (supabaseClient && state.currentUserId) {
    try {
      await saveEditToSupabase(type, item, {
        titleValue,
        categoryValue,
        loginEmailValue,
        accountStatusValue,
        approvalStatusValue,
        correspondenceStreetValue,
        correspondenceCityValue,
        correspondencePostalCodeValue,
        statusValue,
        urgentValue,
        personValue,
        roleFieldValue,
        monthValue,
        hoursValue,
        emailValue,
        phoneValue,
        amountValue,
        financeYearValue,
        ownedFromValue,
        documentDateValue,
        youtubeUrlValue,
        voteDeadlineValue,
        legalStatusValue,
        executionTitleStatusValue,
        nextStepDateValue,
        debtAmountValue,
        isDebtorValue,
        noteValue
      });
      await writeActivityLog("update", `Úprava položky: ${titleValue}`, {
        relatedTable: type,
        relatedId: id,
        metadata: { previousTitle: editTitle(type, item), category: categoryValue }
      });
    } catch (error) {
      window.alert(`Úprava zlyhala: ${error.message}`);
      return;
    }
    dialog.close();
    await loadSupabaseData();
    render();
    return;
  }

  if (type === "owner") {
    item.name = titleValue;
    item.flat = categoryValue || item.flat;
    item.loginEmail = loginEmailValue || item.loginEmail || item.email;
    item.email = item.loginEmail;
    item.phone = phoneValue || item.phone || "";
    item.correspondenceStreet = correspondenceStreetValue || item.correspondenceStreet || "";
    item.correspondenceCity = correspondenceCityValue || item.correspondenceCity || "";
    item.correspondencePostalCode = correspondencePostalCodeValue || item.correspondencePostalCode || "";
    item.accountStatus = accountStatusValue || item.accountStatus;
    item.approvalStatus = approvalStatusValue || item.approvalStatus || "pending";
    item.ownedFrom = ownedFromValue || item.ownedFrom;
    item.debtAmount = Number.parseFloat(debtAmountValue || item.debtAmount || "0");
    item.isDebtor = isDebtorValue ? ["áno", "ano", "yes", "true", "1"].includes(isDebtorValue) : item.debtAmount > 0;
    item.note = noteValue || item.note;
    item.status = item.accountStatus;
  } else if (type === "activity") {
    item.title = titleValue;
    item.person = personValue || item.person;
    item.role = roleFieldValue || item.role;
    item.month = monthValue || item.month;
    item.hours = Number.parseFloat(hoursValue || item.hours || "0");
    item.status = statusValue || item.status;
    item.note = noteValue || item.note;
  } else if (type === "boardMember") {
    item.name = titleValue;
    item.role = roleFieldValue || item.role;
    item.email = emailValue || item.email;
    item.phone = phoneValue || item.phone;
    item.note = noteValue || item.note;
  } else if (type === "event") {
    const date = normalizeEventDateInput(categoryValue);
    item.title = titleValue;
    item.day = Number(date.slice(8, 10));
    item.date = date;
    item.note = noteValue || item.note;
    state.calendarMonth = date.slice(0, 7);
    state.notificationLog.unshift({ time: "Teraz", type: "Udalosť", subject: item.title, status: "Pri úprave udalosti bude možné odoslať aktualizačný email" });
  } else if (type === "vote") {
    item.title = titleValue;
    item.type = categoryValue || item.type || "present_majority";
    item.closes = voteDeadlineValue || item.closes;
    item.status = statusValue || item.status;
    item.description = noteValue || item.description;
  } else if (type === "document") {
    const documentDate = documentDateForSave(documentDateValue, item.date);
    item.title = titleValue;
    item.type = categoryValue || item.type;
    item.category = item.type;
    item.date = documentDate;
    item.urgent = urgentValue === "Email odoslaný";
    item.visibility = noteValue || item.visibility;
    item.note = item.visibility;
  } else if (type === "historyDocument") {
    const documentDate = documentDateForSave(documentDateValue, item.date);
    item.title = titleValue;
    item.category = categoryValue || item.category;
    item.date = documentDate;
    item.note = noteValue || item.note;
  } else if (type === "innovationIdea") {
    item.title = titleValue;
    item.status = statusValue || item.status;
    item.estimatedCost = Number.parseFloat(amountValue || item.estimatedCost || "0");
    item.year = Number.parseInt(financeYearValue || item.year || `${new Date().getFullYear()}`, 10);
    item.description = noteValue || item.description;
  } else if (type === "executionCase") {
    const owner = state.owners.find((ownerItem) => String(ownerItem.id) === String(categoryValue) || String(ownerItem.profileId) === String(categoryValue));
    item.title = titleValue;
    item.ownerRecordId = owner?.id || item.ownerRecordId;
    item.ownerProfileId = owner?.profileId || item.ownerProfileId;
    item.ownerName = owner?.name || item.ownerName;
    item.flat = owner?.flat || item.flat;
    item.email = owner?.email || owner?.loginEmail || item.email;
    item.debtAmount = Number.parseFloat(amountValue || item.debtAmount || "0");
    item.debtSince = ownedFromValue || item.debtSince;
    item.status = statusValue || item.status;
    item.executionTitleStatus = executionTitleStatusValue || item.executionTitleStatus;
    item.legalStatus = legalStatusValue || item.legalStatus;
    item.debtHistory = noteValue || item.debtHistory;
    item.nextStepDate = nextStepDateValue || item.nextStepDate;
  } else {
    item.title = titleValue;
    item.category = categoryValue || item.category;
    item.body = noteValue || item.body;
  }

  dialog.close();
  render();
}

async function saveEditToSupabase(type, item, values) {
  if (type === "message") {
    if (!canEditMessage(item)) throw new Error("Správu môže upraviť iba jej autor.");
    const { error } = await supabaseClient.from("messages").update({
      subject: values.titleValue,
      body: values.noteValue || item.text
    }).eq("id", item.id).eq("sender_id", state.currentUserId);
    if (error) throw new Error(error.message);
    return;
  }

  if (type === "owner") {
    const nextDebtAmount = Number.parseFloat(values.debtAmountValue || item.debtAmount || "0");
    const nextIsDebtor = values.isDebtorValue ? ["áno", "ano", "yes", "true", "1"].includes(values.isDebtorValue) : nextDebtAmount > 0;
    const { error } = await supabaseClient.from("owner_records").update({
      full_name: values.titleValue,
      flat_number: values.categoryValue || item.flat,
      login_email: values.loginEmailValue || item.loginEmail || item.email,
      phone: values.phoneValue || null,
      correspondence_street: values.correspondenceStreetValue || null,
      correspondence_city: values.correspondenceCityValue || null,
      correspondence_postal_code: values.correspondencePostalCodeValue || null,
      account_status: values.accountStatusValue || item.accountStatus,
      approval_status: values.approvalStatusValue || item.approvalStatus || "pending",
      owned_from: values.ownedFromValue || null,
      is_debtor: nextIsDebtor,
      debt_amount: nextDebtAmount,
      note: values.noteValue || null,
      updated_at: new Date().toISOString()
    }).eq("id", item.id);
    if (error) throw new Error(error.message);
    if (item.profileId) {
      await supabaseClient.from("profiles").update({
        full_name: values.titleValue,
        flat_number: values.categoryValue || item.flat,
        email: values.loginEmailValue || item.loginEmail || item.email,
        phone: values.phoneValue || null,
        correspondence_street: values.correspondenceStreetValue || null,
        correspondence_city: values.correspondenceCityValue || null,
        correspondence_postal_code: values.correspondencePostalCodeValue || null,
        approval_status: values.approvalStatusValue || item.approvalStatus || "pending",
        owned_from: values.ownedFromValue || null,
        is_debtor: nextIsDebtor,
        debt_amount: nextDebtAmount,
        note: values.noteValue || null
      }).eq("id", item.profileId);
    }
    return;
  }

  if (type === "activity") {
    const { error } = await supabaseClient.from("activities").update({
      title: values.titleValue,
      person: values.personValue || item.person,
      role: values.roleFieldValue || item.role,
      month: values.monthValue || item.month,
      hours: Number.parseFloat(values.hoursValue || item.hours || "0"),
      status: values.statusValue || item.status,
      note: values.noteValue || null
    }).eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }

  if (type === "boardMember") {
    const nextRole = roleFieldToAppRole(values.roleFieldValue, "board");
    const { error } = await supabaseClient.from("profiles").update({
      full_name: values.titleValue,
      role: nextRole,
      email: values.emailValue || item.email,
      phone: values.phoneValue || null,
      note: values.noteValue || null
    }).eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }

  if (type === "event") {
    const startsAt = eventDateToStartsAt(values.categoryValue || eventDateKey(item));
    state.calendarMonth = normalizeEventDateInput(values.categoryValue || eventDateKey(item)).slice(0, 7);
    const { error } = await supabaseClient.from("events").update({
      title: values.titleValue,
      description: values.noteValue || null,
      starts_at: startsAt
    }).eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }

  if (type === "vote") {
    const closesAt = values.voteDeadlineValue ? new Date(`${values.voteDeadlineValue}T23:59:59`).toISOString() : item.closes || null;
    const { error } = await supabaseClient.from("votes").update({
      title: values.titleValue,
      description: values.noteValue || item.description || null,
      vote_type: values.categoryValue || item.type || "present_majority",
      status: values.statusValue || item.status,
      closes_at: closesAt
    }).eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }

  if (type === "document" || type === "historyDocument") {
    const filePath = await uploadSelectedFile(type);
    const publishedAt = documentDateForSave(values.documentDateValue, item.date);
    const update = {
      title: values.titleValue,
      category: values.categoryValue || (type === "document" ? item.type : item.category),
      description: values.noteValue || null,
      published_at: publishedAt,
      youtube_url: values.youtubeUrlValue || null,
      is_history: type === "historyDocument" || !isCurrentYearDocument({ date: publishedAt })
    };
    if (type === "document") update.is_urgent = values.urgentValue === "Email odoslaný";
    if (filePath) update.storage_path = filePath;
    const { error } = await supabaseClient.from("documents").update(update).eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }

  if (type === "executionCase") {
    const owner = state.owners.find((ownerItem) => String(ownerItem.id) === String(values.categoryValue) || String(ownerItem.profileId) === String(values.categoryValue));
    const update = {
      title: values.titleValue,
      owner_record_id: owner?.id || item.ownerRecordId || null,
      owner_profile_id: owner?.profileId || item.ownerProfileId || null,
      owner_name: owner?.name || item.ownerName || "Vlastník nehnuteľnosti",
      flat_number: owner?.flat || item.flat || null,
      owner_email: owner?.email || owner?.loginEmail || item.email || null,
      debt_amount: Number.parseFloat(values.amountValue || item.debtAmount || "0"),
      debt_since: values.ownedFromValue || item.debtSince || null,
      status: values.statusValue || item.status || "Evidovaný dlh",
      execution_title_status: values.executionTitleStatusValue || item.executionTitleStatus || "Neposúdené",
      legal_status: values.legalStatusValue || item.legalStatus || null,
      debt_history: values.noteValue || item.debtHistory || null,
      last_action_date: new Date().toISOString().slice(0, 10),
      next_step_date: values.nextStepDateValue || item.nextStepDate || null,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from("execution_cases").update(update).eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }

  if (type === "innovationIdea") {
    const filePath = await uploadSelectedFile(type);
    const update = {
      title: values.titleValue,
      status: values.statusValue || item.status,
      estimated_cost: Number.parseFloat(values.amountValue || item.estimatedCost || "0"),
      finance_year: Number.parseInt(values.financeYearValue || item.year || `${new Date().getFullYear()}`, 10),
      description: values.noteValue || item.description || null,
      updated_at: new Date().toISOString()
    };
    if (filePath) update.quote_storage_path = filePath;
    const { error } = await supabaseClient.from("innovation_ideas").update(update).eq("id", item.id);
    if (error) throw new Error(error.message);
    return;
  }

  const filePath = await uploadSelectedFile(type);
  const update = {
    title: values.titleValue,
    category: values.categoryValue || item.category,
    body: values.noteValue || item.body,
    youtube_url: values.youtubeUrlValue || null
  };
  if (filePath) update.storage_path = filePath;
  const { error } = await supabaseClient.from("announcements").update(update).eq("id", item.id);
  if (error) throw new Error(error.message);
}

async function boot() {
  state.pendingDeepLink = readDeepLinkFromUrl();
  if (supabaseClient) {
    await loadPublicSettings();
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      await applySupabaseSession(data.session);
    }
  }
  render();
}

boot();










