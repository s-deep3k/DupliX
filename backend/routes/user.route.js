import {Router} from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { followUnfollowUser, getUserProfile, suggestedProfiles, updateUserProfile } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get("/profile/:username",protectRoute,getUserProfile)
userRouter.get("/suggested",protectRoute,suggestedProfiles)
userRouter.post("/follow/:id",protectRoute,followUnfollowUser)
userRouter.get("/followers")
userRouter.get("/following")
userRouter.post("/profile/update",protectRoute,updateUserProfile)

export default userRouter