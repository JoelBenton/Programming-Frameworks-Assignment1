import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/lib/auth";
import type { CurrentUser } from '@/lib/definitions'

export async function createSession(user: CurrentUser) {
  // Create the session
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (await
    // Save the session in a cookie
    cookies()).set("session", session, { expires, httpOnly: true });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    expires: expires
  })
}

export async function deleteSession() {
  (await cookies()).delete('session');
}