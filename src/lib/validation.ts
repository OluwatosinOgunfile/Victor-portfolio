import { z } from "zod";

const clean = (max: number) => z.string().trim().max(max);
export const enquirySchema = z.object({
  name: clean(100).min(2),
  email: z.email().max(254),
  phone: clean(30).optional().default(""),
  preferredContact: z.enum(["Email", "WhatsApp", "Phone"]).default("Email"),
  company: clean(120).optional().default(""),
  service: clean(100).min(1),
  stage: clean(120).optional().default(""),
  message: clean(5000).min(20),
  website: z.string().max(0).optional().default(""),
});

export const analyticsSchema = z.object({
  eventName: z.enum(["page_view", "cta_click", "contact_click", "project_view", "enquiry_conversion"]),
  page: clean(200).default("/"),
  label: clean(120).optional(),
  sessionId: z.string().regex(/^[a-zA-Z0-9-]{8,80}$/),
  referrer: clean(500).optional(),
});

export const adminUpdateSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status"), status: z.enum(["New", "Contacted", "Qualified", "Won", "Closed"]) }),
  z.object({ action: z.literal("read"), isRead: z.boolean() }),
  z.object({ action: z.literal("note"), body: clean(3000).min(1) }),
  z.object({ action: z.literal("lead_details"), priority: z.enum(["Low", "Normal", "High", "Urgent"]), followUpAt: z.iso.datetime().nullable(), tags: z.array(clean(40).min(1)).max(10) }),
  z.object({ action: z.literal("retry") }),
]);
