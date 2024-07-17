import e from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getAllPosts, getLikedPosts, createPost, likeUnlikePost, commentOnPost, deletePost, getFollowingPosts, getUserPosts } from "../controllers/post.controller.js";

const postRouter = e.Router()

postRouter.get('/all',protectRoute,getAllPosts)
postRouter.get('/likes/:id',protectRoute,getLikedPosts)
postRouter.get('/following',protectRoute,getFollowingPosts)
postRouter.get('/user/:username',protectRoute,getUserPosts)
postRouter.post('/create',protectRoute,createPost)
postRouter.post('/like/:id',protectRoute,likeUnlikePost)
postRouter.post('/comment/:id',protectRoute,commentOnPost)
postRouter.delete('/:id',protectRoute,deletePost)

export default postRouter