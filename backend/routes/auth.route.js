import e from "express"
import { logout, signin, signup } from "../controllers/auth.controller.js"
const authRouter = e.Router()

authRouter.post("/signup",signup)

authRouter.get('/profile/me',protectRoute, getMe)

authRouter.post("/signin",signin)

authRouter.get("/logout",logout)

export default authRouter