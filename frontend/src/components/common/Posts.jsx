import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Posts = ({feedType, username, userId }) => {
	const getPostEndpoint = ()=>{
		switch (feedType) {
			case "forYou":
				return '/api/v1/post/all'
			case "following":
				return '/api/v1/post/following'
			case "posts":
				return `/api/v1/post/user/${username}`
			case "likes":
				return `/api/v1/post/likes/${userId}`
			default:
				return '/api/v1/post/all'
		}
	}
	const POST_ENDPOINT = getPostEndpoint()
	const {data: posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey:['posts'],
		queryFn : async()=>{
			try{
				const res = await fetch(POST_ENDPOINT)
				const data = await res.json()
				if(!res.ok) throw new Error(data.error || 'Something Went Wrong')
					return data
			}catch(err){
				toast.error(err.message)
			}
		},
	})

	useEffect(()=>{
		refetch()
	},[feedType])
	
	
	

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;