import { Request, Response, NextFunction } from "express";

export const timeLogger = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(
    `[Middleware] IP:${ip}, METHOD: ${req.method}, ${
      req.path
    }, Time: ${now.toLocaleDateString()}-${now.toLocaleTimeString()}`
  );

  return next();
};
