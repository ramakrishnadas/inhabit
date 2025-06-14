import { sendEmail } from '@/app/lib/mailer';
import pool from '@/app/lib/db';

export default async function handler() {
  try {
    const query = `
        SELECT
            u.name AS user_name,
            u.email,
            h.name AS habit_name,
            h.frequency,
            h.created_at
        FROM users u
        JOIN habits h ON u.id = h.user_id
        LEFT JOIN habit_progress hp ON h.id = hp.habit_id
        WHERE h.created_at::DATE != CURRENT_DATE 
        AND (hp.date > CURRENT_DATE - INTERVAL '5 days' 
            OR (hp.date IS NULL AND h.created_at > CURRENT_DATE - INTERVAL '5 days'));
    `;

    const result = await pool.query(query);

    const grouped: Record<
      string,
      {
        name: string;
        email: string;
        habits: { name: string; frequency: string; created_at: string }[];
      }
    > = {};

    for (const row of result.rows) {
      const key = row.email;
      if (!grouped[key]) {
        grouped[key] = {
          name: row.user_name,
          email: row.email,
          habits: [],
        };
      }

      grouped[key].habits.push({
        name: row.habit_name,
        frequency: row.frequency,
        created_at: row.created_at,
      });
    }

    const usersToNotify = Object.values(grouped).filter(
      (user) => user.habits.length > 0
    );

    for (const user of usersToNotify) {
      const html = `
        <h2>Hello, ${user.name}!</h2>
        <p>We noticed that you haven’t updated your progress on the following habits for the several days:</p>
        <ul>
          ${user.habits
            .map(
              (habit) =>
                `<li><strong>${habit.name}</strong> — frequency: ${
                  habit.frequency
                }, created on: ${new Date(
                  habit.created_at
                ).toLocaleDateString()}</li>`
            )
            .join('')}
        </ul>
        <p>Don’t forget to update your progress in the app 💪</p>
      `;

      await sendEmail(user.email, 'Reminders about your habits', html);
    }

    return usersToNotify.length;
  } catch (error) {
    console.error('Error in notification service:', error);
  }
}
