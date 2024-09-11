import { Request, Response } from "express";
import { Like, QueryFailedError, Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../entities/user.js";
import { serverVars } from "../config/env.js";
import ResponseError from "../errors/response.js";

const UserController = (service: Repository<User>) => {
  const getOne = async (request: Request, response: Response) => {
    try {
      const { userID } = request.params;
      const user = await service.findOne({
        where: { id: userID },
        relations: { posts: true },
        select: {
          id: true,
          nick: true,
          name: true,
          birthdate: true,
          email: request.user?.isAdmin,
          isAdmin: true,
          create_at: true,
        },
      });

      if (!user) {
        throw new ResponseError("User not found.", 404);
      }

      return response.status(200).json({ user });
    } catch (error) {
      if (error instanceof ResponseError) {
        return response.status(error.statusCode).json({ message: error.message });
      }

      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  const get = async (request: Request, response: Response) => {
    try {
      const pageNumber = Number(request.query.page_number) || 1;
      const pageSize = Number(request.query.page_size) || 10;
      const [users, total] = await service.findAndCount({
        where: request.query.search ? { name: Like(`%${request.query.search}%`) } : undefined,
        select: {
          id: true,
          nick: true,
          name: true,
          birthdate: true,
          email: request.user?.isAdmin,
          isAdmin: true,
          create_at: true,
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });
      console.log({ users });
      return response.status(200).json({ users, page: pageNumber, pages: Math.ceil(total / pageSize) });
    } catch (error) {
      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  const create = async (request: Request, response: Response) => {
    try {
      let { password, birthdate, ...userPartial } = request.body;
      birthdate = new Date(birthdate).toISOString().split("T");
      password = await hash(password, serverVars.SALT);
      const createdUser = await service.create({ birthdate, password, ...userPartial } as User);
      const savedUser = await service.save(createdUser);
      const newUser = await service.findOne({
        where: { id: savedUser.id },
        select: {
          id: true,
          nick: true,
          name: true,
          birthdate: true,
          email: true,
          isAdmin: true,
          create_at: true,
        },
      });
      return response.status(200).json({ user: newUser });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const customError = error as QueryFailedError & { detail: string };
        return response.status(400).json({ message: customError.detail });
      }
      console.log({ error });
      return response.status(500).json({ message: "server internal error." });
    }
  };

  const update = async (request: Request, response: Response) => {
    try {
      const result = await service.update(request.params.userID, request.body);
      if (!result) {
        throw new ResponseError("User not found.", 404);
      }
      if (result.affected && result.affected < 1) {
        throw new ResponseError("No rows were affected.", 400);
      }
      return response.status(204).json();
    } catch (error) {
      if (error instanceof ResponseError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  const remove = async (request: Request, response: Response) => {
    try {
      const result = await service.delete(request.params.userID);
      if (!result) {
        throw new ResponseError("User not found.", 404);
      }

      return response.status(204).json();
    } catch (error) {
      if (error instanceof ResponseError) {
        return response.status(error.statusCode).json({ message: error.message });
      }

      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  const login = async (request: Request, response: Response) => {
    try {
      const { nick, password } = request.body;
      const user = await service.findOneBy({ nick });
      if (!user) {
        throw new ResponseError("User not found.", 404);
      }
      if (!(await compare(password, user.password))) {
        throw new ResponseError("incorrect password.", 401);
      }
      const token = await jwt.sign(
        { id: user.id, nick: user.nick, isAdmin: user.isAdmin },
        serverVars.SECRET as string,
        {
          expiresIn: "1d",
        }
      );

      return response.status(200).json({ message: "login successful", token });
    } catch (error) {
      if (error instanceof ResponseError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  return { get, getOne, create, update, remove, login };
};

export default UserController;
