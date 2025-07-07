import express from "express"
import { Login, logout, SignUp } from "../controllers/auth.controllers.js"

const authRouter=express.Router()


authRouter.post("/signup",SignUp)
authRouter.post("/signin",Login)
authRouter.get("/logout",logout)
export default authRouter