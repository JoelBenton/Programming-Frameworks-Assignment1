import { checkSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (await checkSession()) || redirect('/');
    return (
      <main>
        {children}
      </main>
    )
}