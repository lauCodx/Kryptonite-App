import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        lowercase: true
    },
    apiKey: String,

},

{ 
    timestamps: true
}
)

const User = mongoose.model("User", UserSchema)

export default User