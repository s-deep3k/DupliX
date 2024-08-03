import {useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'
const useFollow = () => {
  const queryclient = useQueryClient()
  const {mutate: follow, isPending, error, } = useMutation({
    mutationFn: async(id)=>{
      try {
        const res = await fetch(`/api/v1/user/follow/${id}`,{
          method: "POST"
        })
        const data = res.json()
        if(!res.ok) throw new Error(data.error || "Follow/Unfollow unsuccessful!")

        return {follow, isPending}
      } catch (err) {
        console.log(err.message);
      }
    },
    onSuccess : ()=>{
      Promise.all([
        queryclient.invalidateQueries({queryKey:['suggestedUsers']}),
        queryclient.invalidateQueries({queryKey:['authUser']})
      ])
      toast.success("Follow / Unfollow successful!")
    },
    onError : ()=>{
      toast.error(error.message)
    }
  })
}

export default useFollow