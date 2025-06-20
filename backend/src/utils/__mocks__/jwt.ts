export const generateToken = jest.fn(
    ({ id }: { id: string }) => `mock-token-for-user-${id}`,
);

export const validateToken = jest.fn((token: string) => {
    if (token.startsWith("mock-token-for-user-")) {
        const id = token.replace("mock-token-for-user-", "");
        return { id };
    }
    const { HttpError } = require("../../middlewares/error.middleware");
    const { HttpStatusCode } = require("../../types/HTTPStatusCode.enum");
    throw new HttpError("Invalid JWT Token", HttpStatusCode.CONFLICT);
});
