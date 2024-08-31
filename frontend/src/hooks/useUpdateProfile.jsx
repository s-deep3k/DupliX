import { useMutation } from "@tanstack/react-query"

const useUpdateProfile = () => {
    const {mutateAsync: updateProfileDetails, isPending: isUpdating} = useMutation({
		mutationFn: async(formData)=>{
			try {
				const res = await fetch(`/api/profile/update`,{
					method: 'POST',
					headers: 
					{'Content-Type':'application/json'},
					body: JSON.stringify(formData)
				})
				const data = await res.json()
				if(!res.ok) throw new Error(data.error || "Something is Wrong!")
				return ;
			} catch (error) {
				toast.error("Failed to update profile details")
				console.log(error.message);
			}
		},
		onSuccess: ()=>{
			Promise.all(
				queryClient.invalidateQueries(['authUser']),
				queryClient.invalidateQueries(['profile'])
			)
		}
	})
	return {updateProfileDetails,isUpdating}
}

export default useUpdateProfile