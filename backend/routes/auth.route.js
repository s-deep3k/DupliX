import e from "express"
import { logout, signin, signup } from "../controllers/auth.controller.js"
const authRouter = e.Router()

authRouter.get("/signup",signup)

authRouter.get("/signin",signin)

authRouter.get("/logout",logout)

export default authRouter