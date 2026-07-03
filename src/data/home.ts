/* Home (redesign) content: copy from the studio copy-chief (no em-dashes),
   merged with the real contact facts from site.ts. Single source for the
   "Grafite e Brasa" one-page experience. */
import rawCopy from './homeCopy.json';
import { site } from './site';
import { greetingURL } from '../lib/wa';

type SectionCopy = Record<string, any>;
const byId: Record<string, SectionCopy> = Object.fromEntries(
  (rawCopy.sections as { id: string; copy: SectionCopy }[]).map((s) => [s.id, s.copy]),
);

/** copy for a section id (throws early in dev if a section is missing) */
export const copy = byId;

/** primary CTA target: WhatsApp greeting (channel stays primary) */
export const waHref = greetingURL(site.contact.whatsappDigits);

/** anchor nav for the one-page journey */
export const navLinks = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Software', href: '#software' },
  { label: 'Segmentos', href: '#segmentos' },
  { label: 'Campo', href: '#campo' },
  { label: 'Contato', href: '#contato' },
];
