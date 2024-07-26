import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { useQuery } from "@tanstack/react-query";
import { data } from "autoprefixer";
import LoadingSpinner from "./components/common/LoadingSpinner";


const App = ()=> {
	const {data, isLoading} = useQuery({
		queryKey: ['authUser'],
		queryFn: async()=>{
			const res = await fetch('/api/v1/auth/profile/me')
			const data = await res.json()
			if(!res.ok) throw Error(data.error || 'Something wrong happened!')
		},
	})
	if(isLoading)
	{
		return (
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size="lg"></LoadingSpinner>
			</div>
		)
	}

	console.log('authUser is here:', data);
	const {authUser} = data 
	
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Sidebar/>
			<Routes>
				<Route path='/' element={authUser?<HomePage/>:<Navigate to={'/login'}/>} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path="/notifications" element={<NotificationPage />}/>
				<Route path="/profile/:username" element={<ProfilePage />}/>
			</Routes>
		</div>
	);
}

export default App