'use client';

import LineChartWrapper from '@/app/components/LineChartWrapper';
import DataTable from "react-data-table-component";
import { Habit, HabitProgress } from '../lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { fetchHabits, fetchHabitProgressByHabitId } from '../lib/helper';
import { useEffect, useState } from 'react';

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
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    async function fetchProgress() {
      if (!habits) return;
      setLoading(true);

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
      const chartRows: any[] = weekDates.map(({ name }) => {
        const row: any = { name };
        for (const habit of habits) {
          const value = progressMap[habit.id]?.[name] ?? 0;
          row[habit.name] = value;
        }
        return row;
      });

      setChartData(chartRows);
      setLoading(false);
    }

    fetchProgress();
  }, [habits]);

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

  return (
    <div className='mx-20 '>
      {loading || isLoading ? (
        <div className="text-center text-xl py-10">Loading...</div>
      ) : (
        <>
          <h2 className='my-10 text-2xl'>This Week's Progress</h2>
          <DataTable
            title=""
            columns={columns}
            data={habits ?? []}
            className='my-10'
          />
          <div>
            <LineChartWrapper data={chartData}/>
          </div>
        </>
      )}
      
    </div>
  );
}
