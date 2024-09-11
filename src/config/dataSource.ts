import "reflect-metadata";
import { DataSource } from "typeorm";
import { databaseVars, serverVars } from "./env.js";

const appDataSource = new DataSource({
  type: "postgres",
  host: databaseVars.DB_HOST,
  port: databaseVars.DB_PORT,
  username: databaseVars.DB_USER,
  password: databaseVars.DB_PASS,
  database: databaseVars.DB_NAME,
  synchronize: serverVars.NODE_ENV === "development",
  logging: serverVars.NODE_ENV === "development",
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
});

export default appDataSource;
