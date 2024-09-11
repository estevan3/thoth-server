import { Request, Response } from "express";
import { Like, Repository } from "typeorm";
import Post from "../entities/post.js";
import ResponseError from "../errors/response.js";

const PostController = (service: Repository<Post>) => {
  const getOne = async (request: Request, response: Response) => {
    try {
      const post = await service.findOne({
        where: { id: request.params.postID },
        relations: { comments: true, post: true, author: true },
        select: { author: { id: true, nick: true, name: true } },
      });

      if (!post) {
        throw new ResponseError("Post not found.", 404);
      }

      return response.status(200).json({ post });
    } catch (error) {
      if (error instanceof ResponseError) {
        return response.status(error.statusCode).json({ messsage: error.message });
      }

      console.log({ error });
      return response.status(500).json({ message: "server internar error." });
    }
  };

  const get = async (request: Request, response: Response) => {
    try {
      const pageNumber = Number(request.query.page_number) || 1;
      const pageSize = Number(request.query.page_size) || 10;
      const [posts, total] = await service.findAndCount({
        where: request.query.search ? { content: Like(`%${request.query.search}%`) } : undefined,
        relations: { author: true },
        select: {
          id: true,
          content: true,
          created_at: true,
          updated_at: true,
          author: { id: true, nick: true, name: true },
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });
      return response.status(200).json({ posts, page: pageNumber, pages: Math.ceil(total / pageSize) });
    } catch (error) {
      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  const create = async (request: Request, response: Response) => {
    try {
      const createdPost = await service.create(request.body as Post);
      createdPost.author = request.user;
      const savedPost = await service.save(createdPost);
      return response.status(200).json({ post: savedPost });
    } catch (error) {
      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  const update = async (request: Request, response: Response) => {
    try {
      const result = await service.update(request.params.postID, request.body);
      if (!result) {
        throw new ResponseError("Post not found.", 404);
      }
      if (result.affected && result.affected < 1) {
        throw new ResponseError("No rows were affected", 400);
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
      const result = await service.delete(request.params.postID);
      if (!result) {
        throw new ResponseError("Post not found.", 404);
      }
      return response.status(404).json();
    } catch (error) {
      if (error instanceof ResponseError) {
        return response.status(error.statusCode).json({ message: error.message });
      }

      console.log({ error });
      return response.status(500).json({ message: "internal server error." });
    }
  };

  return { getOne, get, create, update, remove };
};

export default PostController;
