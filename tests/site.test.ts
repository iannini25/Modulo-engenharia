import { describe, it, expect } from 'vitest';
import { site } from '../src/data/site';

describe('site.ts content model', () => {
  it('flags the WhatsApp number as an unconfirmed placeholder', () => {
    expect(site.contact.whatsappConfirmed).toBe(false);
    expect(site.contact.whatsappDigits).toBe('5531999485816');
  });

  it('has all four segments with non-empty copy', () => {
    for (const k of ['mineracao', 'siderurgia', 'offshore', 'energia'] as const) {
      const s = site.segments[k];
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(20);
      expect(s.capabilities.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('marks illustrative metrics and keeps "4 segmentos" real', () => {
    const seg = site.metrics.find((m) => /segmento/i.test(m.label));
    expect(seg?.illustrative).toBe(false);
    expect(site.metrics.some((m) => m.illustrative)).toBe(true);
  });

  it('records media provenance without share-alike licenses', () => {
    expect(site.media.length).toBeGreaterThan(0);
    for (const m of site.media) expect(m.license).not.toMatch(/BY-SA|ShareAlike/i);
  });
});
