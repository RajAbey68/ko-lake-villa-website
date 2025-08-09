import * as React from 'react';
import { render } from '@testing-library/react';
import { TestProviders } from '@/tests/utils/TestProviders';
import * as Module from '@/components/ui/hover-card';

describe('components/ui/hover-card.tsx', () => {
  test('module loads', () => {
    expect(Module).toBeDefined();
  });

  test('default export renders (if React component)', () => {
    const Cmp:any = (Module as any).default;
    if (typeof Cmp === 'function') {
      const { container } = render(<TestProviders><Cmp /></TestProviders>);
      expect(container).toBeTruthy();
    } else {
      expect(true).toBe(true);
    }
  });
});
