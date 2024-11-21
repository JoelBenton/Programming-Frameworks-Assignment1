/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useUsers } from "@/components/context/UsersContext";
import { login } from "@/lib/auth";
import { authInput } from "@/validators/auth";
import Page from "@/app/(root)/login/page";

// Mock dependencies
jest.mock("@/lib/auth", () => ({
    login: jest.fn(),
}));

jest.mock("@/validators/auth", () => ({
    authInput: {
        safeParseAsync: jest.fn(),
    },
}));

jest.mock("@/components/context/UsersContext", () => ({
    useUsers: jest.fn(),
}));

jest.mock("next/link", () => {
    // eslint-disable-next-line react/display-name
    return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

describe("Login Page", () => {
    const mockRefreshUsers = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockSetHref = jest.fn();
    const originalLocation = window.location;

    beforeAll(() => {
    // Mock window.location.href
        (window as any).location = undefined;
        window.location = { href: "" } as any;
        window.alert = jest.fn();
    });

    afterAll(() => {
    // Restore window.location
        window.location = originalLocation;
    });

    beforeEach(() => {
        (useUsers as jest.Mock).mockReturnValue({
            refreshUsers: mockRefreshUsers,
        });

        jest.clearAllMocks();
    });

    test("renders the login form", () => {
        render(<Page />);
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    test("handles input changes", () => {
        render(<Page />);
        const usernameInput = screen.getByPlaceholderText("Username") as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText("Password") as HTMLInputElement;

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        expect(usernameInput.value).toBe("testuser");
        expect(passwordInput.value).toBe("password123");
    });

    test("shows validation errors when input is invalid", async () => {
        (authInput.safeParseAsync as jest.Mock).mockResolvedValue({
            success: false,
            error: {
                errors: [
                    { path: ["username"], message: "Username is required" },
                    { path: ["password"], message: "Password is required" },
                ],
            },
        });

        render(<Page />);
        fireEvent.submit(screen.getByText("Login"));

        await waitFor(() => {
            expect(screen.getByText("• Username is required")).toBeInTheDocument();
            expect(screen.getByText("• Password is required")).toBeInTheDocument();
        });
    });

    test("calls login API on valid form submission", async () => {
        (authInput.safeParseAsync as jest.Mock).mockResolvedValue({ success: true });
        (login as jest.Mock).mockResolvedValue({ success: true });

        render(<Page />);
        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.submit(screen.getByText("Login"));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123",
            });
            expect(mockRefreshUsers).toHaveBeenCalled();
            expect(window.location.href).toBe("http://localhost/");
        });
    });

    test("shows error message on login failure", async () => {
        (authInput.safeParseAsync as jest.Mock).mockResolvedValue({ success: true });
        (login as jest.Mock).mockResolvedValue({
            success: false,
            error: "Invalid credentials",
        });

        render(<Page />);
        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.submit(screen.getByText("Login"));

        await waitFor(() => {
            expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
        });
    });

    test("toggles password visibility", () => {
        render(<Page />);
        const passwordInput = screen.getByPlaceholderText("Password");
        const toggleButton = screen.getByLabelText("Toggle password visibility");

        expect(passwordInput).toHaveAttribute("type", "password");

        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "text");

        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "password");
    });
});