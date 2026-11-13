import { useState } from 'react';
import { GLOSSARY } from '@/content/glossary';
import { UI } from '@/content/ui';

const SORTED = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'id'));

export default function GlossaryPage() {
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const terms = SORTED.filter((t) => !needle || t.term.toLowerCase().includes(needle) || t.def.toLowerCase().includes(needle));
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">{UI.glossary.title}</h1>
        <p className="text-sm text-muted">{UI.glossary.lead}</p>
      </header>
      <label className="flex flex-col gap-1 text-sm">
        {UI.glossary.search}
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="rounded border border-line bg-surface-2 px-2 py-1 text-text" />
      </label>
      {terms.length === 0 ? (
        <p className="text-sm text-muted">{UI.glossary.empty}</p>
      ) : (
        <dl className="grid gap-3 sm:grid-cols-2">
          {terms.map((t) => (
            <div key={t.id} id={t.id} className="rounded-lg border border-line bg-surface p-3">
              <dt className="font-semibold text-accent-text">{t.term}</dt>
              <dd className="text-sm text-text">{t.def}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
