import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import MenuManagementArea from "./MenuManagementArea";
import Orders from "./Orders";
import { updateRestaurantDetails } from "../redux/restaurantManagementSlice" // Adjust the import based on your slice
import api from '../api/axios'
import { toast } from "react-toastify";

export default function RestaurantManagementArea() {
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL 
  const restaurant_details = useSelector((state) => state.restaurant_management.restaurant_details?.[0]||{});
  const dispatch = useDispatch();
  const restaurant_id = restaurant_details._id;
  
  // Local state for managing input fields
  const [formData, setFormData] = useState({
    restaurant_name: restaurant_details.restaurant_name,
    restaurant_image_url: restaurant_details.restaurant_image_url,
    restaurant_address: restaurant_details.restaurant_address,
    discount_offered: restaurant_details.discount_offered,
    delivery_time: restaurant_details.delivery_time,
  });

  // Sync local state with the Redux store
  useEffect(() => {
    setFormData({
      restaurant_name: restaurant_details.restaurant_name,
      restaurant_image_url: restaurant_details.restaurant_image_url,
      restaurant_address: restaurant_details.restaurant_address,
      discount_offered: restaurant_details.discount_offered,
      delivery_time: restaurant_details.delivery_time,
    });
  }, [restaurant_details]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async() => {
    try{
      const response = await api.put(
        `${backend_base_url}/restaurant_owner/update_restaurant_details/${restaurant_id}`,
        formData
      );
      dispatch(updateRestaurantDetails(response.data)); 
      toast.success("Restaurant details updated successfully!", { autoClose: 1500 });
    }catch(error){
       const error_message = 'Error updating restaurant details'
      toast.error(`${error_message}`,{autoClose:1500})
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <Tabs defaultValue="restaurant_details" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="restaurant_details">Restaurant Details</TabsTrigger>
          <TabsTrigger value="menu_section">Menu Section</TabsTrigger>
          <TabsTrigger value="order_section">Order Section</TabsTrigger>
        </TabsList>
        <TabsContent value="restaurant_details">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Details</CardTitle>
              <CardDescription>
                View/Update changes to your restaurant here. Click save when you are done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Display image if restaurant_image_url exists */}
              {formData.restaurant_image_url && (
                <div className="mb-4">
                  <img
                    src={formData.restaurant_image_url}
                    alt="Restaurant"
                    className="w-50 h-50 object-cover rounded-md"
                  />
                </div>
              )}

              {[ 
                { label: "Restaurant Name", name: "restaurant_name", value: formData.restaurant_name },
                { label: "Restaurant Image URL", name: "restaurant_image_url", value: formData.restaurant_image_url },
                { label: "Restaurant Address", name: "restaurant_address", value: formData.restaurant_address },
                { label: "Discount Offered (in Rs.)", name: "discount_offered", value: formData.discount_offered },
                { label: "Delivery Time (in mins.)", name: "delivery_time", value: formData.delivery_time },
              ].map((field, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="menu_section">
          <MenuManagementArea />
        </TabsContent>
        <TabsContent value="order_section">
          <Orders />
        </TabsContent>
      </Tabs>
    </div>
  );
}
