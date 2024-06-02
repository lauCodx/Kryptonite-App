import express from "express"
import { sendOtpRegistration } from "../controllers/user.controller";

const route = express.Router();

route.get("/sendotp", sendOtpRegistration)

export default route;