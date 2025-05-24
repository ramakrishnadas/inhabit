import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM habit_progress');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching habit progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { habit_id, date, actual_amount, note } = await request.json();

    const result = await pool.query(
      `INSERT INTO habit_progress(habit_id, date, actual_amount, note)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [habit_id, date, actual_amount, note]
    );

    return NextResponse.json(
      { message: 'Habit progress created successfully', id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error creating habit progress' },
      { status: 500 }
    );
  }
}
