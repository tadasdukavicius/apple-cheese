// Supabase returns English messages; show Lithuanian ones for the common cases.
const KNOWN: [RegExp, string][] = [
  [/invalid login credentials/i, 'Neteisingas el. paštas arba slaptažodis.'],
  [/email not confirmed/i, 'El. paštas dar nepatvirtintas. Patikrinkite savo pašto dėžutę.'],
  [/already registered|already been registered/i, 'Vartotojas su tokiu el. paštu jau egzistuoja.'],
  [/at least \d+ characters/i, 'Slaptažodis per trumpas (bent 6 simboliai).'],
  [/rate limit|too many/i, 'Per daug bandymų. Pabandykite vėliau.'],
  [/valid email|invalid email/i, 'Įveskite teisingą el. pašto adresą.'],
  [/network|fetch failed|failed to fetch/i, 'Nepavyko prisijungti prie serverio. Patikrinkite ryšį.'],
];

export function translateAuthError(message: string | null | undefined): string | null {
  if (!message) return null;
  return KNOWN.find(([pattern]) => pattern.test(message))?.[1] ?? 'Įvyko klaida. Bandykite dar kartą.';
}
