import { config } from "dotenv";

config();

export const databaseVars = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
};
export const adminVars = {
  ADMIN_NICK: process.env.ADMIN_NICK,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_BIRTH: process.env.ADMIN_BIRTH,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASS: process.env.ADMIN_PASS,
};
export const serverVars = {
  SECRET: process.env.SERVER_SECRET,
  PORT: process.env.SERVER_PORT,
  SALT: Number(process.env.SERVER_SALT),
  NODE_ENV: process.env.NODE_ENV,
};
