import pool from '@/app/lib/db';
import validator from 'validator';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !validator.isUUID(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT * FROM habit_progress WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Habit progress not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching habit progress' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Need to add validation
    const { id } = await params;

    if (!id || !validator.isUUID(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const { habit_id, date, actual_amount, note } = await request.json();

    const result = await pool.query(
      `UPDATE habit_progress
       SET 
           habit_id = $1, 
           date = $2, 
           actual_amount = $3,
           note = $4
       WHERE id = $5`,
      [habit_id, date, actual_amount, note, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Habit progress not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Habit progress updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error updating habit progress' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !validator.isUUID(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM habit_progress WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Habit progress not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Habit progress deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error deleting habit progress' },
      { status: 500 }
    );
  }
}
