import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterRestaurant() {
  const [signupform, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    restaurant_id:'',
    restaurant_name: '',
    restaurant_address: ''
  });
  const navigate = useNavigate();
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSignupForm({ ...signupform, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${backend_base_url}/restaurant_owner/create_new_restaurant`, signupform);
      setSignupForm({
        owner_name: '',
        owner_email: '',
        password: '',
        confirm_password: '',
        restaurant_id: '',
        restaurant_name: '',
        restaurant_address: ''
      });
      navigate('/', { replace: true });
      toast.success('Restaurant registered successfully!', { autoClose: 1500 });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error registering restaurant';
      toast.error(`${errorMessage}`, { autoClose: 1500 });
    }
  };

  return (
    <Card className="mx-auto max-w-4xl my-10 p-6">
      <CardHeader>
        <CardTitle className="text-2xl">Register Your Restaurant</CardTitle>
        <CardDescription>
          Enter details to register your restaurant.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <CardHeader className="text-xl font-semibold">Restaurant Details</CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="restaurant_name">Restaurant Name</Label>
                <Input
                  id="restaurant_name"
                  type="text"
                  value={signupform.restaurant_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="restaurant_id">Restaurant ID</Label>
                <Input
                  id="restaurant_id"
                  type="text"
                  value={signupform.restaurant_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="restaurant_address">Restaurant Address</Label>
                <Input
                  id="restaurant_address"
                  type="text"
                  value={signupform.restaurant_address}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </div>
          <div className="flex-1">
            <CardHeader className="text-xl font-semibold">Owner Details</CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Owner Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={signupform.owner_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Owner Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={signupform.owner_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={signupform.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={signupform.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button type="submit" className="w-1/2">
           Register Your Restaurant
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have a restaurant?{" "}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </div>
      </form>
    </Card>
  );
}
