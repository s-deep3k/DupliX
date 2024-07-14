import e from "express";
import { protectRoute } from "../middlewares/protectRoute.js";

const postRouter = e.Router()

postRouter.get('/all',protectRoute,getAllPosts)
postRouter.get('/likes/:id',protectRoute,getLikedPosts)
postRouter.post('/create',protectRoute,createPost)
postRouter.post('/like/:id',protectRoute,likeUnlikePost)
postRouter.post('/comment/:id',protectRoute,commentOnPost)
postRouter.patch('/:id',protectRoute)
postRouter.delete('/:id',protectRoute,deletePost)

export default postRouter