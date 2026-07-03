/**
 * Ignite: wrap the first occurrence of `phrase` in the copy with
 * <em class="u-ember"> so it lights up in the brand accent (the "ember").
 *
 * Uses a STRING match (never a RegExp) plus a function replacer, so a phrase
 * that is a literal ".", "$", "R$ 4.800" etc. is matched verbatim and cannot
 * corrupt the output via $-sequences. Warns in dev if the phrase is absent,
 * that means a copy edit silently dropped the accent (the failure mode the
 * hardcoded string-literal version had).
 */
export function ignite(text: string, phrase: string): string {
  if (!phrase || !text.includes(phrase)) {
    if (import.meta.env?.DEV) {
      console.warn(`[ignite] accent phrase not found in copy: ${JSON.stringify(phrase)}`);
    }
    return text;
  }
  return text.replace(phrase, (match) => `<em class="u-ember">${match}</em>`);
}
