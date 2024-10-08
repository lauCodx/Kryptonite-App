
import fs from "fs"
import asycHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express";
import { IUser, URequest, userInterface } from "../interface/user.interface";
import User from "../model/user.model"
import Image from "../model/file.image.model"
import path from "path"
import { getAllImage, getImage } from "../service/file.service";


export const generateApiKey = async(req:URequest, res:Response, next: NextFunction) =>{
    const userId = req.user?._id
    console.log(userId)

    try {
        
    const user = await User.findOne({_id:userId})
    // console.log(user)

    if (user){
        const apiKey = Date.now() + Math.random().toString(36).substring(2);

        user.apiKey = apiKey;
        await user.save()
    
       res.status(201).send(apiKey)
        
    }else{
        throw new Error ("Error creating API key!")
    }  
        
    } catch (error) {
        next (error)
    }
}


export const uploadImage = async(req:URequest, res:Response, next: NextFunction) =>{
    const {apiKey} = req.body
    const userId = req.user?._id
    
   
   try {

    if(!apiKey){
        res.status(404)
        throw new Error("No API key found")
    }

    const getKey = await User.findOne({apiKey:apiKey})


    if(!getKey){
        res.status(400);
        throw new Error("Error validating API key")
    }

   const user = await User.findOne({_id: userId})



    if (user && req.file ){
        const imgPath = req.file.path;
        const imgData = fs.readFileSync(imgPath)

        const imgBase64 = imgData.toString("base64")
        const uploadImg = new Image({
            img:{
                name: req.file.filename,
                data:imgBase64,
                contentType:req.file.mimetype
            },
            user_id:req.user?._id,
        })

        await uploadImg.save()
        fs.unlinkSync(imgPath)
        
        user.apiKey = undefined
        await user.save()
        res.status(200).send("File uploaded successfully!");
        return;
    }else{
        res.status(400);
        throw new Error ("Error uploading a file")
    }
    
   } catch (error) {
      next(error)
   }

}

export const getAllImages = async (req:URequest, res:Response, next: NextFunction)=>{
    const user_id: string | any = req.user?._id
    

   try {
    const images = await getAllImage({user_id})

    if(images.length === 0){
        return res.status(200).send("No image found")
    }

    const imgBuffer = images.map(image =>{
       
       if(image.img?.data){
        return {
    
            name: image.img?.name,
            contentType:image.img?.contentType,
            data:Buffer.from(image.img?.data, 'base64').toString('base64')
        }
       }else{
        return null
       }
       
    }).filter(image => image !== null)

    return res.status(200).json(imgBuffer)
    
   } catch (error) {
        next(error)
   }  
}

export const getSingleImage = async (req:URequest, res:Response, next: NextFunction) =>{
    const {id} = req.params;
    const user_id = req.user?._id

    try {

        if (!id || !user_id){
            res.status(400);
            throw new Error ("Invalid IDs")
        };

        const images = await getImage(id);
            
        if(!images){
            res.status(400);
            throw new Error("Image not found")
        }

        if(!images.img?.data){
            res.status(400);
            throw new Error ("Image data is missing!")
        }

        const imgBuffer = Buffer.from(images.img?.data, 'base64');

        res.status(200).json(imgBuffer)
        
    } catch (error) {
        next(error)
    }
}

