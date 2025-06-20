import request from "supertest";
import app from "../app";
import { TestDataSource } from "../test-data-source";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import IORedis, { Redis } from "ioredis";

jest.unmock("ioredis");
jest.unmock("bullmq");
jest.unmock("../data-source");

jest.mock("../repositories/repository", () => ({
    get userRepository() {
        return TestDataSource.getRepository(User);
    },
    get imageRepository() {
        const { Image } = require("../entity/Images");
        return TestDataSource.getRepository(Image);
    },
}));

let canRunIntegrationTests = false;
let connection: DataSource;
let redisClient: Redis;

beforeAll(async () => {
    try {
        connection = await TestDataSource.initialize();
        redisClient = new IORedis();
        await redisClient.ping();
        canRunIntegrationTests = true;
    } catch (err) {
        console.warn(
            "\n[SKIP] Could not connect to PostgreSQL/Redis. Skipping integration tests.",
        );
    }
});

afterAll(async () => {
    if (connection) await connection.destroy();
    if (redisClient) await redisClient.quit();
});

const integrationDescribe = () =>
    canRunIntegrationTests ? describe : describe.skip;

integrationDescribe()("Auth Endpoints (Integration)", () => {
    beforeEach(async () => {
        const repository = connection.getRepository(User);
        await repository.clear();
    });

    const testUser = {
        email: "testuser@example.com",
        password: "password123",
    };

    describe("POST /auth/register", () => {
        it("should register a new user and return a token", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send(testUser);
            expect(response.status).toBe(201);
            expect(response.body.data.user.email).toBe(testUser.email);
        });

        it("should fail to register a user that already exists", async () => {
            await request(app).post("/auth/register").send(testUser);
            const response = await request(app)
                .post("/auth/register")
                .send(testUser);
            expect(response.status).toBe(409);
        });
    });

    describe("POST /auth/login", () => {
        beforeEach(async () => {
            await request(app).post("/auth/register").send(testUser);
        });

        it("should log in an existing user and return a token", async () => {
            const response = await request(app)
                .post("/auth/login")
                .send(testUser);
            expect(response.status).toBe(200);
            expect(response.body.data.token).toBeDefined();
        });

        it("should fail to log in with an incorrect password", async () => {
            const response = await request(app).post("/auth/login").send({
                email: testUser.email,
                password: "wrongpassword",
            });
            expect(response.status).toBe(401);
        });

        it("should fail to log in a non-existent user", async () => {
            const response = await request(app).post("/auth/login").send({
                email: "nouser@example.com",
                password: "password123",
            });
            expect(response.status).toBe(401);
        });
    });
});
