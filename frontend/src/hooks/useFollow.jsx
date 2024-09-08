import {useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'
const useFollow = () => {
  const queryClient = useQueryClient()
  const {mutate: follow, isPending, error, } = useMutation({
    mutationFn: async(id)=>{
      try {
        const res = await fetch(`/api/v1/user/follow/${id}`,{
          method: "POST"
        })
        const data = res.json()
        if(!res.ok) {
          throw new Error(data.error || "Operation unsuccessful!")
        }

      return data || "";
      } catch (err) {
        console.log(err.message);
        
      }
    },
    onSuccess : (data)=>{
      Promise.all([
        queryClient.invalidateQueries({queryKey:['profile']}),
        queryClient.invalidateQueries({queryKey:['suggestedUsers']}),
        queryClient.invalidateQueries({queryKey:["notifications"]}),
        queryClient.invalidateQueries({queryKey:['authUser']})
      ])
      toast.success(data.message || "Follow / Unfollow successful!")
    },
    onError : ()=>{
      toast.error(error.message)
    }
  })
  return {follow,isPending}
}

export default useFollow