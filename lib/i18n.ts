export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Localized label for a canonical value (e.g. service categories, engine
 * types). Falls back to the canonical value when no translation key exists.
 */
export function localized(t: TranslateFn, prefix: string, value: string): string {
  const key = `${prefix}.${slugify(value)}`;
  const translated = t(key);
  return translated === key ? value : translated;
}
