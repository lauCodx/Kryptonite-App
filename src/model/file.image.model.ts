import mongoose from "mongoose"

const FileSchema = new mongoose.Schema({
    img:{
        name:String,
        data: String,
        contentType: String
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: "User"
    }
},
{
    timestamps: true
})

const ImageFile = mongoose.model("Image", FileSchema )

export default ImageFile