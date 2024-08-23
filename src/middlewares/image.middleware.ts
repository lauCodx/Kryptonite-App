import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, 'Images')
    },
    filename:(req, file, cb) =>{

        const date = Date.now()
        const fileName = path.extname(file.originalname);
        cb (null, date + fileName)
    }
})

export const upload = multer({storage: storage})