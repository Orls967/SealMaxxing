import { create } from 'zustand';
import { parseView, serializeView, type ViewState } from '@/lib/viewState';

interface ViewStore extends ViewState {
  /** Changes view state and mirrors it into the hash query without adding history entries. */
  set: (patch: Partial<ViewState>) => void;
  /** Replaces the whole state from a query string (used when the route changes). */
  hydrate: (search: string) => void;
}

/** Splits "#/path?query" into its two halves. */
export function splitHash(hash: string): { path: string; search: string } {
  const raw = hash.replace(/^#/, '');
  const i = raw.indexOf('?');
  return i < 0
    ? { path: raw || '/', search: '' }
    : { path: raw.slice(0, i) || '/', search: raw.slice(i + 1) };
}

function pick(s: ViewStore): ViewState {
  const { set: _set, hydrate: _hydrate, ...view } = s;
  return view;
}

export const useView = create<ViewStore>((set, get) => ({
  ...parseView(typeof window === 'undefined' ? '' : splitHash(window.location.hash).search),
  set: (patch) => {
    set(patch);
    const qs = serializeView(pick(get()));
    const { path } = splitHash(window.location.hash);
    window.history.replaceState(window.history.state, '', `#${path}${qs ? `?${qs}` : ''}`);
  },
  hydrate: (search) => set(parseView(search)),
}));

/** Current view as a query string, for links that keep the view while changing the route. */
export const currentSearch = (): string => {
  const qs = serializeView(pick(useView.getState()));
  return qs ? `?${qs}` : '';
};
