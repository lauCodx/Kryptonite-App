import express from "express"
import { currentUser, loginOtp, loginUser, registerUser, sendOtpRegistration } from "../controllers/user.controller";
import validateToken from "../middlewares/validate";

const route = express.Router();

route.post("/send-otp", sendOtpRegistration)
route.post("/register-user", registerUser)
route.post("/send-passcode", loginOtp)
route.post ("/login", loginUser)
route.get("/currentuser", validateToken, currentUser)

export default route;