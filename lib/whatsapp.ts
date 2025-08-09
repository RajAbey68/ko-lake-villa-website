export function waLink(phoneE164: string, message: string) {
  const p = phoneE164.replace(/[^\d]/g, '');
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}