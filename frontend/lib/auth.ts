'use server'

import { SignJWT, jwtVerify } from "jose";
import { createSession, deleteSession } from "@/lib/session";
import type { Credentials, SessionPayload, CurrentUser } from "@/lib/definitions";

const secretKey = process.env.SECRET_KEY || ''
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour from now")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return JSON.stringify(payload);
  } catch {
    return null;
  }
  
}

export async function register(credentials: Credentials) {
  try {
    const response = await fetch('http://localhost:3333/api/users/register', {
      method: 'POST',
      headers: { 
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log(await response.json())

    if (response.ok) {
      const data = await response.json()

      return { success: true }
    }
    else if (response.status === 403) {
      return { success: false, username: 'User already exists' };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Network error. Please try again later.' };
  }
  
}

export async function login(credentials: Credentials) {
  try {
    const response = await fetch('http://localhost:3333/api/users/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (response.ok) {
      const data = await response.json()

      console.log(data)

      // Verify credentials && get the user
      const user: CurrentUser = {
        id: data.id,
        username: data.username,
        admin: data.admin,
        token: data.token.token,
      }

      createSession(user)
      return { success: true, user}
    }
    else if (response.status === 403 || response.status === 400) {
      return { success: false, error: 'Login Failed! Try again' };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Network error. Please try again later.' };
  }
  

  
}
export async function logout() {
  deleteSession()
}