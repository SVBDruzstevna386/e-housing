export function canNotifySvbProblem(sender, problem, target, ownerId, isPlatformAdmin = false) {
  if (!sender || !problem || sender.approval_status !== "approved") return false;
  if (sender.role !== "chair" && !isPlatformAdmin) return false;
  if (problem.created_by !== sender.id) return false;
  return problem.recipient_id
    ? target === "individual" && ownerId === problem.recipient_id
    : target === "all";
}

export function svbProblemNotificationContent(problemId, template = {}, senderName = "SVB") {
  const actionUrl = `https://svbdruzstevna386.e-domovnik.sk/?view=problems&detailType=svbProblem&detailId=${encodeURIComponent(problemId)}`;
  const title = "Dôverná informácia v Problémoch SVB";
  const message = "V aplikácii je pre vás dostupná nová informácia. Obsah, fotografie a video otvoríte až po prihlásení a potvrdení pravidiel dôvernosti.";
  const replacements = { title, message, actionUrl, sender: senderName, section: "Problémy SVB", eventType: "Nová informácia v Problémoch SVB" };
  const fill = (text) => String(text).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => replacements[key] || "");
  return {
    subject: fill(template.subject || "Problémy SVB: nová dôverná informácia"),
    title,
    message: fill(template.body || "Dobrý deň,\n\n{{message}}\n\n{{actionUrl}}\n\n{{sender}}\ne - Housing Solutions Licence"),
    eventType: replacements.eventType, section: replacements.section, actionUrl
  };
}
