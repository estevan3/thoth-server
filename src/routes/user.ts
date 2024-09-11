import { Router } from "express";
import UserController from "../controllers/user.js";
import Service from "../service/index.js";
import User from "../entities/user.js";
import { tokenAuth } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { userLoginSchema, userSchema, userUpdateSchema } from "../schema/user.js";

const userRouter = Router();
const userController = UserController(Service(User));

userRouter.get("/", tokenAuth("unauthenticated"), userController.get);
userRouter.get("/:userID", tokenAuth("unauthenticated"), userController.getOne);
userRouter.post("/", validateSchema(userSchema), userController.create);
userRouter.post("/login", validateSchema(userLoginSchema), userController.login);
userRouter.patch("/:userID", tokenAuth(), validateSchema(userUpdateSchema), userController.update);
userRouter.delete("/:userID", tokenAuth(), userController.remove);

export default userRouter;
