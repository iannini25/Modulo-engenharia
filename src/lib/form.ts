/* Web3Forms payload builder + honeypot check. Pure functions (tested). */

export type FormFields = {
  nome?: string;
  email?: string;
  empresa?: string;
  segmento?: string;
  msg?: string;
  botcheck?: string;
};

const PLACEHOLDER_KEY = 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER';

export const hasRealKey = (key: string): boolean => !!key && key !== PLACEHOLDER_KEY;

export function buildWeb3FormsPayload(key: string, f: FormFields): Record<string, string> {
  return {
    access_key: key,
    subject: `Novo contato pelo site — Módulo Engenharia${f.segmento ? ` (${f.segmento})` : ''}`,
    from_name: f.nome || 'Site Módulo Engenharia',
    nome: f.nome || '',
    email: f.email || '',
    empresa: f.empresa || '',
    segmento: f.segmento || '',
    mensagem: f.msg || '',
    botcheck: f.botcheck || '',
  };
}

export function isSpam(f: { botcheck?: string }): boolean {
  return !!(f.botcheck && f.botcheck.trim() !== '');
}
