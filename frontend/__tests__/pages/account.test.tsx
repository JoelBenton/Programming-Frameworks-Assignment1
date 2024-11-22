import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "@/components/context/SessionContext";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import Page from "@/app/(root)/account/page";
import { usernameInput, passwordInput } from "@/validators/auth";

// Mock modules
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));
jest.mock("@/components/context/SessionContext", () => ({
    useSession: jest.fn(),
}));
jest.mock("@/lib/auth", () => ({
    login: jest.fn(),
}));
jest.mock("@/validators/auth", () => ({
    usernameInput: { parse: jest.fn() },
    passwordInput: { parse: jest.fn() },
}));

describe("Page Component", () => {
    const mockPush = jest.fn();
    const mockRefreshSession = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        (usernameInput.parse as jest.Mock).mockImplementation(() => { return null });

        (passwordInput.parse as jest.Mock).mockImplementation(() => { return null });
    });

    it("redirects to login if session is null", () => {
        (useSession as jest.Mock).mockReturnValue({ session: null, refreshSession: mockRefreshSession });

        render(<Page />);

        expect(screen.getByText(/Please Login to view Account/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Login/i));
        expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("renders the form when session is available", () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testUser", token: "testToken" },
            refreshSession: mockRefreshSession,
        });

        render(<Page />);

        expect(screen.getByText(/testUser/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Current Password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("New Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    });

    it("validates username input", async () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testUser", token: "testToken" },
            refreshSession: mockRefreshSession,
        });

        (usernameInput.parse as jest.Mock).mockImplementation(() => {
            throw { errors: [{ message: "Invalid username", path: ["username"] }] };
        });

        render(<Page />);

        fireEvent.change(screen.getByPlaceholderText("New Username"), { target: { value: "invalidUser" } });
        fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText("Current Password"), { target: { value: "password123" } });

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("- Invalid username")).toBeInTheDocument();
        });
    });

    it("validates password input", async () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testUser", token: "testToken" },
            refreshSession: mockRefreshSession,
        });

        (passwordInput.parse as jest.Mock).mockImplementation(() => {
            throw { errors: [{ message: "Invalid password", path: ["password"] }] };
        });

        render(<Page />);

        fireEvent.change(screen.getByPlaceholderText("New Username"), { target: { value: "invalid" } });
        fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText("Current Password"), { target: { value: "password123" } });

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("- Invalid password")).toBeInTheDocument();
        });
    });

    it("shows error if current password is missing", async () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testUser", token: "testToken" },
            refreshSession: mockRefreshSession,
        });

        render(<Page />);

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText(/Current Password required/i)).toBeInTheDocument();
        });
    });

    it("handles API errors during submission", async () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testUser", token: "testToken" },
            refreshSession: mockRefreshSession,
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "API Error" }),
            })
        ) as jest.Mock;

        render(<Page />);

        fireEvent.change(screen.getByPlaceholderText("Current Password"), { target: { value: "password123" } });
        fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "newPassword" } });

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("API Error")).toBeInTheDocument();
        });
    });

    it("shows success message on successful submission", async () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testUser", token: "testToken" },
            refreshSession: mockRefreshSession,
        });

        (login as jest.Mock).mockResolvedValue({ success: true });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })
        ) as jest.Mock;

        render(<Page />);

        fireEvent.change(screen.getByPlaceholderText("Current Password"), { target: { value: "password123" } });
        fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "newPassword" } });

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Your information has been updated successfully!")).toBeInTheDocument();
        });
    }); 
});