
import fs from "fs"
import asycHandler from "express-async-handler"
import { Request, Response } from "express";
import { IUser, URequest } from "../interface/user.interface";
import User from "../model/user.model"
import Image from "../model/file.image.model"
import ApiKey from "../model/apikey.model"

const generateApiKey = asycHandler(async(req:URequest, res:Response) =>{
    const userId = req.user?._id


    const user = await User.find({userId})

    if (user){
        const apiKey = Date.now() + Math.random().toString(36).substring(2);

        await ApiKey.create({
           apiKey,
           user_id: req.user?._id
       })
    
       res.status(201).send(apiKey)
        
    }else{
        throw new Error ("Error creating API key!")
    }  
})


const uploadImage = asycHandler(async(req:URequest, res:Response) =>{
    const apiKey: string | any = req.header("x-api-key")
    const userKey = req.user?.apiKey
    const userId = req.user?._id
    
   
    const getKey = await ApiKey.findOne({userKey})

   if (!(getKey === apiKey )){
    res.status(400);
    throw new Error("Error validating API key, check the API key provided")
   }

   const user = await User.findOne({userId})

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
    user.save()

    await ApiKey.findOneAndDelete({userKey})

    res.status(200).send("File uploaded successfully!")

    }else{
        res.status(400);
        throw new Error("File was not successfully uploaded!")
    }   

})


export {generateApiKey, uploadImage}