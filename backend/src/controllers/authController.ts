import { Request, Response } from 'express'
import User from '../models/user';
import { clearToken, generateToken } from '../utils/auth';
import {
    AuthenticationError,
  } from "../middleware/errorMiddleware";
  import asyncHandler from "express-async-handler";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password} = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400).json({message: "The user already exists"})
    }
    const user = await User.create({  name,email, password})
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({id: user._id, name: user.name, email: user.email})
    } else {
        res.status(400).json({message: "An error ocurred in creating the user"})
    }
})
const authenticateUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email})
    if (user && (await user.comparePassword(password))) {
        generateToken(res, user._id);
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
        })
    } else {
        res.status(401).json({message: "User Not Found/Password incorrect"})
    }
})
const logoutUser = asyncHandler(async(req: Request, res: Response) => {
    clearToken(res);
    res.status(200).json({
        message: "User logged out"
    })
})

export {registerUser, authenticateUser, logoutUser}