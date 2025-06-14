'use client';

import dynamic from 'next/dynamic';

const ProgressLineChart = dynamic(() => import('./ProgressLineChart'), {
  ssr: false,
});

export default function LineChartWrapper({ data }: { data: any[] }) {
  return (
    <div>
      <ProgressLineChart data={data} />
    </div>
  );
}
