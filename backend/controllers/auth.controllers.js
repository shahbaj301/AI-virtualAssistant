import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";


export const SignUp=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        const existEmail=await User.findOne({email});
        if(existEmail){
            return res.status(400).json({message:"email already exists!!"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters !"});

        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            password: hashedPassword,
            email
        })

        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:5*24*60*60*1000,
            sameSite:"strict",
            secure:false,
        })

        return res.status(201).json(user);


    }
    catch(error){
        return res.status(500).json({message:`signup error ${error}`})

    }

}

export const Login=async(req,res)=>{
    try{
        const {email,password}=req.body;

         if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"email doest not exists!!"});
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"incorrect Password"});

        }

        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:5*24*60*60*1000,
            sameSite:"strict",
            secure:false,
        })

        return res.status(200).json(user);


    }
    catch(error){
        return res.status(500).json({message:`login error ${error}`})

    }

}

export const logout=async (req,res)=>{
    try{
        res.clearCookie("token")
        return res.status(200).json({message:"logout successfully"});
    }
    catch(error){
        return res.status(500).json({message:`logout error ${error}`})

    }
}