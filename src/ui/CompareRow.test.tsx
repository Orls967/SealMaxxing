import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CAR_LIST } from '@/content/cars';
import { METRIC_BY_ID } from '@/content/metrics';
import { UI } from '@/content/ui';
import { compareMetric } from '@/lib/compare';
import { CompareRow } from './CompareRow';

function row(id: keyof typeof METRIC_BY_ID) {
  const m = METRIC_BY_ID[id];
  render(<CompareRow label={m.label} unit={m.unit} digits={m.digits} cars={CAR_LIST} result={compareMetric(CAR_LIST, m)} />);
  return screen.getByRole('region', { name: m.label });
}

describe('CompareRow', () => {
  it('marks the best value and shows units', () => {
    const r = row('powerTotalKw');
    const items = within(r).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(within(items[1]!).getByText(UI.common.best)).toBeInTheDocument();
    expect(within(items[0]!).queryByText(UI.common.best)).toBeNull();
    expect(within(items[0]!).getByText('390 kW')).toBeInTheDocument();
  });
  it('shows an absent part as absent with its reason, never as zero', () => {
    const r = row('batteryKwh');
    const senna = within(r).getAllByRole('listitem')[3]!;
    expect(within(senna).getByText(UI.common.absent)).toBeInTheDocument();
    expect(within(senna).queryByText(/^0/)).toBeNull();
  });
  it('declares no winner and explains why when measurement bases differ', () => {
    const r = row('evRangeKm');
    expect(within(r).queryByText(UI.common.best)).toBeNull();
    expect(within(r).getByText(UI.common.noWinnerBasis)).toBeInTheDocument();
    expect(within(r).getByText('WLTP')).toBeInTheDocument();
  });
  it('flags unverified data', () => {
    const r = row('kerbKg');
    expect(within(r).getAllByText(UI.common.unverified).length).toBeGreaterThan(0);
  });
});
