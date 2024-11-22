/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import UserManagementPage from "@/app/(root)/admin/page";
import { useSession } from "@/components/context/SessionContext";
import { useUsers } from "@/components/context/UsersContext";
import { useRouter } from "next/navigation";

jest.mock("@/components/context/SessionContext", () => ({
    useSession: jest.fn(),
}));

jest.mock("@/components/context/UsersContext", () => ({
    useUsers: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("UserManagementPage", () => {
    const mockPush = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockSetHref = jest.fn();
    const originalLocation = window.location;

    beforeAll(() => {
        (window as any).location = undefined;
        window.location = { href: "" } as any;
        window.alert = jest.fn();
    });

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        window.location = originalLocation;
    });

    it("renders login message for unauthenticated users", () => {
        (useSession as jest.Mock).mockReturnValue({ session: null });
        (useUsers as jest.Mock).mockReturnValue({
            users: { id: 1, admin: false } ,
        });
        render(<UserManagementPage />);

        expect(
            screen.getByText("Please Login with an admin account to view Admin Page!")
        ).toBeInTheDocument();

        // Simulate login link click
        fireEvent.click(screen.getByText("Please Login with an admin account to view Admin Page!"));
        expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("renders user management form for admin users", () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, admin: true } ,
        });
        (useUsers as jest.Mock).mockReturnValue({
            users: [{ id: 1, username: "JohnDoe", admin: false }],
        });

        render(<UserManagementPage />);

        expect(screen.getByLabelText("Select a User")).toBeInTheDocument();
    });

    it("handles user selection", () => {
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, admin: true },
        });
        (useUsers as jest.Mock).mockReturnValue({
            users: [{ id: 1, username: "JohnDoe", admin: false }],
        });
    
        render(<UserManagementPage />);
        const dropdown = screen.getByLabelText("Select a User");
    
        // Change the dropdown value
        fireEvent.change(dropdown, { target: { value: "1" } });
    
        // Get all elements with display value "JohnDoe"
        const elements = screen.getAllByDisplayValue("JohnDoe");
    
        // Assert the dropdown contains the value "JohnDoe"
        expect(elements[0].tagName).toBe("SELECT");
        expect(elements[0]).toBe(dropdown);
    
        // Assert the input field contains the value "JohnDoe"
        expect(elements[1].tagName).toBe("INPUT");
        expect(elements[1]).toBeInTheDocument();
    });
});