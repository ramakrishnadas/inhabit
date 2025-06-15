'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartRow } from '../lib/definitions';

// Line Chart that displays habit progress for the current week

interface ProgressChartProps {
  data: ChartRow[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  if (!data || data.length === 0) return <p>No chart data</p>;

  const habitKeys = Object.keys(data[0]).filter(key => key !== 'name');

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#ff69b4']; // rotate if many

  return (
    <div style={{ width: '80%', height: 300, margin: '50px auto' }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${Math.round(value)}%`} domain={[0, 100]} />
          <Tooltip formatter={(value: number) => `${Math.round(value)}%`} />
          <Legend />
          {habitKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[i % colors.length]}
              name={key}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
