"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from "react";
import { User } from "@/lib/definitions";
import { useUsers } from "@/components/context/UsersContext";
import { useSession } from "@/components/context/SessionContext";
import { useRouter } from "next/navigation";

export default function UserManagementPage() {
    const router = useRouter();
    const sessionContext = useSession()
    const userContext = useUsers()

    const session = sessionContext.session;
    const users = userContext.users

    if (!session || session.admin != true) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-700 bg-gray-100 p-4 rounded-xl shadow-xl">
                    <span
                        className="font-bold text-blue-600"
                        onClick={() => router.push("/login")}
                    >
                        Please Login with an admin account to view Admin Page!
                    </span>
                </p>
            </div>
        );
    }

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setAdmin] = useState(false);

    const [limit, setLimit] = useState<number>(0);
    const [totalRequests, setTotalRequests] = useState<number>(0);
    const [remainingRequests, setRemainingRequests] = useState<number>(0);
    const [newLimit, setNewLimit] = useState<number>(0);

    useEffect(() => {
        async function loadLimits() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/sets/get-limit-info`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                if (response.ok) {
                    const data = (await response.json()) as {
                        limit: number;
                        totalRequests: number;
                    };
                    setLimit(data.limit);
                    setTotalRequests(data.totalRequests);
                    setRemainingRequests(data.limit - data.totalRequests);
                } else {
                    alert("Failed to load limit data.");
                }
            } catch {
                alert("Failed to load limit data.");
            }
        }
        loadLimits();
    }, []);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setUsername(user.username);
        setPassword("");
        setAdmin(user.admin);
    };

    const handleUserUpdateSubmit = async () => {
        if (!selectedUser) return;

        const data: { username?: string; admin?: boolean; password?: string } =
            {};
        if (password) {
            data.username = username;
            data.password = password;
            data.admin = admin;
        } else {
            data.username = username;
            data.admin = admin;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users/${selectedUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            if (response.ok) {
                alert("User updated successfully!");
                userContext.refreshUsers();
            } else {
                alert("Failed to update user.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleLimitSubmit = async () => {
        const newLimitValue = newLimit;

        if (isNaN(newLimitValue) || newLimitValue <= 0) {
            alert("Please enter a valid number.");
            return;
        }

        const data = {
            limit: newLimitValue,
        };

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/sets/update-limit`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            if (response.ok) {
                alert("Limit updated successfully!");
                setLimit(newLimitValue);
                setRemainingRequests(newLimitValue - totalRequests);
            } else {
                alert("Failed to update Limit.");
            }
        } catch {
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 mb-20">
            <h1 className="text-4xl font-bold mt-10">User Management</h1>

            <div className="flex flex-col items-center w-[50%] border-black border-2 p-4 rounded-xl bg-gradient-to-br from-[#1a1a3d] to-[#5dbdbd]">
                <div className="flex flex-col items-center space-y-2">
                    <label
                        htmlFor="user-select"
                        className="text-xl font-medium"
                    >
                        Select a User
                    </label>
                    <select
                        id="user-select"
                        onChange={(e) => {
                            const userId = Number(e.target.value);
                            const user = users?.find(
                                (user) => user.id === userId,
                            );
                            if (user) handleUserSelect(user);
                        }}
                        className="p-2 border rounded-lg text-black"
                        value={selectedUser ? selectedUser.id : ""}
                        disabled={!users}
                    >
                        <option value="" disabled>
                            {users ? "Select a username" : "No users available"}
                        </option>
                        {users &&
                            users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                    </select>
                </div>

                {selectedUser && (
                    <div className="flex flex-col space-y-4 w-1/2">
                        <div>
                            <label className="block text-lg font-medium mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border rounded-xl text-black"
                                disabled={true}
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full p-2 border rounded-xl text-black"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={admin}
                                onChange={(e) => setAdmin(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <label className="text-lg font-medium">Admin</label>
                        </div>
                        <button
                            onClick={handleUserUpdateSubmit}
                            className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Submit Change
                        </button>
                    </div>
                )}
            </div>

            <h1 className="text-4xl font-bold mt-10">Limit Management</h1>
            <div className="flex flex-col items-center w-[50%] border-black border-2 p-6 rounded-xl bg-gradient-to-br from-[#1a1a3d] to-[#5dbdbd] mt-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-white">
                    Flashcard Set Limit
                </h2>

                <div className="w-full text-center text-white space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                        <span className="text-lg font-medium">Limit:</span>
                        <span className="text-xl font-semibold">{limit}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                        <span className="text-lg font-medium">
                            Total Requests:
                        </span>
                        <span className="text-xl font-semibold">
                            {totalRequests}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">
                            Remaining Requests:
                        </span>
                        <span className="text-xl font-semibold">
                            {remainingRequests}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center mt-6 w-full">
                    <label
                        htmlFor="updateLimit"
                        className="text-lg font-medium text-white mb-2"
                    >
                        Update Limit
                    </label>
                    <input
                        type="number"
                        id="updateLimit"
                        value={newLimit}
                        onChange={(e) => setNewLimit(Number(e.target.value))}
                        placeholder="Enter new limit"
                        className="w-full p-2 border rounded-xl text-black"
                    />
                </div>

                <button
                    onClick={handleLimitSubmit}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
