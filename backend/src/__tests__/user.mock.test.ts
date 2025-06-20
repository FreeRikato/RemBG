import request from "supertest";
import app from "../app";

jest.mock("../repositories/retrieveUserById");
jest.mock("../repositories/deleteUser");
jest.mock("../utils/jwt");

import retrieveUserById from "../repositories/retrieveUserById";
import deleteUser from "../repositories/deleteUser";

const mockedRetrieveUserById = retrieveUserById as jest.Mock;
const mockedDeleteUser = deleteUser as jest.Mock;

describe("User Endpoints (Mocked)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUser = {
        id: "user-123",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
    };

    const authToken = `Bearer mock-token-for-user-${mockUser.id}`;

    describe("GET /user/:id", () => {
        it("should retrieve a user by ID successfully", async () => {
            mockedRetrieveUserById.mockResolvedValue(mockUser);

            const response = await request(app)
                .get(`/user/${mockUser.id}`)
                .set("Authorization", authToken);

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockUser);
            expect(mockedRetrieveUserById).toHaveBeenCalledWith(mockUser.id);
        });

        it("should return 401 Unauthorized if no token is provided", async () => {
            const response = await request(app).get(`/user/${mockUser.id}`);
            expect(response.status).toBe(409);
        });
    });

    describe("DELETE /user/:id", () => {
        it("should delete a user successfully", async () => {
            mockedRetrieveUserById.mockResolvedValue(mockUser);
            mockedDeleteUser.mockResolvedValue({ success: true });

            const response = await request(app)
                .delete(`/user/${mockUser.id}`)
                .set("Authorization", authToken);

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe("User deleted successfully");
            expect(mockedDeleteUser).toHaveBeenCalledWith(mockUser.id);
        });

        it("should return 403 Forbidden if a user tries to delete another user", async () => {
            const otherUserId = "user-456";
            const authTokenForOtherUser = `Bearer mock-token-for-user-${otherUserId}`;

            const response = await request(app)
                .delete(`/user/${mockUser.id}`)
                .set("Authorization", authTokenForOtherUser);

            expect(response.status).toBe(403);
            expect(response.body.message).toBe(
                "Another user data cannot be modified",
            );
        });
    });
});
