import { Request } from "express";


export interface userInterface {
    email: string;
    apiKey: string;
}

export interface URequest extends Request {
    user?: userInterface
}