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
// import { updateRestaurantDetails } from "@/store/restaurantSlice"; // Adjust the import based on your slice

export default function RestaurantManagementArea() {
  //   const dispatch = useDispatch();
  const restaurant_details = useSelector((state) => state.restaurant_management.restaurant_details[0]);

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

  const handleSaveChanges = () => {
    // dispatch(updateRestaurantDetails(formData)); // Adjust according to your action
  };

  console.log(restaurant_details); // Log to check the data
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <Tabs defaultValue="restaurant_management_area" className="w-full">
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
                { label: "Discount Offered", name: "discount_offered", value: formData.discount_offered },
                { label: "Delivery Time", name: "delivery_time", value: formData.delivery_time },
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
