import { Request } from "express";
import mongoose, { Document, ObjectId } from "mongoose";


export interface userInterface {
    _id: string;
    email: string;
    apiKey: string;
    user_id :string;
   
}

interface ApiUser {

    _id:string;
    apiKey:string;
    user_Id: ObjectId
}

export interface authRequest extends Request{
    userApi?: ApiUser
}


export interface URequest extends Request {
    user?: userInterface
    
}

export interface IUser extends Document{
    user_Id?:mongoose.Types.ObjectId;
    img: string
}