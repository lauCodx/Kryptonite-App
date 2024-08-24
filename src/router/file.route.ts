import express from "express"
import validateToken from "../middlewares/validate"
import { generateApiKey, getAllImages, getSingleImage, uploadImage } from "../controllers/file.controller"
import { upload } from "../middlewares/image.middleware"



const route = express.Router()

// route.use(validateToken)
route.use(validateToken)
route.get("/generate-apikey", generateApiKey)
route.post("/upload", upload.single('image'), uploadImage)
route.get("/image", getAllImages)
route.get("/image/:id", getSingleImage)

export default route;