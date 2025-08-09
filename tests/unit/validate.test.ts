import { ContactSchema, allowedOrigin } from '@/lib/validate';

describe('ContactSchema', () => {
  it('accepts valid payload', () => {
    expect(() => ContactSchema.parse({ name: 'A', email: 'a@b.com', message: 'hi' })).not.toThrow();
  });
  it('rejects invalid email', () => {
    expect(() => ContactSchema.parse({ name: 'A', email: 'nope', message: 'hi' })).toThrow();
  });
});

describe('allowedOrigin', () => {
  const OLD = process.env.ALLOWED_ORIGINS;
  beforeAll(() => { process.env.ALLOWED_ORIGINS = 'http://127.0.0.1:3000,https://ko-lake-villa.vercel.app'; });
  afterAll(() => { process.env.ALLOWED_ORIGINS = OLD; });

  it('allows configured origins', () => {
    expect(allowedOrigin('http://127.0.0.1:3000')).toBe(true);
  });
  it('blocks unknown origins', () => {
    expect(allowedOrigin('https://evil.example')).toBe(false);
  });
});