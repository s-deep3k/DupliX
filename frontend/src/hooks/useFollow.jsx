import {useMutation} from '@tanstack/react-query'
import toast from 'react-hot-toast'
const useFollow = (id) => {
  const {mutate: follow, isPending, } = useMutation({
    mutationFn: async(id)=>{
      try {
        const res = await fetch(`/api/v1/user/follow/${id}`)
        const data = res.json()
        if(!res.ok) throw new Error(data.message || "Follow/Unfollow unsuccessful!")
        return {follow, isPending}
      } catch (err) {
        console.log(err.message);
        toast.error(err.message)
      }
    },
  })
}

export default useFollow