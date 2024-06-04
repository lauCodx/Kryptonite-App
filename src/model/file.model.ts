import mongoose from "mongoose";
import {IUser} from "../interface/user.interface"

const fileSchema = new mongoose.Schema({
    user_Id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
    },
    img:{
        data: String,
        contentType: String
    }
},
{
    timestamps:true
    

})

const file = mongoose.model('Image', fileSchema)

export default file