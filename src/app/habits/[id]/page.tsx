'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import HabitForm from '@/app/components/HabitForm';

// Edit Habit page

export default function EditHabitPage() {
  const params = useParams();
  const habitId = params.id;

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabit = async () => {
      const res = await fetch(`/api/habits/${habitId}`);
      const data = await res.json();
      setHabit(data);
      setLoading(false);
    };

    fetchHabit();
  }, [habitId]);

  if (loading) return <p>Loading...</p>;
  return <HabitForm habit={habit} />;
}
