import { Request, Response } from 'express'
import User from '../models/user';
import { clearToken, generateToken } from '../utils/auth';
import asyncHandler from "express-async-handler";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password} = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400).json({message: "The user already exists"})
    }
    const user = await User.create({  name,email, password, attemps: 0, locked: false})
    if (!user) {
        res.status(400).json({message: "An error ocurred in creating the user"});
        return;
    }
    generateToken(res, {userId: user._id, userEmail: user.email, roles: user.roles});
    res.status(201).json({id: user._id, name: user.name, email: user.email})
})

const authenticateUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email})
    if (!user) {
        res.status(401).json({message: "User Not Found/Password incorrect"});
        return;
    }
    
    const addAttemp = () => {
        user!.attempts++;
        if (user!.attempts >= 3) {
            user!.locked = true;
        }
        User.updateOne({_id: user._id}, {...user})
      }
    try {
        if(!(await user.comparePassword(password))) {
            addAttemp()
            res.status(401).json({message: "Invalid Password"});
            return
        }
    } catch (error) {
        addAttemp()
        throw new Error('Invalid Password')
    }
    generateToken(res, {userId: user._id, userEmail: user.email, roles: user.roles});
    res.status(201).json({success: true})
})
const logoutUser = asyncHandler(async(req: Request, res: Response) => {
    clearToken(res);
    res.status(200).json({
        message: "User logged out"
    })
})

export {registerUser, authenticateUser, logoutUser}