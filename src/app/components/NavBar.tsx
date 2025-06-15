// app/components/NavBar.tsx
import Link from "next/link";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/authOptions';
import LogoutButton from "./LogOutButton";

// Navigation menu that renders relevant options depending on authentication status

export default async function NavBar() {

  const session = await getServerSession(authOptions);

  return (
    <nav className="flex items-center justify-between px-6 py-6 bg-gray-900 text-white shadow">
      <div className="text-lg font-bold">InHabits</div>
      <div className="space-x-4">
        <Link className="rounded-md px-3 py-2 text-m font-medium text-white hover:bg-gray-700 no-underline cursor-pointer" href="/">Home</Link>
        {session ? (
          <>
            <Link className="rounded-md px-3 py-2 text-m font-medium text-white hover:bg-gray-700 no-underline cursor-pointer" href="/dashboard">Dashboard</Link>
            <Link className="rounded-md px-3 py-2 text-m font-medium text-white hover:bg-gray-700 no-underline cursor-pointer" href="/progress">Progress</Link>
            <LogoutButton />
          </>
          ) : (
          <>
            <Link className="rounded-md px-3 py-2 text-m font-medium text-white hover:bg-gray-700 no-underline cursor-pointer" href="/login">Log In</Link>
            <Link className="rounded-md px-3 py-2 text-m font-medium text-white hover:bg-gray-700 no-underline cursor-pointer" href="/signup">Sign Up</Link>
          </>
          )
        }
        
      </div>
    </nav>
  );
}
