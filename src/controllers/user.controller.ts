import { ErrorRequestHandler, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../model/user.model";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { URequest } from "../interface/user.interface";
import {Otp} from "../model/otp.model"

const sendOtpRegistration = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email required!");
    }
    const checkUser = await User.findOne({email: email.toLowerCase()})

    if(checkUser){
      res.status(404);
      throw new Error ("User already exist")
    }
  
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const regOtp = await Otp.create({
      email,
      otp
    })

    if(regOtp){
      console.log('OTP stored in the Db')
    }


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
      text: `Your Verification code is \n\n${otp}\n\nIt will expire in 5 mins`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Verification code sent, check your mail");
      }
    });

   

  }
);

const registerUser = asyncHandler(async (req:Request, res:Response) =>{

  const {email, otp} = req.body;

  if (!otp || !email){
    res.status(400);
    throw new Error ("All field are mandatory")
  }

  const checkEmail = await Otp.findOne({email: email.toLowerCase()})

  if(!checkEmail){
    res.status(404);
    throw new Error ("Not the right email!")
  }

  const checkUser = await User.findOne({email: email.toLowerCase()});

  if (checkUser){
    res.status(400);
    throw new Error("User already exist!")
  }


  const checkOtp = await Otp.findOne({otp})

  if (!checkOtp){
    res.status(400)
    throw new Error("Invalid OTP or OTP expired!") 
  }

  const user = await User.create({email})

  if(user){
    res.status(201).send('User was created successfully!')
  }
 
})


const loginOtp = asyncHandler(async(req:Request, res:Response) =>{
  const {email} = req.body

  if (!email){
    res.status(400);
    throw new Error("Email needed!");
  }

  const user = await User.findOne({email}); 
  
  if(!user){
    res.status(404);
    throw new Error("User does not exist!")
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  
  const regOtp = await Otp.create({
    email,
    otp
  })

  if(regOtp){
    console.log ('OTP stored in the Db')
  }

  

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
    text: `Your pass code is \n\n${otp}\n\nIt will expire in 5 mins`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Pass code sent, check your mail");
    }
  }); 
  
})

const loginUser = asyncHandler( async(req:Request, res: Response) =>{

  const {email, otp} = req.body;

  if (!email || !otp){
    res.status(400);
    throw new Error("All fields are mandatory!")
  };

  const user = await User.findOne({email: email.toLowerCase()})

  if(!user){
    res.status(404);
    throw new Error ("User not found")
  }

  const userOtp = await Otp.findOne({otp});

  if (!userOtp){
    res.status(400);
    throw new Error( "Invalid pass code or pass code has expired, try generating another pass code ")
  };
  
  const userEmail = await Otp.findOne({email})

  if(!userEmail){
    res.status(400);
    throw new Error ("Invalid email!")
  }

  

  if (user){
    const accessToken = jwt.sign(
      {email:user.email, _id:user.id},
      process.env.ACCESS_KEY!,
      {expiresIn: '1d'}
    )
    res.status(200).send(accessToken)
  
  }
})

const currentUser = asyncHandler( async(req:URequest, res:Response) => {
  console.log(req.user!._id)
  res.status(200).json(req.user)
})
export { sendOtpRegistration, registerUser, loginOtp, loginUser, currentUser };
