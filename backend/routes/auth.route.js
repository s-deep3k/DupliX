import e from "express"
import { logout, signin, signup } from "../controllers/auth.controller"
const authRouter = e.Router()

authRouter.get("/signup",signup)

authRouter.get("/signin",signin)

authRouter.get("/logout",logout)

export default authRouter