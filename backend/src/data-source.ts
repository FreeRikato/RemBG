import "reflect-metadata";
import { DataSource } from "typeorm";

/*
 * Here I have used a docker instance to run postgres with the command,
 *  docker run --name RemBG \
 * -e POSTGRES_USER=aravinthan \
 * -e POSTGRES_PASSWORD=postgres \
 * -e POSTGRES_DB=RemBG \
 * -p 5432:5432 \
 * -v pg_data:/var/lib/postgresql/data \
 * -d postgres
 */

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "aravinthan",
    password: "postgres",
    database: "RemBG",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"], // Setting up this way i would not need to import each entities
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
});
