
import fs from "fs"
import asycHandler from "express-async-handler"
import { Request, Response } from "express";
import { IUser, URequest } from "../interface/user.interface";
import User from "../model/user.model"
import File from "../model/file.model"

const generateApiKey = asycHandler(async(req:URequest, res:Response) =>{
    const userId = req.user?._id
    console.log(userId)

    const user = await User.findById(userId)
    if (user){
    const apiKey = Date.now() + Math.random().toString(36).substring(2);
    user.apiKey = apiKey;
    user.save() 
    
    res.status(201).send(apiKey)
    }else{
        res.status(400);
        throw new Error ("API key was not created successfully!")
    }
})


// const uploadImage = asycHandler(async(req:URequest, res:Response) =>{
//     const apiKey = req.headers ['x-api-key']
//     const userKey = req.user?.apiKey

//     const user = await User.findOne({userKey})

//     if (user){
//         const uploadImg = new File
//         uploadImg.img.data = fs.readFileSync(req.file.path).toString("base64")
//     }

// })


export {generateApiKey}