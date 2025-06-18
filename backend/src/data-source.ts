import "reflect-metadata";
import { DataSource } from "typeorm";

/*
 * Here I have used a docker instance to run postgres with the command,
 *  docker run --name RemBG \
 * -e postgres_user=aravinthan \
 * -e postgres_password=postgres \
 * -e postgres_db=test_rembg \
 * -p 5432:5432 \
 * -v pg_data:/var/lib/postgresql/data \
 * -d postgres
 *
 *  ❌ Most importantly don't use Capital letters for database name
 */

export const AppDataSource = new DataSource({
    type: "postgres",
    port: 5432,
    username: "aravinthan",
    password: "postgres",
    database: "test_rembg",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"], // Setting up this way i would not need to import each entities
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
});
