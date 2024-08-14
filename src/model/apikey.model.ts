import mongoose from "mongoose"

const apiKeySchema = new mongoose.Schema({
    apiKey: {
        type: String,
        require: true,    
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    }
    
})

const keys = mongoose.model('ApiKey', apiKeySchema)

export default keys
