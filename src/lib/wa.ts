/* WhatsApp deep-link + message builder. Pure functions (tested). */

export const waURL = (digits: string, text: string): string =>
  `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;

export type ContactInput = { nome?: string; empresa?: string; seg?: string; msg?: string };

export function buildContactMessage(i: ContactInput): string {
  const { nome = '', empresa = '', seg = '', msg = '' } = i;
  const who = nome
    ? empresa
      ? `Sou ${nome}, da ${empresa}.`
      : `Sou ${nome}.`
    : empresa
      ? `Falo pela ${empresa}.`
      : 'Quero falar com a engenharia.';
  const lines = ['Olá, Módulo Engenharia! ◆', who, `Segmento: ${seg || 'a definir'}.`];
  if (msg) lines.push(`Desafio: ${msg}`);
  lines.push('Podemos conversar sobre um projeto?');
  return lines.join('\n');
}

export const greetingURL = (digits: string): string =>
  waURL(digits, 'Olá, Módulo Engenharia! Gostaria de falar com a engenharia.');
