import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { normalizeNotificationArea, partitionRecipients } from "./notification-preferences.mjs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

type NotificationTarget = "none" | "all" | "individual" | "chair";
type AdminClient = ReturnType<typeof createClient<any>>;
type NotificationRecipient = { profile_id: string | null; name: string; email: string };
type NotificationPreferenceRow = { profile_id: string; area: string; email_enabled: boolean; push_enabled: boolean };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const gmailClientId = Deno.env.get("GMAIL_CLIENT_ID");
  const gmailClientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
  const gmailRefreshToken = Deno.env.get("GMAIL_REFRESH_TOKEN");
  const gmailFromEmail = Deno.env.get("GMAIL_FROM_EMAIL") || "SVBDruzstevna386@gmail.com";
  const gmailFromName = Deno.env.get("GMAIL_FROM_NAME") || "SVB a NP Druzstevna 386";
  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") || "";
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") || "";
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "";
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase service configuration is missing" }, 500);
  if (!token) return json({ error: "Missing authorization token" }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: "Invalid user session" }, 401);

  const { data: sender, error: senderError } = await admin
    .from("profiles")
    .select("id, full_name, role, approval_status")
    .eq("id", userData.user.id)
    .maybeSingle();
  const body = await req.json().catch(() => ({}));
  const target: NotificationTarget = ["none", "all", "individual", "chair"].includes(body.target) ? body.target : "all";
  const subject = String(body.subject || "Nova informacia v e - Housing Solutions Licence").trim();
  const title = String(body.title || "").trim();
  const message = String(body.message || "").trim();
  const eventType = String(body.eventType || subject).trim();
  const section = String(body.section || "Aplikacia").trim();
  const actionUrl = normalizeActionUrl(String(body.actionUrl || "https://svbdruzstevna386.vercel.app/").trim());
  const relatedTable = body.relatedTable ? String(body.relatedTable) : null;
  const relatedId = body.relatedId ? String(body.relatedId) : null;
  const ownerId = body.ownerId ? String(body.ownerId) : "";
  const appNotification = body.appNotification === true;
  const cleaningNotification = body.cleaningNotification === true;
  const registrationNotice = body.registrationNotice === true;
  if (senderError) return json({ error: senderError.message }, 500);
  const isBoardSender = ["chair", "vice_chair", "economic", "board"].includes(sender?.role || "");
  const isMessageToChairNotice = target === "chair" && ["messages", "vote_comments"].includes(relatedTable || "") && Boolean(relatedId);
  const isOwnerAnnouncementNotice = target === "all" && relatedTable === "announcements" && Boolean(relatedId) && sender?.role === "owner";
  const isClassifiedChairNotice = target === "chair" && relatedTable === "classifieds" && Boolean(relatedId);
  const isRepairAllNotice = target === "all" && relatedTable === "messages" && Boolean(relatedId) && appNotification;
  const isPrivateTalkNotice = target === "individual" && relatedTable === "messages" && Boolean(relatedId) && Boolean(ownerId) && appNotification;
  const isCleaningAllNotice = target === "all" && relatedTable === "events" && Boolean(relatedId) && cleaningNotification;
  const isRegistrationPendingNotice = target === "chair"
    && registrationNotice
    && ["profiles", "owner_records"].includes(relatedTable || "")
    && Boolean(relatedId);
  if (!isBoardSender && !isMessageToChairNotice && !isOwnerAnnouncementNotice && !isClassifiedChairNotice && !isRepairAllNotice && !isPrivateTalkNotice && !isCleaningAllNotice && !isRegistrationPendingNotice) return json({ error: "Only chairman or board can send notifications" }, 403);
  if (isRegistrationPendingNotice) {
    if (relatedTable === "profiles") {
      if (!sender || relatedId !== userData.user.id || sender.approval_status === "approved") {
        return json({ error: "Registration notice is allowed only for own pending profile" }, 403);
      }
    }
    if (relatedTable === "owner_records") {
      const { data: ownerRecord, error: ownerRecordError } = await admin
        .from("owner_records")
        .select("id, profile_id, approval_status")
        .eq("id", relatedId)
        .maybeSingle();
      if (ownerRecordError) return json({ error: ownerRecordError.message }, 500);
      if (!ownerRecord || ownerRecord.profile_id !== userData.user.id || ownerRecord.approval_status !== "pending") {
        return json({ error: "Registration notice is allowed only for own pending owner record" }, 403);
      }
    }
  }
  if (isCleaningAllNotice) {
    const { data: relatedEvent, error: relatedEventError } = await admin
      .from("events")
      .select("id, created_by, event_type, owner_record_id")
      .eq("id", relatedId)
      .maybeSingle();
    if (relatedEventError) return json({ error: relatedEventError.message }, 500);
    if (!relatedEvent || relatedEvent.created_by !== userData.user.id || !["cleaning", "cleaning_extra"].includes(relatedEvent.event_type)) {
      return json({ error: "Cleaning notification is allowed only for own cleaning event" }, 403);
    }
    if (!isBoardSender) {
      const { data: ownerRecord, error: ownerRecordError } = await admin
        .from("owner_records")
        .select("id")
        .eq("id", relatedEvent.owner_record_id)
        .eq("profile_id", userData.user.id)
        .eq("approval_status", "approved")
        .eq("can_manage_cleaning_calendar", true)
        .maybeSingle();
      if (ownerRecordError) return json({ error: ownerRecordError.message }, 500);
      if (!ownerRecord) return json({ error: "Cleaning notification permission is not active" }, 403);
    }
  }
  if (isRepairAllNotice) {
    const { data: relatedMessage, error: relatedMessageError } = await admin
      .from("messages")
      .select("id, sender_id, scope")
      .eq("id", relatedId)
      .maybeSingle();
    if (relatedMessageError) return json({ error: relatedMessageError.message }, 500);
    if (!relatedMessage || relatedMessage.sender_id !== userData.user.id || relatedMessage.scope !== "public") {
      return json({ error: "Repair notification is allowed only for own public report" }, 403);
    }
  }
  if (isPrivateTalkNotice) {
    const { data: relatedMessage, error: relatedMessageError } = await admin
      .from("messages")
      .select("id, sender_id, recipient_id, scope, message_section")
      .eq("id", relatedId)
      .maybeSingle();
    if (relatedMessageError) return json({ error: relatedMessageError.message }, 500);
    if (
      !relatedMessage
      || relatedMessage.sender_id !== userData.user.id
      || relatedMessage.recipient_id !== ownerId
      || relatedMessage.scope !== "private"
      || relatedMessage.message_section !== "talk"
    ) {
      return json({ error: "Private notification is allowed only for own direct talk message" }, 403);
    }
    const { data: recipientProfile, error: recipientProfileError } = await admin
      .from("profiles")
      .select("id, approval_status, neighbor_card")
      .eq("id", ownerId)
      .maybeSingle();
    if (recipientProfileError) return json({ error: recipientProfileError.message }, 500);
    if (
      !recipientProfile
      || recipientProfile.approval_status !== "approved"
      || recipientProfile.neighbor_card?.share_messaging === false
    ) {
      return json({ error: "Recipient does not allow direct messages" }, 403);
    }
  }
  if (!isBoardSender && isClassifiedChairNotice) {
    const { data: relatedClassified, error: relatedClassifiedError } = await admin
      .from("classifieds")
      .select("id, created_by")
      .eq("id", relatedId)
      .maybeSingle();
    if (relatedClassifiedError) return json({ error: relatedClassifiedError.message }, 500);
    if (!relatedClassified || relatedClassified.created_by !== userData.user.id) {
      return json({ error: "Classified notification is allowed only for own classified item" }, 403);
    }
  }
  if (isOwnerAnnouncementNotice) {
    const { data: relatedAnnouncement, error: relatedAnnouncementError } = await admin
      .from("announcements")
      .select("id, created_by, category")
      .eq("id", relatedId)
      .maybeSingle();
    if (relatedAnnouncementError) return json({ error: relatedAnnouncementError.message }, 500);
    if (!relatedAnnouncement || relatedAnnouncement.created_by !== userData.user.id || relatedAnnouncement.category !== "Oznam") {
      return json({ error: "Owner announcement notification is allowed only for own Oznam announcement" }, 403);
    }
  }
  if (!isBoardSender && isMessageToChairNotice) {
    if (relatedTable === "messages") {
      const { data: relatedMessage, error: relatedMessageError } = await admin
        .from("messages")
        .select("id, sender_id")
        .eq("id", relatedId)
        .maybeSingle();
      if (relatedMessageError) return json({ error: relatedMessageError.message }, 500);
      if (!relatedMessage || relatedMessage.sender_id !== userData.user.id) {
        return json({ error: "Message notification is allowed only for own message" }, 403);
      }
    }
    if (relatedTable === "vote_comments") {
      const { data: relatedComment, error: relatedCommentError } = await admin
        .from("vote_comments")
        .select("id, profile_id, visibility")
        .eq("id", relatedId)
        .maybeSingle();
      if (relatedCommentError) return json({ error: relatedCommentError.message }, 500);
      if (!relatedComment || relatedComment.profile_id !== userData.user.id || relatedComment.visibility !== "private_chair") {
        return json({ error: "Vote comment notification is allowed only for own private comment to chairman" }, 403);
      }
    }
  }

  if (target === "none") {
    const notificationArea = await resolveNotificationArea(admin, relatedTable, relatedId);
    await logNotification(admin, { subject, error: "Email nebol odoslany podla volby pouzivatela.", relatedTable, relatedId, notificationArea });
    return json({ skipped: true, recipients: 0 });
  }

  let recipients: NotificationRecipient[];
  let notificationArea: string;
  let preferenceRows: NotificationPreferenceRow[];
  try {
    recipients = await resolveRecipients(admin, target, ownerId);
    notificationArea = await resolveNotificationArea(admin, relatedTable, relatedId);
    preferenceRows = await resolveRecipientPreferences(admin, recipients, notificationArea);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Notification preferences could not be resolved" }, 500);
  }
  if (!recipients.length) {
    await logNotification(admin, { subject, error: "Nenasiel sa ziadny prijemca emailu.", relatedTable, relatedId, notificationArea });
    return json({ sent: 0, recipients: 0 });
  }

  const { emailRecipients, pushRecipients } = partitionRecipients(recipients, preferenceRows, notificationArea) as {
    emailRecipients: NotificationRecipient[];
    pushRecipients: NotificationRecipient[];
  };
  const pushResult = pushRecipients.length
    ? await sendWebPush({
        admin,
        recipients: pushRecipients,
        subject,
        title,
        section,
        actionUrl,
        relatedTable,
        relatedId,
        vapidPublicKey,
        vapidPrivateKey,
        vapidSubject
      })
    : emptyPushResult();

  if (!emailRecipients.length && !pushRecipients.length) {
    return json({
      skipped: true,
      recipients: recipients.length,
      emailRecipients: 0,
      pushRecipients: 0,
      sent: 0,
      pushSent: 0,
      pushAttempted: 0,
      pushErrors: []
    });
  }

  if (emailRecipients.length && (!gmailClientId || !gmailClientSecret || !gmailRefreshToken)) {
    await Promise.all(emailRecipients.map((recipient) => logNotification(admin, {
      recipientId: recipient.profile_id,
      subject,
      error: "Gmail API nie je nakonfigurovane.",
      relatedTable,
      relatedId,
      notificationArea
    })));
    await Promise.all(pushRecipients
      .filter((recipient) => recipient.profile_id && pushResult.successfulProfiles.has(recipient.profile_id))
      .map((recipient) => logNotification(admin, {
        recipientId: recipient.profile_id,
        subject,
        channel: "web_push",
        relatedTable,
        relatedId,
        notificationArea
      })));
    return json({
      sent: 0,
      recipients: recipients.length,
      emailRecipients: emailRecipients.length,
      pushRecipients: pushRecipients.length,
      pushSent: pushResult.sent,
      pushAttempted: pushResult.attempted,
      pushErrors: pushResult.errors,
      error: "Gmail API configuration missing"
    }, 500);
  }

  const html = emailRecipients.length
    ? renderEmail({ subject, title, message, senderName: sender?.full_name || "SVB", eventType, section, actionUrl })
    : "";
  let sent = 0;
  const errors: string[] = [];

  for (const recipient of emailRecipients) {
    const result = await sendGmail({
      clientId: gmailClientId!,
      clientSecret: gmailClientSecret!,
      refreshToken: gmailRefreshToken!,
      fromEmail: gmailFromEmail,
      fromName: gmailFromName,
      to: recipient.email,
      subject,
      html
    });

    if (result.ok) {
      sent += 1;
      const pushDelivered = Boolean(recipient.profile_id && pushResult.successfulProfiles.has(recipient.profile_id));
      await logNotification(admin, {
        recipientId: recipient.profile_id,
        subject,
        channel: pushDelivered ? "email_web_push" : "email",
        relatedTable,
        relatedId,
        notificationArea
      });
    } else {
      const error = `Gmail API: ${result.error}`;
      errors.push(error);
      await logNotification(admin, { recipientId: recipient.profile_id, subject, error, relatedTable, relatedId, notificationArea });
      if (recipient.profile_id && pushResult.successfulProfiles.has(recipient.profile_id)) {
        await logNotification(admin, { recipientId: recipient.profile_id, subject, channel: "web_push", relatedTable, relatedId, notificationArea });
      }
    }
  }

  const emailProfileIds = new Set(emailRecipients.map((recipient) => recipient.profile_id).filter(Boolean));
  await Promise.all(pushRecipients
    .filter((recipient) => recipient.profile_id && !emailProfileIds.has(recipient.profile_id) && pushResult.successfulProfiles.has(recipient.profile_id))
    .map((recipient) => logNotification(admin, {
      recipientId: recipient.profile_id,
      subject,
      channel: "web_push",
      relatedTable,
      relatedId,
      notificationArea
    })));

  const errorSummary = errors.length ? errors[0] : null;
  return json({
    sent,
    recipients: recipients.length,
    emailRecipients: emailRecipients.length,
    pushRecipients: pushRecipients.length,
    errors,
    error: errorSummary,
    pushSent: pushResult.sent,
    pushAttempted: pushResult.attempted,
    pushErrors: pushResult.errors
  });
});

const STATIC_NOTIFICATION_AREAS: Record<string, string> = {
  announcements: "overview",
  app_settings: "overview",
  profiles: "overview",
  owner_records: "overview",
  votes: "votes",
  vote_comments: "votes",
  billing_settlements: "billing",
  execution_cases: "executions",
  finance_entries: "finance",
  innovation_ideas: "finance",
  innovation_comments: "finance",
  events: "calendar",
  activities: "activities",
  photos: "photo_album",
  classifieds: "classifieds"
};

async function resolveNotificationArea(
  admin: AdminClient,
  relatedTable: string | null,
  relatedId: string | null
) {
  if (relatedTable === "documents") {
    if (!relatedId) return "documents";
    const { data, error } = await admin
      .from("documents")
      .select("is_history, published_at")
      .eq("id", relatedId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return "documents";
    const publishedYear = data.published_at ? new Date(data.published_at).getUTCFullYear() : null;
    return data.is_history || (publishedYear !== null && publishedYear !== new Date().getUTCFullYear())
      ? "document_history"
      : "documents";
  }

  if (relatedTable === "messages") {
    if (!relatedId) return "messages";
    const { data, error } = await admin
      .from("messages")
      .select("message_section")
      .eq("id", relatedId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.message_section === "talk" ? "talk" : "messages";
  }

  return normalizeNotificationArea(STATIC_NOTIFICATION_AREAS[relatedTable || ""] || "overview");
}

async function resolveRecipientPreferences(
  admin: AdminClient,
  recipients: NotificationRecipient[],
  notificationArea: string
): Promise<NotificationPreferenceRow[]> {
  const profileIds = [...new Set(recipients.map((recipient) => recipient.profile_id).filter(Boolean))] as string[];
  if (!profileIds.length) return [];
  const { data, error } = await admin
    .from("notification_preferences")
    .select("profile_id, area, email_enabled, push_enabled")
    .in("profile_id", profileIds)
    .eq("area", notificationArea);
  if (error) throw new Error(error.message);
  return (data || []) as NotificationPreferenceRow[];
}

async function resolveRecipients(admin: AdminClient, target: NotificationTarget, ownerId: string): Promise<NotificationRecipient[]> {
  if (target === "chair") {
    const { data, error } = await admin
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("role", "chair")
      .not("email", "is", null);
    if (error) throw new Error(error.message);
    return (data || [])
      .map((profile) => ({
        profile_id: profile.id,
        name: profile.full_name,
        email: String(profile.email || "").trim()
      }))
      .filter((profile) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email));
  }

  if (target === "individual") {
    const { data, error } = await admin
      .from("profiles")
      .select("id, full_name, email, approval_status")
      .eq("id", ownerId)
      .eq("approval_status", "approved")
      .not("email", "is", null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const email = String(data?.email || "").trim();
    if (!data || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return [];
    return [{ profile_id: data.id, name: data.full_name, email }];
  }

  let query = admin
    .from("owner_records")
    .select("id, profile_id, full_name, login_email, approval_status")
    .eq("approval_status", "approved")
    .not("login_email", "is", null);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const recipients = (data || [])
    .map((owner) => ({
      profile_id: owner.profile_id,
      name: owner.full_name,
      email: String(owner.login_email || "").trim()
    }))
    .filter((owner) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email));
  const uniqueRecipients = new Map<string, NotificationRecipient>();
  for (const recipient of recipients) {
    const key = recipient.profile_id || recipient.email.toLowerCase();
    if (!uniqueRecipients.has(key)) uniqueRecipients.set(key, recipient);
  }
  return [...uniqueRecipients.values()];
}

function emptyPushResult() {
  return { sent: 0, attempted: 0, errors: [] as string[], successfulProfiles: new Set<string>() };
}

async function sendWebPush(params: {
  admin: AdminClient;
  recipients: NotificationRecipient[];
  subject: string;
  title: string;
  section: string;
  actionUrl: string;
  relatedTable: string | null;
  relatedId: string | null;
  vapidPublicKey: string;
  vapidPrivateKey: string;
  vapidSubject: string;
}) {
  const result = emptyPushResult();
  if (!params.vapidPublicKey || !params.vapidPrivateKey || !params.vapidSubject) {
    result.errors.push("VAPID configuration missing");
    return result;
  }

  const profileIds = [...new Set(params.recipients.map((recipient) => recipient.profile_id).filter(Boolean))] as string[];
  if (!profileIds.length) return result;

  const { data: subscriptions, error } = await params.admin
    .from("push_subscriptions")
    .select("id, profile_id, endpoint, p256dh, auth")
    .in("profile_id", profileIds);
  if (error) {
    result.errors.push(error.message);
    return result;
  }

  const payload = JSON.stringify({
    title: params.subject || "Nová informácia",
    body: params.title ? `${params.section}: ${params.title}` : `Nová informácia v záložke ${params.section}.`,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: pushTopic(params.relatedTable, params.relatedId),
    url: params.actionUrl,
    timestamp: Date.now()
  });

  for (const subscription of subscriptions || []) {
    result.attempted += 1;
    try {
      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth }
      }, payload, {
        vapidDetails: {
          subject: params.vapidSubject,
          publicKey: params.vapidPublicKey,
          privateKey: params.vapidPrivateKey
        },
        TTL: 86400,
        urgency: "high",
        topic: pushTopic(params.relatedTable, params.relatedId)
      });
      result.sent += 1;
      result.successfulProfiles.add(subscription.profile_id);
      await params.admin
        .from("push_subscriptions")
        .update({ last_success_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", subscription.id);
    } catch (error) {
      const statusCode = Number((error as { statusCode?: number })?.statusCode || 0);
      result.errors.push(statusCode ? `Web Push HTTP ${statusCode}` : "Web Push delivery failed");
      if ([404, 410].includes(statusCode)) {
        await params.admin.from("push_subscriptions").delete().eq("id", subscription.id);
      }
    }
  }

  return result;
}

function pushTopic(relatedTable: string | null, relatedId: string | null) {
  return `eh-${relatedTable || "app"}-${relatedId || "notice"}`
    .replace(/[^A-Za-z0-9_-]/g, "-")
    .slice(0, 32);
}

async function logNotification(
  admin: AdminClient,
  params: { recipientId?: string | null; subject: string; channel?: string; error?: string | null; relatedTable?: string | null; relatedId?: string | null; notificationArea?: string | null }
) {
  await admin.from("notification_log").insert({
    recipient_id: params.recipientId || null,
    subject: params.subject,
    channel: params.channel || "email",
    related_table: params.relatedTable || null,
    related_id: params.relatedId || null,
    notification_area: params.notificationArea || null,
    sent_at: params.error ? null : new Date().toISOString(),
    error: params.error || null
  });
}

async function sendGmail(params: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  fromEmail: string;
  fromName: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      refresh_token: params.refreshToken,
      grant_type: "refresh_token"
    })
  });

  if (!tokenResponse.ok) {
    const tokenError = await tokenResponse.text();
    if (tokenError.includes("invalid_grant")) {
      return { ok: false, error: "Gmail autorizacia expirovala alebo bola odvolana. Obnovte Gmail OAuth suhlas pre odosielaci ucet." };
    }
    return { ok: false, error: `token ${tokenResponse.status}: ${tokenError}` };
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) return { ok: false, error: "token response missing access_token" };

  const raw = buildMimeMessage({
    from: `${mimeWord(params.fromName)} <${params.fromEmail}>`,
    to: params.to,
    subject: params.subject,
    html: params.html
  });

  const sendResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw })
  });

  const responseText = await sendResponse.text();
  if (!sendResponse.ok) return { ok: false, error: `send ${sendResponse.status}: ${responseText}` };

  const responseData = responseText ? JSON.parse(responseText) : {};
  return { ok: true, id: responseData.id };
}

function buildMimeMessage({ from, to, subject, html }: { from: string; to: string; subject: string; html: string }) {
  const htmlBase64 = base64Encode(html);
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${mimeWord(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    htmlBase64
  ].join("\r\n");

  return base64UrlEncode(message);
}

function mimeWord(value: string) {
  return `=?UTF-8?B?${base64Encode(value)}?=`;
}

function base64Encode(value: string) {
  return bytesToBase64(new TextEncoder().encode(value));
}

function base64UrlEncode(value: string) {
  return base64Encode(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.slice(index, index + 0x8000));
  }
  return btoa(binary);
}

function renderEmail({ subject, title, message, senderName, eventType, section, actionUrl }: { subject: string; title: string; message: string; senderName: string; eventType: string; section: string; actionUrl: string }) {
  const safeSubject = escapeHtml(subject);
  const safeTitle = escapeHtml(title || subject);
  const safeMessage = escapeHtml(message || "V aplikacii e - Housing Solutions Licence pribudla nova informacia.").replace(/\n/g, "<br>");
  const safeSender = escapeHtml(senderName);
  const safeEventType = escapeHtml(eventType || subject);
  const safeSection = escapeHtml(section || "Aplikacia");
  const safeActionUrl = escapeAttr(actionUrl || "https://svbdruzstevna386.vercel.app/");
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1c3034">
      <h2>${safeSubject}</h2>
      <div style="margin:16px 0;padding:14px 16px;border:1px solid #d9e4e6;border-radius:10px;background:#f7faf9">
        <p style="margin:0 0 6px 0"><strong>Typ udalosti:</strong> ${safeEventType}</p>
        <p style="margin:0"><strong>Zalozka v aplikacii:</strong> ${safeSection}</p>
      </div>
      <p><strong>${safeTitle}</strong></p>
      <p>${safeMessage}</p>
      <p style="color:#607277">Odosielatel: ${safeSender}</p>
      <p style="margin:22px 0">
        <a href="${safeActionUrl}" style="display:inline-block;background:#1f6f78;color:#ffffff;text-decoration:none;padding:11px 16px;border-radius:8px;font-weight:bold">Otvorit detail v e - Housing Solutions Licence</a>
      </p>
      <p style="font-size:12px;color:#607277">Ak tlacidlo nefunguje, otvorte tento odkaz: <br><a href="${safeActionUrl}" style="color:#1f6f78">${safeActionUrl}</a></p>
    </div>
  `;
}

function normalizeActionUrl(value: string) {
  try {
    const url = new URL(value || "https://svbdruzstevna386.vercel.app/");
    const allowedHosts = ["svbdruzstevna386.vercel.app", "svbdruzstevna386.e-domovnik.sk", "e-housing-zeta.vercel.app"];
    if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname)) return "https://svbdruzstevna386.vercel.app/";
    return url.toString();
  } catch {
    return "https://svbdruzstevna386.vercel.app/";
  }
}

function escapeAttr(value: string) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
