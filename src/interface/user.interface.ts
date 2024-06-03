import { Request } from "express";


export interface userInterface {
    email: string;
    apiKey: string;
    otp: string;
    otpExpires:number
}

export interface URequest extends Request {
    user?: userInterface
}