/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSession } from "@/components/context/SessionContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usernameInput, passwordInput } from "@/validators/auth";
import { login } from "@/lib/auth";

const Page = () => {
    const { session, refreshSession } = useSession() || {};
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            refreshSession()
        }
    }, [])

    const [newUsername, setNewUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-700 bg-gray-100 p-4 rounded-xl shadow-xl">
                    Please{" "}
                    <span
                        className="font-bold text-blue-600"
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </span>{" "}
                    to view Account
                </p>
            </div>
        );
    }

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        setUsernameErrors([]);
        setPasswordErrors([]);

        if (!currentPassword) {
            setError(
                "Current Password required for either Changing Username or password",
            );
            return;
        }

        if (!session) {
            setError("You are not authorized. Please log in again.");
            return;
        }

        let credentials = { username: "", password: "" };

        if (newUsername && newPassword) {
            // Both username and password are changing
            try {
                usernameInput.parse({ username: newUsername });
                passwordInput.parse({ password: newPassword });
            } catch (e: any) {
                // Collect error messages into arrays
                if (e.errors.find((err: any) => err.path[0] === "username")) {
                    setUsernameErrors(e.errors.map((err: any) => err.message));
                }
                if (e.errors.find((err: any) => err.path[0] === "password")) {
                    setPasswordErrors(e.errors.map((err: any) => err.message));
                }
                return;
            }
            credentials = { username: newUsername, password: newPassword };
        } else if (newUsername) {
            // Only username is changing
            try {
                usernameInput.parse({ username: newUsername });
            } catch (e: any) {
                setUsernameErrors(e.errors.map((err: any) => err.message));
                return;
            }
            credentials = { username: newUsername, password: currentPassword };
        } else if (newPassword) {
            // Only password is changing
            try {
                passwordInput.parse({ password: newPassword });
            } catch (e: any) {
                setPasswordErrors(e.errors.map((err: any) => err.message));
                return;
            }
            credentials = {
                username: session.user.username,
                password: newPassword,
            };
        } else {
            setError(
                "No changes detected. Please provide a new username or password.",
            );
            return;
        }

        const token = session.user.token;
        if (!token) {
            setError("You are not authorized. Please log in again.");
            return;
        }

        // Send the request
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users/${session.user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(credentials),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                setError(
                    errorData.message ||
                        "An error occurred while updating the user details.",
                );
                return;
            }

            const result = await login(credentials);
            if (result.success) {
                setSuccess("Your information has been updated successfully!");
            } else {
                setError(
                    result.error ??
                        "Your information has been updated! However re-login has failed. Try login again with new information.",
                );
            }
        } catch {
            setError("An error occurred while updating your details.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#09092c] to-[#634698] text-white min-h-screen flex flex-col items-center justify-center p-8">
            <div className="text-3xl font-bold mb-6">
                {session?.user.username}
            </div>

            <div className="w-full max-w-lg bg-[#1e1e2f] p-6 rounded-2xl shadow-lg">
                {/* Success or Error Messages */}
                {error && (
                    <div className="text-red-500 mb-4 text-lg">{error}</div>
                )}
                {success && (
                    <div className="text-green-500 mb-4 text-lg">{success}</div>
                )}

                <div className="text-2xl font-semibold mb-4">
                    Current Password <span className="text-red-500">*</span>
                </div>
                <input
                    placeholder="Current Password"
                    type={showPassword ? "text" : "password"}
                    className="bg-transparent border-2 border-white text-white p-3 rounded-xl w-full mb-6 focus:outline-none focus:ring-2 focus:ring-[#634698]"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <div className="text-2xl font-semibold mb-4">
                    Change Username
                </div>
                <input
                    placeholder="New Username"
                    className="bg-transparent border-2 border-white text-white p-3 rounded-xl w-full mb-6 focus:outline-none focus:ring-2 focus:ring-[#634698]"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                {usernameErrors.length > 0 && (
                    <div className="text-red-500 text-sm mb-4">
                        <ul>
                            {usernameErrors.map((err, index) => (
                                <li key={index}>- {err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="text-2xl font-semibold mb-4">
                    Change Password
                </div>
                <input
                    placeholder="New Password"
                    type={showPassword ? "text" : "password"}
                    className="bg-transparent border-2 border-white text-white p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#634698]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {passwordErrors.length > 0 && (
                    <div className="text-red-500 text-sm mb-4">
                        <ul>
                            {passwordErrors.map((err, index) => (
                                <li key={index}>- {err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[#634698] mb-4"
                >
                    {showPassword ? "Hide Passwords" : "Show Passwords"}
                </button>

                <button
                    onClick={handleSubmit}
                    className="bg-[#634698] text-white py-3 rounded-xl w-full text-xl font-semibold hover:bg-[#4e3577] transition duration-300"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Page;
