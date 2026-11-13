import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useView } from './view';

/** Re-reads the view from the URL whenever the router navigates. */
export function useHashView(): void {
  const { key, search } = useLocation();
  useEffect(() => {
    useView.getState().hydrate(search);
  }, [key, search]);
}
