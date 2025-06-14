'use client';

import dynamic from 'next/dynamic';
import { ChartRow } from '../lib/definitions';

const ProgressLineChart = dynamic(() => import('./ProgressLineChart'), {
  ssr: false,
});

export default function LineChartWrapper({ data }: { data: ChartRow[] }) {
  return (
    <div>
      <ProgressLineChart data={data} />
    </div>
  );
}
