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

    const result = await pool.query('SELECT * FROM habits WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching habit' },
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

    const { user_id, name, target_amount, unit, frequency } =
      await request.json();

    const result = await pool.query(
      `UPDATE habits
       SET 
           user_id = $1, 
           name = $2,
           target_amount = $3,
           unit = $4, 
           frequency = $5
       WHERE id = $6`,
      [user_id, name, target_amount, unit, frequency, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Habit updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error updating habit' },
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

    const result = await pool.query(`DELETE FROM habits WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Habit deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error deleting habit' },
      { status: 500 }
    );
  }
}
