/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { authInput } from "@/validators/auth";
import Page from "@/app/(root)/register/page";

// Mock dependencies
jest.mock("@/lib/auth", () => ({
    register: jest.fn(),
}));

jest.mock("@/validators/auth", () => ({
    authInput: {
        safeParseAsync: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("next/link", () => {
    // eslint-disable-next-line react/display-name
    return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

describe("Register Page", () => {
    const mockPush = jest.fn();
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
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        jest.clearAllMocks();
    });

    test("renders the register form", () => {
        render(<Page />);
        // Target the correct 'Register' button for the form submission
        expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });

    test("handles input changes", () => {
        render(<Page />);
        const usernameInput = screen.getByPlaceholderText("Username") as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText("Password") as HTMLInputElement;

        fireEvent.change(usernameInput, { target: { value: "newuser" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        expect(usernameInput.value).toBe("newuser");
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
        fireEvent.submit(screen.getByRole("button", { name: /register/i }));

        await waitFor(() => {
            expect(screen.getByText("• Username is required")).toBeInTheDocument();
            expect(screen.getByText("• Password is required")).toBeInTheDocument();
        });
    });

    test("calls register API on valid form submission", async () => {
        (authInput.safeParseAsync as jest.Mock).mockResolvedValue({ success: true });
        (register as jest.Mock).mockResolvedValue({ success: true });

        render(<Page />);
        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "newuser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /register/i }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                username: "newuser",
                password: "password123",
            });
            expect(mockPush).toHaveBeenCalledWith("/login");
        });
    });

    test("shows error message on registration failure", async () => {
        (authInput.safeParseAsync as jest.Mock).mockResolvedValue({ success: true });
        (register as jest.Mock).mockReturnValue({
            success: false,
            username: "Username already exists",
        });

        render(<Page />);
        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "newuser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /register/i }));

        await waitFor(() => {
            // Use a more flexible matcher with regex to ignore the bullet point
            expect(screen.getByText(/Username already exists/i)).toBeInTheDocument();
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