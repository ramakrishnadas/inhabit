// app/components/NavBar.tsx
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow">
      <div className="text-lg font-bold">Positive Habits</div>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Log in</Link>
        <Link href="/signup">Sign up</Link>
      </div>
    </nav>
  );
}
