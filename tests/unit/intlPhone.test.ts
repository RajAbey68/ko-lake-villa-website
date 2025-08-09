import { toE164, telHref, mailto } from '@/lib/intlPhone';

describe('International Phone Utilities', () => {
  test('toE164 normalizes Sri Lanka numbers', () => {
    expect(toE164(' +94 71 776 5780 ')).toBe('+94717765780');
  });

  test('toE164 adds + if missing', () => {
    expect(toE164('94 71 776 5780')).toBe('+94717765780');
  });

  test('toE164 preserves existing +', () => {
    expect(toE164('+1 555 123 4567')).toBe('+15551234567');
  });

  test('telHref url-encodes plus', () => {
    expect(telHref('+94 71 173 0345')).toBe('tel:%2B94711730345');
  });

  test('telHref handles numbers without +', () => {
    expect(telHref('94 71 173 0345')).toBe('tel:%2B94711730345');
  });

  test('mailto builds subject and body', () => {
    const m = mailto('stay@kolakevilla.com', 'Hello', 'Body text');
    expect(m).toContain('mailto:stay@kolakevilla.com');
    expect(m).toContain('subject=Hello');
    expect(m).toContain('body=Body+text');
  });

  test('mailto encodes special characters', () => {
    const m = mailto('test@example.com', 'Test & Subject', 'Line 1\nLine 2');
    expect(m).toContain('subject=Test+%26+Subject');
    expect(m).toContain('body=Line+1%0ALine+2');
  });
});