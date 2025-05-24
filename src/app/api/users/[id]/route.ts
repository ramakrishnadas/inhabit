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

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
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

    const { name, email, password, image } = await request.json();

    const result = await pool.query(
      `UPDATE users
       SET name = $1, 
           email = $2, 
           password = $3, 
           image = $4
       WHERE id = $5`,
      [name, email, password, image, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
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

    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
