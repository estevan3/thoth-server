import { Router } from "express";
import PostController from "../controllers/post.js";
import Post from "../entities/post.js";
import { tokenAuth } from "../middlewares/auth.js";
import Service from "../service/index.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { postSchema, postUpdateSchema } from "../schema/post.js";

const postRouter = Router();
const postController = PostController(Service(Post));

postRouter.get("/", tokenAuth("unauthenticated"), postController.get);
postRouter.get("/:postID", tokenAuth("unauthenticated"), postController.getOne);
postRouter.post("/", tokenAuth(), validateSchema(postSchema), postController.create);
postRouter.patch("/:postID", tokenAuth(), validateSchema(postUpdateSchema), postController.update);
postRouter.delete("/:postID", tokenAuth(), postController.remove);

export default postRouter;
