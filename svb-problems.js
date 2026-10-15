const SVB_PROBLEM_BUCKET = "svb-problem-photos";
const SVB_PROBLEM_IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const SVB_PROBLEM_NOTICE_VERSION = "SVB-PROBLEMS-2026-10-13-1";
let svbProblemAcknowledgement = null;
let svbProblemNoticeAction = null;

function hasSvbProblemAcknowledgement() {
  return Boolean(state.loggedIn && state.currentUserId && svbProblemAcknowledgement?.userId === state.currentUserId
    && svbProblemAcknowledgement.version === SVB_PROBLEM_NOTICE_VERSION);
}

function resetSvbProblemAcknowledgement() {
  svbProblemAcknowledgement = null;
  svbProblemNoticeAction = null;
  state.svbProblems = [];
  if (typeof document !== "undefined") {
    document.querySelector("#svbProblemNoticeDialog")?.close();
    document.querySelector("#actionDialog")?.close();
  }
}

function svbProblemNoticeMarkup() {
  return `<form class="dialog-card svb-problem-notice-card">
    <div class="dialog-head"><div class="svb-problem-notice-heading">${icon("shield-alert")}<h2 id="svbProblemNoticeTitle" tabindex="-1">Dôverný obsah a ochrana osobných údajov</h2></div></div>
    <div class="svb-problem-notice-text" id="svbProblemNoticeText">
      <p><strong>Vstupujete do časti Problémy SVB, ktorá môže obsahovať osobné údaje, fotografie a informácie zasahujúce do súkromia vlastníkov alebo iných osôb.</strong></p>
      <h3>Účel a rozsah sprístupnenia</h3>
      <p>Informácie sú určené oprávneným používateľom SVB a NP Družstevná 386 na riešenie konkrétnych záležitostí správy domu a ochranu práv a oprávnených záujmov vlastníkov. Sprístupňovať sa majú iba údaje nevyhnutné na tento účel, príslušným adresátom a na zodpovedajúcom právnom základe. Samotná potreba informovať vlastníkov neoprávňuje na neobmedzené zverejnenie osobných údajov.</p>
      <h3>Dôvernosť a zákaz neoprávneného šírenia</h3>
      <p>Bez oprávnenia alebo zákonného dôvodu nie je dovolené obsah kopírovať, fotografovať, vyhotovovať snímky obrazovky, sťahovať na ďalšie šírenie, preposielať, zverejňovať na sociálnych sieťach ani inak poskytovať neoprávneným osobám. Informácie používajte iba na uvedený účel a chráňte ich pred prístupom iných osôb.</p>
      <p>Tieto pravidlá neobmedzujú zákonné práva, splnenie zákonnej povinnosti, oznámenie protiprávneho konania ani nevyhnutné poskytnutie informácií súdu, príslušnému orgánu verejnej moci, dozornému orgánu alebo právnemu zástupcovi pri ochrane práv. Aj v takých prípadoch postupujte iba v potrebnom rozsahu.</p>
      <h3>Ochrana osobných údajov (GDPR)</h3>
      <p>Potvrdením beriete na vedomie tieto pravidlá a informácie o ochrane údajov. <strong>Neudeľujete tým súhlas so zverejnením svojich ani cudzích osobných údajov.</strong> Toto potvrdenie nenahrádza právny základ spracúvania ani informačnú povinnosť prevádzkovateľa. Vaše zákonné práva na ochranu osobných údajov a možnosť obrátiť sa na Úrad na ochranu osobných údajov SR zostávajú zachované.</p>
      <p>Ak zistíte nesprávne údaje, neprimeraný rozsah sprístupnenia alebo neoprávnené šírenie, obráťte sa na predsedu SVB. Ak nechcete potvrdiť pravidlá elektronického prístupu, opustite túto časť a požiadajte predsedu o zákonne dostupný spôsob oboznámenia sa s príslušnými informáciami.</p>
      <details><summary>Informácie SVB o spracúvaní osobných údajov</summary><div class="svb-problem-gdpr-text">${escapeHtml(state.gdprText || defaultGdprText())}</div></details>
      <p class="muted">Verzia upozornenia: ${SVB_PROBLEM_NOTICE_VERSION}</p>
    </div>
    <label class="svb-problem-notice-confirm"><input type="checkbox" id="svbProblemNoticeAccepted"><span>Oboznámil/a som sa s upozornením a informáciami o ochrane osobných údajov. Zaväzujem sa rešpektovať uvedené pravidlá dôvernosti.</span></label>
    <p class="svb-problem-notice-error" role="alert" hidden></p>
    <div class="dialog-actions"><button type="button" class="ghost" data-problem-notice-leave>${icon("arrow-left")}<span>Nesúhlasím, odísť</span></button><button type="submit" class="primary" data-problem-notice-accept disabled>${icon("shield-check")}<span>Súhlasím a pokračujem</span></button></div>
  </form>`;
}

function ensureSvbProblemAcknowledgement(action) {
  if (hasSvbProblemAcknowledgement()) return true;
  if (!state.loggedIn || !state.currentUserId || isPendingAuthorization()) return false;
  if (typeof action === "function") svbProblemNoticeAction = action;
  let notice = document.querySelector("#svbProblemNoticeDialog");
  if (notice?.open) return false;
  if (!notice) {
    notice = document.createElement("dialog");
    notice.id = "svbProblemNoticeDialog";
    notice.setAttribute("aria-labelledby", "svbProblemNoticeTitle");
    document.body.append(notice);
  }
  notice.innerHTML = svbProblemNoticeMarkup();
  const checkbox = notice.querySelector("#svbProblemNoticeAccepted");
  const accept = notice.querySelector("[data-problem-notice-accept]");
  const leave = notice.querySelector("[data-problem-notice-leave]");
  const userId = state.currentUserId;
  let busy = false;
  const decline = () => {
    if (busy) return;
    svbProblemNoticeAction = null;
    state.pendingDeepLink = null;
    if (state.view === "problems") state.view = "overview";
    notice.close();
    render();
  };
  checkbox.addEventListener("change", () => { accept.disabled = !checkbox.checked; });
  leave.addEventListener("click", decline);
  notice.oncancel = (event) => { event.preventDefault(); decline(); };
  notice.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || !checkbox.checked || state.currentUserId !== userId || !state.loggedIn) return;
    busy = true;
    accept.disabled = true;
    leave.disabled = true;
    checkbox.disabled = true;
    const errorLabel = notice.querySelector(".svb-problem-notice-error");
    errorLabel.hidden = true;
    svbProblemAcknowledgement = { userId, version: SVB_PROBLEM_NOTICE_VERSION, acceptedAt: new Date().toISOString() };
    try {
      if (supabaseClient) await loadSupabaseData();
      if (!hasSvbProblemAcknowledgement()) return;
      if (state.svbProblemsError) throw new Error("Obsah sa nepodarilo načítať. Skúste to znova.");
      const next = svbProblemNoticeAction;
      svbProblemNoticeAction = null;
      notice.close();
      render();
      next?.();
    } catch (error) {
      svbProblemAcknowledgement = null;
      state.svbProblems = [];
      errorLabel.textContent = error.message || "Obsah sa nepodarilo načítať.";
      errorLabel.hidden = false;
    } finally {
      busy = false;
      accept.disabled = !checkbox.checked;
      leave.disabled = false;
      checkbox.disabled = false;
    }
  });
  notice.showModal();
  enhanceIcons();
  notice.querySelector("#svbProblemNoticeTitle").focus();
  return false;
}

function svbProblemLockedView() {
  return `<section class="panel messages-panel svb-problems-panel"><div class="toolbar messages-toolbar"><h2>Problémy SVB</h2></div><p>Dôverný obsah je uzamknutý do potvrdenia pravidiel prístupu.</p><button class="primary" data-open-problem-notice>${icon("shield-alert")}<span>Zobraziť upozornenie</span></button></section>`;
}

function canManageSvbProblems() {
  return state.role === "chair" || state.isPlatformAdmin === true;
}

function svbProblemRecipients() {
  const ownerIds = new Set(state.owners.filter((owner) => owner.approvalStatus === "approved").map((owner) => owner.profileId));
  return state.profiles.filter((profile) => profile.approval_status === "approved"
    && (["owner", "chair", "vice_chair", "board"].includes(profile.role) || ownerIds.has(profile.id)))
    .sort((a, b) => String(a.full_name || "").localeCompare(String(b.full_name || ""), "sk"));
}

function svbProblemRecipientLabel(profile) {
  return `${profile.full_name || roleLabelForKey(profile.role)}${profile.flat_number ? ` · ${profile.flat_number}` : ""}`;
}

function visibleSvbProblems() {
  if (!hasSvbProblemAcknowledgement()) return [];
  return state.svbProblems.filter((item) => canManageSvbProblems() || !item.recipientId || item.recipientId === state.currentUserId);
}

async function dbSvbProblemToCard(row) {
  const photos = await Promise.all((row.photo_paths || []).map(async (path) => {
    const { data } = await supabaseClient.storage.from(SVB_PROBLEM_BUCKET).createSignedUrl(path, 3600);
    return { path, url: data?.signedUrl || "" };
  }));
  return {
    id: row.id, title: row.title, body: row.body, createdBy: row.created_by,
    author: row.creator?.full_name || "Predseda SVB", recipientId: row.recipient_id,
    recipientLabel: row.recipient ? svbProblemRecipientLabel(row.recipient) : row.recipient_id ? "Konkrétny vlastník" : "Všetci vlastníci",
    youtubeUrl: row.youtube_url || "", photos, showInAlbum: row.show_in_album,
    createdAt: row.created_at, updatedAt: row.updated_at
  };
}

function svbProblemAlbumPhotos() {
  return visibleSvbProblems().filter((item) => item.showInAlbum).flatMap((item) =>
    item.photos.map((photo, index) => ({
      id: `problem:${item.id}:${index}`, problemId: item.id, title: item.title,
      category: "Problémy SVB", description: item.body, author: item.author,
      date: item.createdAt, image: photo.url || "building-placeholder.svg"
    }))
  );
}

function albumPhotos() {
  return [...state.photos, ...calendarAlbumPhotos(), ...svbProblemAlbumPhotos()].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function svbProblemPhotosMarkup(item, limit = 10) {
  if (!item.photos.length) return "";
  return `<div class="svb-problem-photos">${item.photos.slice(0, limit).map((photo, index) => `
    <button type="button" class="photo-preview-button" data-svb-photo="${item.id}:${index}" aria-label="Zobraziť fotografiu ${index + 1}">
      ${photo.url ? `<img src="${escapeAttr(photo.url)}" alt="${escapeAttr(item.title)} · ${index + 1}" loading="lazy">` : `<span>Fotografia nie je dostupná</span>`}
    </button>`).join("")}</div>`;
}

function svbProblemCard(item) {
  return `<article class="message svb-problem-card">
    <div class="message-head">
      <div><h3>${escapeHtml(item.title)}</h3><p class="muted">${escapeHtml(item.author)}</p></div>
      <span class="tag ${item.recipientId ? "document" : "urgent"}">${icon(item.recipientId ? "lock-keyhole" : "users")}<span>${item.recipientId ? "Adresná udalosť" : "Všetci vlastníci"}</span></span>
    </div>
    <p class="svb-problem-body">${escapeHtml(item.body)}</p>
    ${svbProblemPhotosMarkup(item, 3)}
    ${mediaPreviewBlock({ youtubeUrl: item.youtubeUrl })}
    <div class="tag-row"><span class="tag">${escapeHtml(item.recipientLabel)}</span><span class="tag">${formatDate(item.createdAt)}</span>${item.photos.length ? `<span class="tag">Fotografie: ${item.photos.length}</span>` : ""}</div>
    <div class="row-actions">
      <button class="ghost" data-detail="svbProblem" data-id="${item.id}">${icon("eye")}<span>Detail</span></button>
      ${canManageSvbProblems() ? `<button class="ghost" data-edit="svbProblem" data-id="${item.id}">${icon("pencil")}<span>Upraviť</span></button>${deleteButton("svbProblem", item.id, item)}` : ""}
    </div>
  </article>`;
}

function svbProblemsView() {
  if (!hasSvbProblemAcknowledgement()) return svbProblemLockedView();
  const items = visibleSvbProblems().filter((item) => state.svbProblemFilter === "all"
    || (state.svbProblemFilter === "private" ? Boolean(item.recipientId) : !item.recipientId));
  return `<section class="panel messages-panel svb-problems-panel">
    <div class="toolbar messages-toolbar"><h2>Problémy SVB</h2><span class="tag">Počet udalostí: ${items.length}</span></div>
    <select class="search below-title-select message-filter-select" data-svb-problem-filter aria-label="Viditeľnosť udalostí">
      ${[["all", "Všetky udalosti"], ["public", "Pre všetkých vlastníkov"], ["private", "Adresné udalosti"]].map(([value, label]) => `<option value="${value}" ${state.svbProblemFilter === value ? "selected" : ""}>${label}</option>`).join("")}
    </select>
    ${state.svbProblemsError ? `<p role="alert" class="notice">Udalosti sa nepodarilo načítať. ${escapeHtml(state.svbProblemsError)}</p>` : ""}
    <div class="message-list talk-message-list">${items.map(svbProblemCard).join("")}</div>
    ${!items.length && !state.svbProblemsError ? `<p class="muted svb-problem-empty">Zatiaľ nie sú žiadne udalosti.</p>` : ""}
  </section>`;
}

function svbProblemDetail(item) {
  return `<div class="tag-row"><span class="tag">${escapeHtml(item.recipientLabel)}</span><span class="tag">${formatDateTime(item.createdAt)}</span><span class="tag">${escapeHtml(item.author)}</span></div>
    <p class="svb-problem-body">${escapeHtml(item.body)}</p>
    ${svbProblemPhotosMarkup(item)}${mediaPreviewBlock({ youtubeUrl: item.youtubeUrl })}`;
}

function svbProblemForm(item = null) {
  const recipients = svbProblemRecipients();
  const selected = recipients.find((profile) => profile.id === item?.recipientId);
  const recipientRoles = talkRecipientRoleOptions(recipients);
  const role = selected?.role || recipientRoles[0]?.[0] || "";
  return `<div class="svb-problem-form">
    ${fieldsWithValues([["title", "Predmet", escapeHtml(item?.title || "")]])}
    <div class="talk-addressing-fields">
      <div class="talk-addressing-head"><span class="talk-addressing-icon">${icon("send")}</span><h3>Adresovanie udalosti</h3></div>
      ${fieldsWithValues([["problemScope", "Zobrazenie udalosti", item?.recipientId ? "private" : "public", "select", [["public", "Všetci vlastníci"], ["private", "Konkrétny vlastník"]]]])}
      <div data-problem-private-fields ${item?.recipientId ? "" : "hidden"}>
        ${fieldsWithValues([
          ["problemRecipientRole", "Rola vlastníka", role, "select", recipientRoles],
          ["problemRecipient", "Vlastník nehnuteľnosti", item?.recipientId || "", "select", [["", "Vyberte vlastníka"], ...recipients.filter((profile) => profile.role === role).map((profile) => [profile.id, svbProblemRecipientLabel(profile)])]]
        ])}
        <p class="svb-problem-selected-recipient" data-problem-selected-recipient></p>
      </div>
      <p class="muted" data-problem-privacy>${item?.recipientId ? "Udalosť a fotografie uvidí iba vybraný vlastník, predseda a administrátor." : "Udalosť a fotografie uvidia všetci schválení používatelia domu."}</p>
    </div>
    ${fieldsWithValues([["note", "Text udalosti", escapeHtml(item?.body || ""), "textarea"], ["youtubeUrl", "YouTube video link", item?.youtubeUrl || ""]])}
    ${item?.photos.length ? `<fieldset class="svb-problem-existing"><legend>Priložené fotografie</legend>${item.photos.map((photo, index) => `<label class="svb-problem-existing-photo"><img src="${escapeAttr(photo.url || "building-placeholder.svg")}" alt="Fotografia ${index + 1}"><span><input type="checkbox" data-problem-keep-photo value="${escapeAttr(photo.path)}" checked> Ponechať fotografiu ${index + 1}</span></label>`).join("")}</fieldset>` : ""}
    <div class="field"><label for="problemPhotos">Fotografie k udalosti</label><input id="problemPhotos" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple><small>Najviac 10 fotografií, každá do 10 MB.</small></div>
    <label class="svb-problem-album-toggle"><input id="problemShowInAlbum" type="checkbox" ${item?.showInAlbum === false ? "" : "checked"}><span>Zobraziť fotografie aj vo Fotoalbume</span></label>
    <article class="notice"><strong>Automatické upozornenie</strong><p>Po vytvorení udalosti sa príjemcom odošle email a push upozornenie. Pri adresnej udalosti dostane upozornenie iba vybraný vlastník.</p></article>
  </div>`;
}

function bindSvbProblemActions(root) {
  root.querySelectorAll("[data-open-problem-notice]").forEach((button) => button.addEventListener("click", () => ensureSvbProblemAcknowledgement()));
  root.querySelectorAll("[data-svb-problem-filter]").forEach((select) => select.addEventListener("change", () => {
    state.svbProblemFilter = select.value;
    render();
  }));
  root.querySelectorAll("[data-svb-photo]").forEach((button) => button.addEventListener("click", () => {
    const [id, index] = button.dataset.svbPhoto.split(":");
    const item = visibleSvbProblems().find((problem) => problem.id === id);
    const photo = item?.photos[Number(index)];
    if (!photo?.url) return;
    dialogSave.hidden = true;
    dialogTitle.textContent = item.title;
    dialogBody.innerHTML = `<figure class="photo-preview"><img src="${escapeAttr(photo.url)}" alt="${escapeAttr(item.title)}"><figcaption>${escapeHtml(item.recipientLabel)}</figcaption></figure>`;
    if (!dialog.open) dialog.showModal();
  }));
  const scope = root.querySelector("#problemScope");
  if (!scope) return;
  const role = root.querySelector("#problemRecipientRole");
  const recipient = root.querySelector("#problemRecipient");
  const syncRecipient = () => {
    const selected = svbProblemRecipients().find((profile) => profile.id === recipient.value);
    root.querySelector("[data-problem-selected-recipient]").textContent = selected ? svbProblemRecipientLabel(selected) : "";
  };
  const syncScope = () => {
    const isPrivate = scope.value === "private";
    root.querySelector("[data-problem-private-fields]").hidden = !isPrivate;
    recipient.required = isPrivate;
    root.querySelector("[data-problem-privacy]").textContent = isPrivate
      ? "Udalosť a fotografie uvidí iba vybraný vlastník, predseda a administrátor."
      : "Udalosť a fotografie uvidia všetci schválení používatelia domu.";
  };
  role.addEventListener("change", () => {
    recipient.innerHTML = `<option value="">Vyberte vlastníka</option>` + svbProblemRecipients().filter((profile) => profile.role === role.value)
      .map((profile) => `<option value="${escapeAttr(profile.id)}">${escapeHtml(svbProblemRecipientLabel(profile))}</option>`).join("");
    syncRecipient();
  });
  recipient.addEventListener("change", syncRecipient);
  scope.addEventListener("change", syncScope);
  syncRecipient();
  syncScope();
}

function validateSvbProblemDraft(draft, recipients) {
  if (!draft.title || draft.title.length > 300) throw new Error("Zadajte predmet s dĺžkou najviac 300 znakov.");
  if (!draft.body || draft.body.length > 20000) throw new Error("Zadajte text udalosti s dĺžkou najviac 20 000 znakov.");
  if (draft.scope === "private" && !recipients.some((profile) => profile.id === draft.recipientId)) throw new Error("Vyberte schváleného vlastníka nehnuteľnosti.");
  if (draft.youtubeUrl && !youtubeVideoId(draft.youtubeUrl)) throw new Error("YouTube odkaz nie je v podporovanom formáte.");
  if (draft.files.length + draft.keptPaths.length > 10) throw new Error("K jednej udalosti môžete priložiť najviac 10 fotografií.");
  for (const file of draft.files) {
    if (!SVB_PROBLEM_IMAGE_TYPES[file.type]) throw new Error("Podporované fotografie: JPG, PNG, WebP a GIF.");
    if (!file.size || file.size > 10 * 1024 * 1024) throw new Error("Každá fotografia musí mať najviac 10 MB a nesmie byť prázdna.");
  }
}

async function saveSvbProblem(item = null) {
  if (!canManageSvbProblems() || !hasSvbProblemAcknowledgement()) return;
  const uploaded = [];
  let committed = false;
  try {
    if (!supabaseClient || !state.currentUserId) throw new Error("Na uloženie udalosti je potrebné pripojenie a prihlásenie.");
    const draft = {
      title: dialogBody.querySelector("#title").value.trim(), body: dialogBody.querySelector("#note").value.trim(),
      scope: dialogBody.querySelector("#problemScope").value, recipientId: dialogBody.querySelector("#problemRecipient").value,
      youtubeUrl: dialogBody.querySelector("#youtubeUrl").value.trim(),
      files: [...dialogBody.querySelector("#problemPhotos").files],
      keptPaths: [...dialogBody.querySelectorAll("[data-problem-keep-photo]:checked")].map((input) => input.value),
      showInAlbum: dialogBody.querySelector("#problemShowInAlbum").checked
    };
    validateSvbProblemDraft(draft, svbProblemRecipients());
    // Keep the create id across retries so an uncertain network response cannot duplicate the event.
    const id = item?.id || dialog.dataset.problemDraftId || crypto.randomUUID();
    dialog.dataset.problemDraftId = id;
    if (!item) {
      const existing = assertSupabaseOk(await supabaseClient.from("svb_problems").select("id").eq("id", id).maybeSingle());
      if (existing.data) {
        dialog.close();
        await loadSupabaseData();
        render();
        window.alert("Táto udalosť už bola uložená. Skontrolujte ju v zozname; duplicitný záznam nevznikol.");
        return;
      }
    }
    for (const file of draft.files) {
      const path = `${id}/${crypto.randomUUID()}.${SVB_PROBLEM_IMAGE_TYPES[file.type]}`;
      assertSupabaseOk(await supabaseClient.storage.from(SVB_PROBLEM_BUCKET).upload(path, file, { contentType: file.type, upsert: false }));
      uploaded.push(path);
    }
    const payload = { title: draft.title, body: draft.body, recipient_id: draft.scope === "private" ? draft.recipientId : null,
      youtube_url: draft.youtubeUrl || null, photo_paths: [...draft.keptPaths, ...uploaded], show_in_album: draft.showInAlbum };
    const result = item
      ? await supabaseClient.from("svb_problems").update(payload).eq("id", id).select("id").single()
      : await supabaseClient.from("svb_problems").insert({ id, created_by: state.currentUserId, ...payload }).select("id").single();
    assertSupabaseOk(result);
    committed = true;
    if (item) {
      const removed = item.photos.map((photo) => photo.path).filter((path) => !draft.keptPaths.includes(path));
      if (removed.length) await supabaseClient.storage.from(SVB_PROBLEM_BUCKET).remove(removed);
    } else {
      await notifyByChoice("Nová udalosť: Problémy SVB", "Dôverná informácia v Problémoch SVB", "Obsah je dostupný po prihlásení a potvrdení pravidiel dôvernosti v aplikácii.",
        payload.recipient_id ? { target: "individual", ownerId: payload.recipient_id } : { target: "all" },
        "svb_problems", id, { templateKey: "svb-problem", appNotification: true });
    }
    await writeActivityLog(item ? "update" : "create", `${item ? "Úprava" : "Vytvorenie"} udalosti Problémy SVB`, {
      relatedTable: "svb_problems", relatedId: id, metadata: { view: "problems" }
    });
    dialog.close();
    await loadSupabaseData();
    render();
  } catch (error) {
    // Do not remove uploaded files after an ambiguous insert response: the row may already reference them.
    if (!committed && uploaded.length) {
      const check = await supabaseClient.from("svb_problems").select("photo_paths").eq("id", item?.id || dialog.dataset.problemDraftId).maybeSingle();
      if (!check.error) {
        const unused = uploaded.filter((path) => !check.data?.photo_paths?.includes(path));
        if (unused.length) await supabaseClient.storage.from(SVB_PROBLEM_BUCKET).remove(unused);
      }
    }
    window.alert(`${committed ? "Udalosť je uložená, ale obnovenie zobrazenia zlyhalo" : "Uloženie zlyhalo"}: ${error.message}`);
  }
}

async function deleteSvbProblem(item) {
  if (!canManageSvbProblems()) throw new Error("Na vymazanie nemáte oprávnenie.");
  assertSupabaseOk(await supabaseClient.from("svb_problems").delete().eq("id", item.id).select("id").single());
  if (item.photos.length) await supabaseClient.storage.from(SVB_PROBLEM_BUCKET).remove(item.photos.map((photo) => photo.path));
}
