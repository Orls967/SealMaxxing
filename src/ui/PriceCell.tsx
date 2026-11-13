import { FX } from '@/content/fx';
import type { Price } from '@/content/types';
import { UI } from '@/content/ui';
import { fmtIdr, priceView } from '@/lib/price';
import { SourceBadge } from './SourceBadge';

/** Launch price in its original currency, with the rupiah estimate when it was converted. */
export function PriceCell({ price }: { price: Price }) {
  const v = priceView(price);
  return (
    <span className="inline-flex flex-col gap-0.5">
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className="tnum font-semibold text-text">{v.original}</span>
        <SourceBadge verified={price.verified} />
      </span>
      <span className="text-xs text-muted">
        {price.basis}, {v.year}
      </span>
      {v.idr && (
        <span className="text-xs text-muted">
          <span className="tnum text-text">{UI.data.priceIdr(v.idr)}</span>{' '}
          {`(${UI.data.priceRate(fmtIdr(FX.usdToIdr))})`}
        </span>
      )}
    </span>
  );
}
