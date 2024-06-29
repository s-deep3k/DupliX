import e from "express"
import { logout, signin, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/protectRoute.js"
const authRouter = e.Router()

authRouter.post("/signup",signup)

authRouter.get('/profile/me',protectRoute, getMe)

authRouter.post("/signin",signin)

authRouter.post("/logout",logout)

export default authRouter