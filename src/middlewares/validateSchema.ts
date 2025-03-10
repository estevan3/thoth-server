import { Request, Response, NextFunction } from "express";
import { AnyObject, ObjectSchema, ValidationError } from "yup";

export const validateSchema =
  (schema: ObjectSchema<AnyObject>) => async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body = await schema.validate(request.body, { stripUnknown: true, abortEarly: false });
      return next();
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return response.status(400).json({ errors: error.errors });
      }

      console.log({ error });
      return response.status(500).json({ error });
    }
  };
