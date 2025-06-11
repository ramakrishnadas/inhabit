import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log('No valid session. Returning 401.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // console.log("User ID:", session.user.id);

    const result = await pool.query('SELECT * FROM habits WHERE user_id = $1', [
      session.user.id,
    ]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('API /api/habits error:', error);
    return NextResponse.json(
      { error: 'Error fetching habits' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log('No valid session. Returning 401.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user_id = session.user?.id;
    const { name, target_amount, unit, frequency } = await request.json();

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
