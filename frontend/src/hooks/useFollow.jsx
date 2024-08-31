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
        if(!res.ok) throw new Error(data.error || "Follow/Unfollow unsuccessful!")

      return;
      } catch (err) {
        console.log(err.message);
      }
    },
    onSuccess : ()=>{
      Promise.all([
        queryClient.invalidateQueries({queryKey:['suggestedUsers']}),
        queryClient.invalidateQueries({queryKey:["notifications"]}),
        queryClient.invalidateQueries({queryKey:['authUser']})
      ])
      toast.success("Follow / Unfollow successful!")
    },
    onError : ()=>{
      toast.error(error.message)
    }
  })
  return {follow,isPending}
}

export default useFollow