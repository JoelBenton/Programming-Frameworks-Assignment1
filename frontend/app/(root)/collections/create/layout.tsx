import { checkSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  (await checkSession()) || redirect('/');
    return (
      <main>
        {children}
      </main>
    )
}