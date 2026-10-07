export const NOTIFICATION_AREAS = Object.freeze([
  "overview",
  "votes",
  "billing",
  "documents",
  "document_history",
  "executions",
  "finance",
  "messages",
  "calendar",
  "activities",
  "photo_album",
  "classifieds",
  "talk"
]);

export const REQUIRED_NOTIFICATION_AREAS = new Set(["overview", "votes", "billing"]);

export function normalizeNotificationArea(value) {
  return NOTIFICATION_AREAS.includes(value) ? value : "overview";
}

export function partitionRecipients(recipients, preferenceRows, areaValue) {
  const area = normalizeNotificationArea(areaValue);
  const required = REQUIRED_NOTIFICATION_AREAS.has(area);
  const preferencesByProfile = new Map(
    preferenceRows.map((row) => [row.profile_id, row])
  );

  return {
    emailRecipients: recipients.filter((recipient) => {
      if (required || !recipient.profile_id) return true;
      return preferencesByProfile.get(recipient.profile_id)?.email_enabled === true;
    }),
    pushRecipients: recipients.filter((recipient) => {
      if (!recipient.profile_id) return false;
      if (required) return true;
      return preferencesByProfile.get(recipient.profile_id)?.push_enabled === true;
    })
  };
}
