import { JwtPayload } from "jsonwebtoken";
import { IUserDecoded } from "./user";

declare global {
  namespace Express {
    export interface Request {
      user?: IUserDecoded;
    }
  }
}
