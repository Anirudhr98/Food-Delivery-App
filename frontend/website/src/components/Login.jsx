import {Link} from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify';
import api from '../api/axios'
import { login } from '@/redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';


export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL 
  const[loginForm,setLoginForm] = useState({email:'',password:''})

  const handleChange = (e) =>{
    const {id,value}  = e.target
    setLoginForm({...loginForm,[id]:value})
  }


  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await api.post(`${backend_base_url}/user/login`,loginForm)
      setLoginForm({email:'',password:''})
      dispatch(login(response.data.user))
      navigate('/',{replace:true})
      toast.success("Successfully logged in!", { autoClose: 1500 })
    }catch(error){
      const error_message = error.response?.data?.message || 'Error logging you in'
      toast.error(`${error_message}`,{autoClose:1500})
    }
  }

  return (
    <Card className="mx-auto max-w-sm mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit ={handleSubmit}className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value = {loginForm.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input 
            id="password"
            type="password" 
            onChange = {handleChange}
            value = {loginForm.password}
            required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <Link to={`${backend_base_url}/user/auth/google`}>
          <Button variant="outline" className="w-full mt-4">
            Login with Google
          </Button>
        </Link>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
