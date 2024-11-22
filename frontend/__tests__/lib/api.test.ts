import {
    fetchUsers,
    fetchFlashcardSets,
    fetchUserFlashcardSets,
    fetchFlashcardCommentSet,
    fetchCollections,
} from "@/lib/api";
  
describe("API Fetch Functions", () => {
  
    beforeEach(() => {
        jest.resetAllMocks();
    });
  
    describe("fetchUsers", () => {
        it("should return a list of users on success", async () => {
            const mockUsers = [{ id: 1, username: "testuser", admin: false }];
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockUsers }),
                }),
            ) as jest.Mock;
  
            const result = await fetchUsers();
            expect(result).toEqual(mockUsers);
            expect(fetch).toHaveBeenCalledWith(`undefined/api/users`, {
                method: "GET",
                headers: { "content-type": "application/json" },
            });
        });
  
        it("should return null on fetch error", async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;
  
            const result = await fetchUsers();
            expect(result).toBeNull();
        });
    });
  
    describe("fetchFlashcardSets", () => {
        it("should return flashcard sets on success", async () => {
            const mockFlashcardSets = [{ id: 1, name: "Set 1", user_id: 1 }];
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockFlashcardSets }),
                }),
            ) as jest.Mock;
  
            const result = await fetchFlashcardSets();
            expect(result).toEqual(mockFlashcardSets);
            expect(fetch).toHaveBeenCalledWith(`undefined/api/sets`, {
                method: "GET",
                headers: { "content-type": "application/json" },
            });
        });
  
        it("should return null on fetch error", async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;
  
            const result = await fetchFlashcardSets();
            expect(result).toBeNull();
        });
    });
  
    describe("fetchUserFlashcardSets", () => {
        it("should return user-specific flashcard sets on success", async () => {
            const mockFlashcardSets = [{ id: 1, name: "Set 1", user_id: 1 }];
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockFlashcardSets }),
                }),
            ) as jest.Mock;
  
            const result = await fetchUserFlashcardSets("1");
            expect(result).toEqual(mockFlashcardSets);
            expect(fetch).toHaveBeenCalledWith(`undefined/api/users/1/sets`, {
                method: "GET",
                headers: { "content-type": "application/json" },
            });
        });
  
        it("should return null if userId is invalid", async () => {
            const result = await fetchUserFlashcardSets("");
            expect(result).toBeNull();
        });
  
        it("should return null on fetch error", async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;
  
            const result = await fetchUserFlashcardSets("1");
            expect(result).toBeNull();
        });
    });
  
    describe("fetchFlashcardCommentSet", () => {
        it("should return flashcard comments on success", async () => {
            const mockCommentSet = { id: 1, comments: [{ id: 1, content: "Great card!" }] };
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockCommentSet }),
                }),
            ) as jest.Mock;
  
            const result = await fetchFlashcardCommentSet("1");
            expect(result).toEqual(mockCommentSet);
            expect(fetch).toHaveBeenCalledWith(`undefined/api/sets/1`, {
                method: "GET",
                headers: { "content-type": "application/json" },
            });
        });
  
        it("should return null if flashcardSetId is invalid", async () => {
            const result = await fetchFlashcardCommentSet("");
            expect(result).toBeNull();
        });
  
        it("should return null on fetch error", async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;
  
            const result = await fetchFlashcardCommentSet("1");
            expect(result).toBeNull();
        });
    });
  
    describe("fetchCollections", () => {
        it("should return collections on success", async () => {
            const mockCollections = [{ id: 1, name: "Collection 1" }];
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockCollections }),
                }),
            ) as jest.Mock;
  
            const result = await fetchCollections();
            expect(result).toEqual(mockCollections);
            expect(fetch).toHaveBeenCalledWith(`undefined/api/collections`, {
                method: "GET",
                headers: { "content-type": "application/json" },
            });
        });
  
        it("should return null on fetch error", async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;
  
            const result = await fetchCollections();
            expect(result).toBeNull();
        });
    });
});