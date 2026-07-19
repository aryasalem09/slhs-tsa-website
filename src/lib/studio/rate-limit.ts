type AttemptWindow = { count: number; resetAt: number };

const loginAttempts = new Map<string, AttemptWindow>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_TRACKED_KEYS = 4_096;

function discardExpiredAndOldest(now: number) {
  for (const [entryKey, entry] of loginAttempts) if (entry.resetAt <= now) loginAttempts.delete(entryKey);
  while (loginAttempts.size >= MAX_TRACKED_KEYS) {
    const oldestKey = loginAttempts.keys().next().value;
    if (typeof oldestKey !== "string") break;
    loginAttempts.delete(oldestKey);
  }
}

/** Best-effort instance-local throttle; Supabase Auth applies its own project-wide limits too. */
export function consumeLoginAttempt(key: string, maximumAttempts = MAX_ATTEMPTS) {
  const now = Date.now();
  const current = loginAttempts.get(key);
  if (!current || current.resetAt <= now) {
    if (!current) discardExpiredAndOldest(now);
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= maximumAttempts) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearLoginAttempts(keys: string | string[]) {
  for (const key of Array.isArray(keys) ? keys : [keys]) loginAttempts.delete(key);
}
