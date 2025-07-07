import { response } from "express";
import uploadOnCloudinary from "../config/cloudinary.js";
import gemini_Response from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";



export const getCurrentUser=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message:"user not found"});

        }
        return res.status(200).json(user);

    }
    catch(error){
        return res.status(400).json({message:"user not found"});


    }
}

export const updateAssistant=async(req,res)=>{
    try{
        const {assistantName,imageUrl}=req.body;
        let assistantImage;
        if(req.file){
            assistantImage=await uploadOnCloudinary(req.file.path);

        }else{
            assistantImage=imageUrl;

        }
        const user=await User.findByIdAndUpdate(req.userId,{
            assistantName,assistantImage
        },{new:true}).select("-password");
        return res.status(200).json(user);


        
    }
     catch(error){
        return res.status(400).json({message:"updateAssistanterror found"});


    }
}

export const askToAssistant=async(req,res)=>{
    try{
        const {command}=req.body;
        console.log("Command received:", command);

        const user=await User.findById(req.userId);
        user.history.push(command);
        user.save();
        const userName=user.name;
        const assistantName=user.assistantName;

        const result=await gemini_Response(command,assistantName,userName);
        console.log("Gemini raw response:", result);

        // const jsonMatch=result.match(/{\s\S*}/);
        // if(!jsonMatch){
        //     return res.status(400).json({response:"Sorry cant understand"});

        // };
        let geminiJsonString = result;
        // Check if the response contains markdown code block delimiters
        if (result.startsWith("```json") && result.endsWith("```")) {
            geminiJsonString = result.substring(7, result.length - 3).trim(); // Remove "```json" and "```"
        } else {
            // Fallback for cases where it might not have the markdown, or if the regex was intended for something else
            const jsonMatch = result.match(/{\s\S*}/);
            if (jsonMatch && jsonMatch[0]) {
                geminiJsonString = jsonMatch[0];
            } else {
                return res.status(400).json({response:"Sorry, could not extract valid JSON from Gemini's response."});
            }
        }

        const gemResult=JSON.parse(geminiJsonString);
        const type=gemResult.type;

        switch(type){
            case 'get-date':
                return res.json({
                    type,
                    userinput:gemResult.userinput,
                    response:`current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get-time':
                return res.json({
                    type,
                    userinput:gemResult.userinput,
                    response:`current time is ${moment().format("hh:mm A")}`
                });
            case 'get-day':
                return res.json({
                    type,
                    userinput:gemResult.userinput,
                    response:`Today  is ${moment().format("dddd")}`

                });
            case 'get-month':
                return res.json({
                    type,
                    userinput:gemResult.userinput,
                    response:`Month name is ${moment().format("MMMM")}`
                });
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case 'calculator-open':
            case 'instagram-open':
            case 'facebook-open':
            case 'weather-show':
                return res.json({
                    type,
                    userinput:gemResult.userinput,
                    response:gemResult.response,


                });
            default:
                console.error("Error in askToAssistant:", error);
                 return res.status(400).json({response:"Sorry cant understand"});

        }

        



    }
    catch(error){
         return res.status(500).json({response:"ask assistant error"});

    }
}