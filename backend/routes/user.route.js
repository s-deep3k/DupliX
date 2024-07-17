import {Router} from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { followUnfollowUser, getUserProfile, suggestedProfiles, updateUserProfile } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.post("/profile/:username",protectRoute,getUserProfile)
userRouter.post("/suggested",protectRoute,suggestedProfiles)
userRouter.post("/follow/:id",protectRoute,followUnfollowUser)
userRouter.post("/profile/update",protectRoute,updateUserProfile)

export default userRouter