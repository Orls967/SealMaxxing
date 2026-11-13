import { Link } from 'react-router-dom';
import { UI } from '@/content/ui';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 text-center">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide">{UI.app.notFound}</h1>
      <Link to="/" className="mt-4 inline-block rounded bg-accent px-3 py-2 text-sm font-semibold text-text">
        {UI.app.backHome}
      </Link>
    </div>
  );
}
