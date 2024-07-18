import { Link } from 'react-router-dom'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from '../api/axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Signup() {
  const [signupform, setSignupForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate()
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL 
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setSignupForm({ ...signupform, [id]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${backend_base_url}/user/register`, signupform)
      setSignupForm({ name: '', email: '', password: '', confirm_password: '' })
      navigate('/', { replace: true });
      toast.success('User registered successfully!', { autoClose: 3000 });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error registering user';
      toast.error(`${errorMessage}`, { autoClose: 3000 });

    }
  }

  return (
    <>
      <Card className="mx-auto max-w-sm mt-10">
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Enter details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={signupform.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={signupform.email}
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
                value={signupform.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Confirm Password</Label>
              </div>
              <Input
                id="confirm_password"
                type="password"
                value={signupform.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Signup
            </Button>
          </form>
          <Link to={`${backend_base_url}/user/auth/google`}>
            <Button variant="outline" className="w-full mt-4">
              Signup with Google
            </Button>
          </Link>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
