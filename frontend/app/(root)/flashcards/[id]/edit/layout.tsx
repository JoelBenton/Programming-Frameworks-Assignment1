import { redirect } from "next/navigation";
import React from "react";
import { checkSession } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode; params: Params["params"] }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (await checkSession()) || redirect('/login');

  return (
    <main className="h-full">{children}</main>
  );

}