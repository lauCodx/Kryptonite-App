import multer from "multer"
import express from "express"
import validateToken from "../middlewares/validate"
import { generateApiKey,} from "../controllers/file.controller"

const route = express.Router()

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, 'Images')
    },
    filename:(req, file, cb) =>{
        cb (null, file.originalname)
    }
})

const upload = multer({storage: storage})

route.get("/generate-apikey", validateToken, generateApiKey)
// route.post("/upload", upload.single('image'),  uploadImage)

export default route;