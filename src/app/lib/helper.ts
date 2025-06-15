import { Habit, HabitProgress } from "./definitions";

// Helper functions to call API endpoints

export async function fetchHabits(): Promise<Habit[]> {
  const res = await fetch('/api/habits', {
    credentials: 'include',
  });

  if (!res.ok) {
    console.error("Failed to fetch habits", await res.text());
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchHabitProgressByHabitId(id: string): Promise<HabitProgress[]> {
  const res = await fetch(`/api/habit-progress/${id}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    console.error("Failed to fetch habit progress", await res.text());
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

