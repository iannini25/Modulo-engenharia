import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

describe('build output', () => {
  it('produces a home page with the key sections', () => {
    const p = 'dist/index.html';
    expect(existsSync(p), 'run `npm run build` first').toBe(true);
    const html = readFileSync(p, 'utf8');
    expect(html).toContain('id="servicos"');
    expect(html).toContain('id="contato"');
    expect(html).toContain('id="equipamentos"');
  });
});
