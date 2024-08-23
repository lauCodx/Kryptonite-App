import express from "express"
import validateToken from "../middlewares/validate"
import { generateApiKey, uploadImage } from "../controllers/file.controller"
import { upload } from "../middlewares/image.middleware"



const route = express.Router()

// route.use(validateToken)

route.get("/generate-apikey",validateToken, generateApiKey)
route.post("/upload", validateToken, upload.single('image'), uploadImage)

export default route;