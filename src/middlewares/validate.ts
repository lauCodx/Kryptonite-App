import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"


const validateToken = asyncHandler(async(req:Request, res:Response, next:NextFunction) =>{
    const authHeader = req.headers ['authorization'];

    if (!authHeader) {
        res.status(400);
        throw new Error("No authorization found!")
    }

    if (authHeader && (authHeader.startsWith("Bearer"))){
        
    }
})