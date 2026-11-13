let cached: boolean | null = null;

/** True when a WebGL context can be created. Pages fall back to static images otherwise. */
export function hasWebgl(): boolean {
  if (cached !== null) return cached;
  try {
    const c = document.createElement('canvas');
    cached = Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    cached = false;
  }
  return cached;
}
