import express from "express"
import cors from  "cors"
import dbConnect from "./config/db.connect"
import errorHandler from "./middlewares/error.handler"
require("dotenv").config()

const app = express()

dbConnect()
app.use(express.urlencoded({extended:false}))
app.use(cors())

const port = process.env.PORT || 5000

app.listen(port, () =>{
    console.log("Server running on Port " + port)
})

app.use(errorHandler)