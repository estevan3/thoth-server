import { date, object, string } from "yup";

export const userSchema = object({
  nick: string().required(),
  birthdate: date().required(),
  email: string().email().required(),
  password: string().required(),
});

export const userUpdateSchema = object({
  nick: string(),
  birthdate: date(),
  email: string().email(),
  password: string(),
});

export const userLoginSchema = object({
  nick: string().required(),
  password: string().required(),
});
