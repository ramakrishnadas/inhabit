import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/app/lib/utils';

export async function GET() {
  // Get all users
  try {
    const result = await pool.query('SELECT * FROM users');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Create new user
  try {
    const { name, email, password, image } = await request.json();
    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users(name, email, password, image)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, hashedPassword, image]
    );

    return NextResponse.json(
      { message: 'User created successfully', id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
