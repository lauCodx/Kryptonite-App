import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"
import { URequest, authRequest } from "../interface/user.interface";
import User from "../model/user.model"




const validateToken = async(req:URequest, res:Response, next:NextFunction) =>{
    const authHeader = req.headers ['authorization'];

try {

    if (!authHeader && !(authHeader?.startsWith("Bearer"))){
        res.status(400);
        throw new Error ("No token provided, access denied")
    };

    const token = authHeader.split(" ")[1];
    const decoded : any = jwt.verify(token, process.env.ACCESS_KEY as string);
    const user = await User.findById (decoded._id)
    if(!user){
        res.status(404);
        throw new Error("User not found, Authorization denied!")
    }

    req.user = decoded
    next()

}catch (error) {
    next(error)
}
}

export default validateToken