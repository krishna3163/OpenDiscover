/**
 * Demo configuration.
 *
 * The login flow in this project is a **simulation** — there is no backend.
 * Nothing here is a secret, and nothing here grants real access.
 *
 * 🔒 Never add real passwords to this file or anywhere else in the repo.
 *    A client-side credential check is security theatre and, once committed to
 *    a public repo, leaks whatever you typed. See SECURITY.md.
 */

/** Display names that unlock the demo "staff" view (chat inbox, admin hints). */
export const DEMO_STAFF_NAMES: string[] = (
  import.meta.env.VITE_DEMO_ADMINS ?? 'Krishna,Piyush Mishra,Md Kaif'
)
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);

/** Public handles → display names, so the demo can recognise its own team. */
export const DEMO_HANDLES: Record<string, string> = {
  krishna0858: 'Krishna',
  krishna: 'Krishna',
  piyush_mishra: 'Piyush Mishra',
  piyush: 'Piyush Mishra',
  md_kaif: 'Md Kaif',
  kaif: 'Md Kaif',
  bot: 'Bot',
};

/** Any 6-digit code is accepted in the demo. Shown on screen, not hidden. */
export const DEMO_OTP_HINT = 'Demo mode — any 6 digits work (try 123456)';

/** Staff roster rendered in the community sidebar / chat list. */
export const STAFF_ROSTER = [
  { name: 'Krishna', role: 'Lead Developer & Maintainer', handle: 'krishna0858', online: true },
  { name: 'Piyush Mishra', role: 'Developer', handle: 'piyush_mishra', online: true },
  { name: 'Md Kaif', role: 'Developer', handle: 'md_kaif', online: true },
  { name: 'Bot', role: 'AI assistant · always on', handle: 'Bot', online: true },
] as const;

export function isDemoStaff(name?: string | null): boolean {
  if (!name) return false;
  const needle = name.trim().toLowerCase();
  return DEMO_STAFF_NAMES.some((staff) => staff.toLowerCase() === needle);
}

/** Resolve whatever someone typed in the login form into a display name. */
export function resolveDemoName(input: string, fallback?: string): string {
  const key = input.trim().toLowerCase();
  const handle = key.split('@')[0];
  return DEMO_HANDLES[handle] ?? fallback ?? (handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'Guest');
}
