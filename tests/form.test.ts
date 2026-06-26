import { describe, it, expect } from 'vitest';
import { buildWeb3FormsPayload, isSpam, hasRealKey } from '../src/lib/form';

describe('form', () => {
  it('includes the access key, honeypot and a branded subject', () => {
    const p = buildWeb3FormsPayload('KEY', { nome: 'Ana', email: 'a@b.com', msg: 'oi', segmento: 'Mineração' });
    expect(p.access_key).toBe('KEY');
    expect(p).toHaveProperty('botcheck');
    expect(p.subject).toMatch(/Módulo/);
    expect(p.subject).toMatch(/Mineração/);
    expect(p.email).toBe('a@b.com');
  });

  it('flags spam only when the honeypot is filled', () => {
    expect(isSpam({ botcheck: 'x' })).toBe(true);
    expect(isSpam({ botcheck: '' })).toBe(false);
    expect(isSpam({})).toBe(false);
  });

  it('detects the unconfigured placeholder key', () => {
    expect(hasRealKey('WEB3FORMS_ACCESS_KEY_PLACEHOLDER')).toBe(false);
    expect(hasRealKey('a1b2c3-real-key')).toBe(true);
  });
});
