import '@testing-library/jest-dom';
import React from 'react';

// Global fetch mock (avoids real network in unit tests)
if (!(global as any).fetch) {
  (global as any).fetch = async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) });
}

// Basic Next.js router stubs (if used in components)
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));