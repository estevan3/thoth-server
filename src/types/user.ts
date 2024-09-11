import { JwtPayload } from "jsonwebtoken";

export interface IUserDecoded extends JwtPayload {
  id: string;
  nick: string;
  isAdmin: boolean;
}
