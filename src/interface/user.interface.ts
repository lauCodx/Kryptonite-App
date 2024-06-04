import { Request } from "express";
import mongoose, { Document } from "mongoose";


export interface userInterface {
    _id: string
    email: string;
    apiKey: string;
    user_Id :string;
   
}

export interface URequest extends Request {
    user?: userInterface
    
}

export interface IUser extends Document{
    user_Id?:mongoose.Types.ObjectId;
    img: string
}