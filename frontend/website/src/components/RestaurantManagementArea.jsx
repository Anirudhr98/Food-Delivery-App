// File: RestaurantManagementArea.jsx

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
import MenuManagementArea from "./MenuManagamentArea";
import OrderManagementArea from "./OrderManagementArea";
import { updateRestaurantDetails } from "../redux/restaurantManagementSlice";

export default function RestaurantManagementArea() {
  const dispatch = useDispatch();

  // Extract restaurant details from the Redux store
  const { restaurant_details, loading, error } = useSelector(
    (state) => state.restaurantManagement
  );

  // Local state for managing input fields
  const [formData, setFormData] = useState({
    restaurant_name: "",
    restaurant_image_url: "",
    restaurant_address: "",
    discount_offered: "",
    delivery_time: "",
  });

  // Sync local state with the Redux store
  useEffect(() => {
    if (restaurant_details) {
      setFormData({
        restaurant_name: restaurant_details.restaurant_name || "",
        restaurant_image_url: restaurant_details.restaurant_image_url || "",
        restaurant_address: restaurant_details.restaurant_address || "",
        discount_offered: restaurant_details.discount_offered || "",
        delivery_time: restaurant_details.delivery_time || "",
      });
    }
  }, [restaurant_details]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = () => {
    if (!restaurant_details) {
      alert("No restaurant selected.");
      return;
    }

    dispatch(updateRestaurantDetails({ ...formData, restaurant_id: restaurant_details.restaurant_id }))
      .unwrap()
      .then(() => alert("Changes saved successfully."))
      .catch((err) => alert(`Failed to save changes. ${err}`));
  };

  const renderInputField = (label, name, value) => (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} value={value} onChange={handleInputChange} />
    </div>
  );

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
                View/Update changes to your restaurant here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Restaurant Name", name: "restaurant_name", value: formData.restaurant_name },
                { label: "Restaurant Image URL", name: "restaurant_image_url", value: formData.restaurant_image_url },
                { label: "Restaurant Address", name: "restaurant_address", value: formData.restaurant_address },
                { label: "Discount Offered", name: "discount_offered", value: formData.discount_offered },
                { label: "Delivery Time", name: "delivery_time", value: formData.delivery_time },
              ].map((field, index) => (
                <div key={index}>{renderInputField(field.label, field.name, field.value)}</div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="menu_section">
          {restaurant_details ? (
            <MenuManagementArea restaurantId={restaurant_details.restaurant_id} />
          ) : (
            <p>Loading menu management...</p>
          )}
        </TabsContent>
        <TabsContent value="order_section">
          {restaurant_details ? (
            <OrderManagementArea restaurantId={restaurant_details.restaurant_id} />
          ) : (
            <p>Loading order management...</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
