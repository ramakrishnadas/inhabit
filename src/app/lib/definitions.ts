// Type definitions for use in the whole application

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    image: string;
    created_at: Date;
}

export type Habit = {
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    unit: string;
    frequency: string;
    created_at: Date;
}

export type HabitProgress = {
    id: string;
    habit_id: string; 
    date: Date;
    actual_amount: number;
    note: string;
}

export type ChartRow = {
  name: string;
} & {
  [habitName: string]: number | string;
};