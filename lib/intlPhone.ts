export function toE164(raw: string): string {
  // Keep leading + and digits
  const d = raw.trim().replace(/[^\d+]/g, '');
  if (!d.startsWith('+')) return '+' + d.replace(/\D/g,'');
  return d.replace(/[^\d+]/g,'');
}

export function telHref(raw: string): string {
  return `tel:${toE164(raw).replace('+','%2B')}`;
}

export function mailto(address: string, subject: string, body: string) {
  const q = new URLSearchParams({ subject, body }).toString();
  return `mailto:${address}?${q}`;
}