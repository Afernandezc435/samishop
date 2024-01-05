import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import User from "../models/user";
import Token from "../models/token";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "./errorMiddleware";

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.cookies.jwt;

      if (!token) {
        throw new AuthenticationError("Token not found");
      }
      
      let validationToken = await Token.findOne({jwt: token});

      if (!validationToken) {
        validationToken = await Token.create({jwt: token, attempts: 1, locked: false});
      }

      const addAttemp = () => {
        validationToken!.attempts++;
        if (validationToken!.attempts >= 3) {
          validationToken!.locked = true;
        }
        Token.updateOne({jwt: validationToken!.jwt}, {...validationToken})
      }
      
      if (validationToken!.locked) {
        throw new AuthenticationError("JWT locked");
      }

      const jwtSecret = process.env.JWT_SECRET || "";
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded || !decoded.userId) {
        addAttemp();
        throw new AuthenticationError("UserId not found");
      }

      const user = await User.findById(decoded.userId, "_id name email");

      if (!user) {
        addAttemp();
        throw new AuthenticationError("User not found");
      }
      console.log('auth user: ', user)
      req.body = user;
      next();
    } catch (e) {
      console.log(e);
      throw new AuthenticationError("Invalid token");
    }
  }
);

export { authenticate };