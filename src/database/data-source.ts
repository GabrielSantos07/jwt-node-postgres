import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"

export const AppDataSource = new DataSource({
    migrationsTableName: 'migrations',
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "teste123",
    database: "jwtTest",
    entities: [User],
    migrations: ["./src/database/migrations/**.ts"]
})