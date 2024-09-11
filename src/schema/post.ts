import { object, string } from "yup";

export const postSchema = object({
  content: string().required(),
});

export const postUpdateSchema = object({
  content: string(),
});
