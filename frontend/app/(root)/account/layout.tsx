import { SessionProvider } from "@/components/context/SessionContext";
import { checkSession } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { SessionPayload } from "@/lib/definitions";
import React from "react";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (await checkSession()) || redirect('/');
  const session = await getSession() ?? ''
  const parsedSession = JSON.parse(session) as SessionPayload
  
    return (
      <SessionProvider initialSession={parsedSession}>
        <main>
          {children}
        </main>
      </SessionProvider>
    )
}