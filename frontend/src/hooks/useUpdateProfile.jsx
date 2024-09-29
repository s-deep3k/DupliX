import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const useUpdateProfile = () => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
    const {mutateAsync: updateProfileDetails, isPending: isUpdating} = useMutation({
		mutationFn: async(formData)=>{
			try {
				const res = await fetch(`/api/v1/user/profile/update`,{
					method: 'POST',
					headers: 
					{'Content-Type':'application/json'},
					body: JSON.stringify(formData)
				})
				const data = await res.json()
				if(!res.ok) throw new Error(data.error || "Something is Wrong!")
				return data;
			} catch (error) {
				toast.error("Failed to update profile details")
				console.log(error.message);
			}
		},
		onSuccess: (data)=>{
			queryClient.invalidateQueries(['authUser'])
			navigate(`/profile/${data.username}`)
		}
	})
	return {updateProfileDetails,isUpdating}
}

export default useUpdateProfile