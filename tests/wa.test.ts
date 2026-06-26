import { describe, it, expect } from 'vitest';
import { waURL, buildContactMessage } from '../src/lib/wa';

describe('wa', () => {
  it('builds a wa.me url with encoded text', () => {
    expect(waURL('5531999485816', 'olá mundo')).toBe(
      'https://wa.me/5531999485816?text=ol%C3%A1%20mundo',
    );
  });

  it('composes a message with name + company + segment', () => {
    const m = buildContactMessage({ nome: 'Ana', empresa: 'ACME', seg: 'Mineração', msg: 'reduzir paradas' });
    expect(m).toContain('Sou Ana, da ACME.');
    expect(m).toContain('Segmento: Mineração.');
    expect(m).toContain('Desafio: reduzir paradas');
  });

  it('falls back gracefully with no input', () => {
    expect(buildContactMessage({})).toContain('Segmento: a definir.');
  });
});
