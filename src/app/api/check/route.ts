import { NextResponse } from 'next/server';
import handler from '@/app/checker-service/daily-check';

export async function GET() {
  // Send email notification endpoint
  try {
    const notifiedUsers = await handler();
    return NextResponse.json({
      message: `Sent emails to ${notifiedUsers} users`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
}
