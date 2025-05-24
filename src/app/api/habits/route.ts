import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM habits');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching habits' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { user_id, name, target_amount, unit, frequency } =
      await request.json();

    const result = await pool.query(
      `INSERT INTO habits(user_id, name, target_amount, unit, frequency)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [user_id, name, target_amount, unit, frequency]
    );

    return NextResponse.json(
      { message: 'Habit created successfully', id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error creating habit' },
      { status: 500 }
    );
  }
}
