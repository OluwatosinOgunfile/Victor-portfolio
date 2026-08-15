import nodemailer from "nodemailer";
import { createServiceClient } from "./supabase-server";
import { escapeHtml, siteUrl } from "./security";

async function record(enquiryId: string, channel: "whatsapp" | "email", status: "queued" | "sent" | "failed", providerId?: string, error?: unknown) {
  const db = createServiceClient();
  await db.from("notification_deliveries").insert({ enquiry_id: enquiryId, channel, status, provider_id: providerId ?? null, error_message: error instanceof Error ? error.message.slice(0, 500) : error ? String(error).slice(0, 500) : null });
}

async function sendWhatsApp(enquiryId: string, name: string, link: string) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_WHATSAPP_FROM: from, TWILIO_WHATSAPP_TO: to, TWILIO_CONTENT_SID: contentSid } = process.env;
  if (!sid || !token || !from || !to) throw new Error("Twilio WhatsApp is not configured");
  const body = new URLSearchParams({ From: from, To: to });
  body.set("StatusCallback", `${siteUrl()}/api/twilio/status`);
  if (contentSid) { body.set("ContentSid", contentSid); body.set("ContentVariables", JSON.stringify({ 1: name, 2: link })); }
  else body.set("Body", `New portfolio enquiry from ${name}. View securely: ${link}`);
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Twilio rejected the message");
  await record(enquiryId, "whatsapp", "queued", result.sid);
}

async function sendEmail(enquiryId: string, name: string, link: string) {
  const user = process.env.GMAIL_SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("Gmail SMTP is not configured");
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  const safeName = escapeHtml(name); const safeLink = escapeHtml(link);
  const info = await transport.sendMail({ from: `Navill Tech <${user}>`, to: process.env.ADMIN_EMAIL || user, subject: `New project enquiry from ${name.replace(/[\r\n]/g, " ")}`, text: `A new project enquiry has arrived from ${name}. Sign in to view it securely: ${link}`, html: `<p>A new project enquiry has arrived from <strong>${safeName}</strong>.</p><p><a href="${safeLink}">Sign in to view the enquiry securely</a></p>` });
  await record(enquiryId, "email", "sent", info.messageId);
}

export async function notifyNewEnquiry(enquiryId: string, name: string) {
  const link = `${siteUrl()}/admin/enquiries/${enquiryId}`;
  try { await sendWhatsApp(enquiryId, name, link); return { channel: "whatsapp", sent: true }; }
  catch (error) {
    await record(enquiryId, "whatsapp", "failed", undefined, error);
    try { await sendEmail(enquiryId, name, link); return { channel: "email", sent: true }; }
    catch (emailError) { await record(enquiryId, "email", "failed", undefined, emailError); return { channel: null, sent: false }; }
  }
}

export async function sendVisitorConfirmation(email: string, name: string) {
  const user = process.env.GMAIL_SMTP_USER; const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return false;
  const safeName = escapeHtml(name);
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await transport.sendMail({ from: `Navill Tech <${user}>`, to: email, replyTo: process.env.ADMIN_EMAIL || user, subject: "We received your project enquiry", text: `Hello ${name},\n\nThank you for contacting Navill Tech. Your project enquiry has been received and Victor will review it shortly. You can expect a response within 24 hours.\n\nNavill Tech`, html: `<p>Hello ${safeName},</p><p>Thank you for contacting Navill Tech. Your project enquiry has been received and Victor will review it shortly.</p><p>You can expect a response within 24 hours.</p><p>Navill Tech</p>` });
  return true;
}
