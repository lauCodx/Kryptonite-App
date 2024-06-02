import { ErrorRequestHandler, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../model/user.model";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import client from "../config/local.db";

const sendOtpRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email required");
    }
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      res.status(400);
      throw new Error("User already exist!");
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    client.set(email, otp, "EX", 300, (err:ErrorRequestHandler, reply:string) =>{
      if (err){
        console.log("OTP was not set successfully " + err)
      }else {
        console.log("OTP was set successfully " + reply)
      }
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, //ssl
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions: string | any = {
      from: process.env.EMAIL,
      to: email,
      subject: "Kryptonite App",
      text: `Your recovery code is \n\n${otp}\n\nIt will expire in 5 mins`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Recovery code sent, check your mail");
      }
    });
  }
);

const registerUser = asyncHandler(async (req:Request, res:Response) =>{
  const {email, otp} = req.body;

  if (!email || !otp){
    res.status(400);
    throw new Error ("All field are mandatory")
  }

  const checkEmail = await User.findOne({email: email.toLowerCase()})
  if (!checkEmail){
    res.status(400)
    throw new Error("User does not exist!") 
  }

  
})

export { sendOtpRegistration };
