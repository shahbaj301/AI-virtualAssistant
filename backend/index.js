
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import gemini_Response from "./gemini.js";



const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);

//GEMINI API CALL
// app.get("/",async (req, res)=>{
//     let prompt=req.query.prompt;
//     let data=await gemini_Response(prompt);
//     res.json(data);


// });


const port=process.env.PORT || 5000;

app.listen(port,()=>{
    connectDB();
    console.log(`Server running on http://localhost:${port}`);

});


