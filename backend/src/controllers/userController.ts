import { Request, Response } from "express";
import User from "../models/user";

const getUser = async (req: Request, res: Response) => {
  console.log('user: ', req.body)
  const userId = req.body._id;
  const user = await User.findById(userId, "name email");

  if (!user) {
    res.status(400);
  }

  res.status(200).json(user);
};

export { getUser };