'use client';

import LineChartWrapper from '@/app/components/LineChartWrapper';
import DataTable from "react-data-table-component";
import { Habit, ChartRow } from '../lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { fetchHabits, fetchHabitProgressByHabitId } from '../lib/helper';
import { useEffect, useState, useMemo } from 'react';

// Habit progress page. It displays a summary and a line chart of current week progress 

function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return days.map((name, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return { name, date };
  });
}

export default function Page() {
  const { data: habits, isLoading } = useQuery({ queryKey: ["habits"], queryFn: fetchHabits });
  const [habitProgressMap, setHabitProgressMap] = useState<Record<string, Record<string, number>>>({});
  const [chartData, setChartData] = useState<ChartRow[]>([]);

  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  useEffect(() => {
    
    async function fetchProgress() {
      if (!habits) return;

      const progressMap: Record<string, Record<string, number>> = {};

      for (const habit of habits) {
        const progress = await fetchHabitProgressByHabitId(habit.id);

        const dailyMap: Record<string, number> = {};

        for (const { date, actual_amount } of progress) {
          const progressDate = new Date(date);
          progressDate.setHours(0, 0, 0, 0);

          for (const { name, date: targetDate } of weekDates) {
            if (progressDate.getTime() === targetDate.getTime()) {
              const percent = Math.min((actual_amount / habit.target_amount) * 100, 100);
              dailyMap[name] = percent;
            }
          }
        }

        progressMap[habit.id] = dailyMap;
      }

      setHabitProgressMap(progressMap);

      // ✅ Generate chartData here
      const chartRows: ChartRow[] = weekDates.map(({ name }) => {
        const row: ChartRow = { name };
        for (const habit of habits) {
          const value = progressMap[habit.id]?.[name] ?? 0;
          row[habit.name] = value;
        }
        return row;
      });

      setChartData(chartRows);
    }

    fetchProgress();
  }, [habits, weekDates]);

  const columns = [
    { name: 'Habit', selector: (row: Habit) => row.name },
    ...weekDates.map(({ name }) => ({
      name,
      cell: (row: Habit) => {
        const percent = habitProgressMap[row.id]?.[name] ?? 0;
        return `${Math.round(percent)}%`;
      },
    })),
  ];

  if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-medium">Loading...</p>
            </div>
        );
  }

  return (
    <div className='mx-20 '>
      <h2 className='my-10 text-2xl'>This Week&apos;s Progress</h2>
      <DataTable
        title=""
        columns={columns}
        data={habits ?? []}
        className='my-10'
      />
      <div>
        <LineChartWrapper data={chartData}/>
      </div>
    </div>
  );
}
