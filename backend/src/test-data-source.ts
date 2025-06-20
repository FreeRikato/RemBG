import { DataSource } from "typeorm";

export const TestDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "aravinthan",
    password: "postgres",
    database: "test_rembg_test",
    entities: ["src/entity/**/*.ts"],
    synchronize: true,
    dropSchema: true,
});
