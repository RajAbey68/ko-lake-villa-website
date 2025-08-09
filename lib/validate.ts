import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
  source: z.string().optional()
});
export type ContactPayload = z.infer<typeof ContactSchema>;

export function allowedOrigin(origin?: string | null) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    const allow = (process.env.ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean);
    if (!allow.length) return true; // permissive until configured
    return allow.includes(u.origin);
  } catch { return false; }
}