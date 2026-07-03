import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

describe('build output', () => {
  it('produces a home page with the key sections', () => {
    const p = 'dist/index.html';
    expect(existsSync(p), 'run `npm run build` first').toBe(true);
    const html = readFileSync(p, 'utf8');
    // the "Grafite e Brasa" one-page journey anchors (nav + hero)
    for (const id of ['inicio', 'servicos', 'software', 'segmentos', 'campo', 'contato']) {
      expect(html, `missing home section: #${id}`).toContain(`id="${id}"`);
    }
  });

  it('builds all internal pages', () => {
    for (const slug of ['mineracao', 'siderurgia', 'offshore', 'energia', 'servicos', 'sobre', 'contato', 'biblioteca']) {
      expect(existsSync(`dist/${slug}/index.html`), `missing page: ${slug}`).toBe(true);
    }
  });

  it('segment page contains its title', () => {
    const html = readFileSync('dist/mineracao/index.html', 'utf8');
    expect(html).toContain('Mineração');
    expect(html).toContain('COMO ATUAMOS');
  });
});
