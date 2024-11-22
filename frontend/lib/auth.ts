"use client";

import type {
    Credentials,
    CurrentUser,
} from "@/lib/definitions";

export async function register(credentials: Credentials) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users/register`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(credentials),
            },
        );

        if (response.ok) {
            return { success: true };
        } else if (response.status === 403) {
            return { success: false, username: "User already exists" };
        } else {
            return { success: false, error: "An unknown error occurred" };
        }
    } catch {
        return {
            success: false,
            error: "Network error. Please try again later.",
        };
    }
}

export async function login(credentials: Credentials) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users/login`,
            {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(credentials),
            },
        );

        if (response.ok) {
            const data = await response.json();

            // Verify credentials && get the user
            const user: CurrentUser = {
                id: data.id,
                username: data.username,
                admin: data.admin,
                token: data.token.token,
            };

            localStorage.setItem("user", JSON.stringify(user));
            return { success: true, user };
        } else if (response.status === 403 || response.status === 400) {
            return { success: false, error: "Login Failed! Try again" };
        } else {
            return { success: false, error: "An unknown error occurred" };
        }
    } catch {
        return {
            success: false,
            error: "Network error. Please try again later.",
        };
    }
}
export async function logout() {
    localStorage.removeItem("user");
}

export async function checkSession() {
    const user = localStorage.getItem("user");
    if (!user) {
        return false;
    } else return true;
}
