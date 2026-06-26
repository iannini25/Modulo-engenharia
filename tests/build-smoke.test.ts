import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

describe('build output', () => {
  it('produces a home page', () => {
    const p = 'dist/index.html';
    expect(existsSync(p), 'run `npm run build` first').toBe(true);
    expect(readFileSync(p, 'utf8')).toContain('build OK');
  });
});
