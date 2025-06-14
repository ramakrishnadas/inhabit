"use client"

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return <button className="rounded-md ml-[20px] px-3 py-2 text-sm font-medium text-white hover:text-black bg-red-600 hover:bg-red-300 no-underline cursor-pointer" onClick={() => signOut()}>Log Out</button>;
}