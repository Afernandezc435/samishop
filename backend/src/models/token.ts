import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { Roles } from "../constants";

export interface IToken extends Document {
  jwt: string;
  attempts: number;
  locked: boolean;
  comparePassword: (enteredPassword: string) => boolean;
}

const tokenSchema = new Schema<IToken>({
  jwt: {
    type: String,
    required: true,
    unique: true,
  },
  attempts: {
    type: Number,
    required: true,
  },
  locked: {
    type: Boolean,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;