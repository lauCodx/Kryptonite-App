import mongoose, { Document } from "mongoose"


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        lowercase: true
    },
    
    apiKey:{
        type: String,
        require: true
    }

},
{ 
    timestamps: true
}
)

const User = mongoose.model("User", UserSchema)

export default User