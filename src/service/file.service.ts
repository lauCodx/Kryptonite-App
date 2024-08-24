import { FilterQuery } from "mongoose"
import Image from "../model/file.image.model"
import { imgFile } from "../interface/file.interface"

export const getAllImage = async (filter:FilterQuery<imgFile>) =>{
    return await Image.find(filter)
}

export const getImage = async (id:string) =>{
    return await Image.findById(id)
}