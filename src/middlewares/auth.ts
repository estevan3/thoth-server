import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Permission } from "../types/auth.js";
import Service from "../service/index.js";
import User from "../entities/user.js";
import ResponseError from "../errors/response.js";
import { IUserDecoded } from "../types/user.js";
import { serverVars } from "../config/env.js";

export const tokenAuth =
  (...permission: Permission[]) =>
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userService = Service(User);
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        if (permission.includes("unauthenticated")) {
          return next();
        }
        throw new ResponseError("token not found", 401);
      }

      const decoded = jwt.verify(token, serverVars.SECRET as string) as IUserDecoded;

      const user = await userService.findOne({ where: { id: decoded.id } });
      if (!user) {
        throw new ResponseError("non-existent user credential detected", 403);
      }

      if (permission.includes("admin") && !user.isAdmin) {
        throw new ResponseError("user is not admin", 403);
      }

      request.user = decoded;
      return next();
    } catch (error: any) {
      if (error instanceof ResponseError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return response.status(401).json({ message: error.message });
      }
      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };
