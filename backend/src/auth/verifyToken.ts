import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

dotenv.config();

const secret = process.env.JWT_SECRET;

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      console.log("no token recieved!!");
      res
        .status(401)
        .json({ seccess: false, message: "Unauthorised - no token provided" });
    } else {
      if (!secret) {
        throw new Error(
          "JWT_SECRET is not defined in the environment variables"
        );
      }
      console.log("token recieved!!");
      const tokenVerify = jwt.verify(token, secret);
      console.log("token verify: ",tokenVerify);
      
      if (!tokenVerify) {
        res.status(401).json({
          success: false,
          message: "Unauthorised - token is not valid",
        });
        return;
      }
      req.userId = (tokenVerify as JwtPayload).userId as string;

      next();
    }
  } catch (err) {
    console.log("error in verifytoken", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
    return;
  }
};
