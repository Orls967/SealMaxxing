import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CAR_LIST } from '@/content/cars';
import { UI } from '@/content/ui';
import { buildRows, filterRows } from '@/lib/table';
import { DataTable } from './DataTable';

const rows = buildRows(CAR_LIST);

describe('DataTable', () => {
  it('shows production years in the column heads and every metric row', () => {
    render(<DataTable cars={CAR_LIST} rows={rows} extreme={false} sortBy={null} onSort={() => {}} />);
    expect(screen.getByRole('columnheader', { name: /Seal.*MY2026/ })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Senna.*2018–2019/ })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: /Kapasitas baterai traksi/ })).toBeInTheDocument();
  });
  it('renders absence, unpublished values and mixed-basis rows explicitly', () => {
    render(<DataTable cars={CAR_LIST} rows={filterRows(rows, '', 'energy')} extreme={false} sortBy={null} onSort={() => {}} />);
    const battery = screen.getByRole('rowheader', { name: /Kapasitas baterai traksi/ }).closest('tr')!;
    expect(within(battery).getByText(UI.common.absent)).toBeInTheDocument();
    const mass = screen.getByRole('rowheader', { name: /Massa baterai/ }).closest('tr')!;
    expect(within(mass).getByText(UI.common.unknown)).toBeInTheDocument();
    const range = screen.getByRole('rowheader', { name: /Jarak listrik murni/ }).closest('tr')!;
    expect(within(range).getByText(UI.common.noWinnerBasis)).toBeInTheDocument();
    expect(within(range).queryByText(UI.common.best)).toBeNull();
  });
  it('adds track-only columns on request and reports sort clicks', async () => {
    const onSort = vi.fn();
    render(<DataTable cars={CAR_LIST} rows={rows} extreme sortBy={null} onSort={onSort} />);
    expect(screen.getByRole('columnheader', { name: /FXX K Evo/ })).toBeInTheDocument();
    expect(screen.getAllByText(UI.common.trackOnly)).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: UI.data.sortBy('P1') }));
    expect(onSort).toHaveBeenCalledWith('p1');
  });
});
