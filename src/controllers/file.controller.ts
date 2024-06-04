
import fs from "fs"
import asycHandler from "express-async-handler"
import { Request, Response } from "express";
import { IUser, URequest } from "../interface/user.interface";
import User from "../model/user.model"
import Image from "../model/file.image.model"

const generateApiKey = asycHandler(async(req:URequest, res:Response) =>{
    const userId = req.user?._id

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


const uploadImage = asycHandler(async(req:URequest, res:Response) =>{
    const apiKey = req.headers ['x-api-key']
    const userKey = req.user?.apiKey

    const user = await User.findOne({userKey})

    if(userKey !== apiKey){
        res.status(400);
        throw new Error("API key not correct!")
    }

    if (user && req.file ){
    const userData = fs.readFileSync(req.file.path).toString('base64')

    const uploadImg = new Image({
        img:{
            data: userData,
            contentType:req.file.mimetype
        },
        user_id:req.user?._id,
    })

    await uploadImg.save()
    fs.unlinkSync(req.file.path)
    user.apiKey = undefined;
    user.save()

    res.status(200).send("File uploaded successfully!")

    }else{
        res.status(400);
        throw new Error("File was not successfully uploaded!")
    }   

})


export {generateApiKey, uploadImage}