'use client'
import { encrypt, decrypt } from "@/lib/auth";
import type { CurrentUser } from "@/lib/definitions";

// Helper function to get a specific cookie
const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
};

// Helper function to set a cookie
const setCookie = (name: string, value: string, expires: Date) => {
  console.log(`${name}=${value}; expires=${expires.toUTCString()}; path=/;`)
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/;`;
};

// Helper function to delete a cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export async function createSession(user: CurrentUser) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const session = await encrypt({ user, expires });

  setCookie("session", session, expires);  // Set the session cookie
}

export async function getSession() {
  const session = getCookie("session");
  if (!session) return null;
  
  return await decrypt(session);  // Decrypt the session data
}

export async function updateSession() {
  const session = getCookie("session");
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload) return null;

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);  // Update expiration date
  setCookie("session", session, expires);  // Update session cookie with new expiration
}

export async function deleteSession() {
  deleteCookie("session");  // Remove session cookie
}