import request from "supertest";
import app from "../app";

jest.mock("../services/png.services");
jest.mock("../utils/jwt");

import { uploadImage } from "../services/png.services";

const mockedUploadImage = uploadImage as jest.Mock;

describe("PNG Endpoints (Mocked)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUserId = "user-abc";
    const authToken = `Bearer mock-token-for-user-${mockUserId}`;

    describe("POST /png/upload", () => {
        it("should upload an image and enqueue a job", async () => {
            const mockResponse = {
                signedUrl: "http://s3.mock.url/image.png",
                job: { id: "job-123" },
            };
            mockedUploadImage.mockResolvedValue(mockResponse);

            const response = await request(app)
                .post("/png/upload")
                .set("Authorization", authToken)
                .attach(
                    "image",
                    Buffer.from("fake image data"),
                    "test-image.png",
                );

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Image uploaded successfully");
            expect(response.body.url).toBe(mockResponse.signedUrl);
            expect(response.body.job.id).toBe(mockResponse.job.id);

            expect(mockedUploadImage).toHaveBeenCalledWith(
                "original",
                expect.objectContaining({
                    originalname: "test-image.png",
                    mimetype: "image/png",
                }),
                mockUserId,
            );
        });

        it("should return 400 Bad Request if no file is uploaded", async () => {
            const response = await request(app)
                .post("/png/upload")
                .set("Authorization", authToken);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("No file present in request");
        });
    });
});
