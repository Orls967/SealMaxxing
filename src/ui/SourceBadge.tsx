import { UI } from '@/content/ui';

/** Verification status of a sourced value. Unverified data is always called out in yellow. */
export function SourceBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="text-xs text-muted" title={UI.common.verifiedHint}>
      <span aria-hidden="true">✓</span>
      <span className="sr-only">{UI.common.verified}</span>
    </span>
  ) : (
    <span className="rounded border border-warn px-1 text-xs leading-tight text-warn" title={UI.common.unverifiedHint}>
      {UI.common.unverified}
    </span>
  );
}
