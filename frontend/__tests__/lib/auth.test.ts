import { register, login, logout, checkSession } from "@/lib/auth";

describe("Authentication Functions", () => {
    const mockCredentials = {
        username: "testuser",
        password: "testpassword",
    };

    const mockUser = {
        id: 1,
        username: "testuser",
        admin: false,
        token: "mock-token",
    };

    beforeEach(() => {
        jest.resetAllMocks();
        localStorage.clear();

    });

    describe("register", () => {
        it("should return success when registration is successful", async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({}),
                }),
            ) as jest.Mock;

            const result = await register(mockCredentials);

            expect(result).toEqual({ success: true });
            expect(fetch).toHaveBeenCalledWith(
                "undefined/api/users/register",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(mockCredentials),
                }),
            );
        });

        it("should return username error if user already exists", async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 403,
                    json: () => Promise.resolve({}),
                }),
            ) as jest.Mock;

            const result = await register(mockCredentials);

            expect(result).toEqual({ success: false, username: "User already exists" });
        });
    });

    describe("login", () => {
        it("should return success and user when login is successful", async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        id: 1,
                        username: "testuser",
                        admin: false,
                        token: { token: "mock-token" },
                    }),
                }),
            ) as jest.Mock;

            const result = await login(mockCredentials);

            expect(result).toEqual({ success: true, user: mockUser });
            expect(localStorage.getItem("user")).toEqual(JSON.stringify(mockUser));
        });
    });

    describe("logout", () => {
        it("should remove the user from localStorage", async () => {
            localStorage.setItem("user", JSON.stringify(mockUser));

            await logout();

            expect(localStorage.getItem("user")).toBeNull();
        });
    });

    describe("checkSession", () => {
        it("should return true if user exists in localStorage", async () => {
            localStorage.setItem("user", JSON.stringify(mockUser));

            const result = await checkSession();

            expect(result).toBe(true);
        });

        it("should return false if user does not exist in localStorage", async () => {
            const result = await checkSession();

            expect(result).toBe(false);
        });
    });
});