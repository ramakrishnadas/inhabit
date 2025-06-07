import { Habit } from "./definitions";

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