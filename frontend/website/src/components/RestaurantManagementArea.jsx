// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useSelector } from "react-redux";

// export default function RestaurantManagementArea() {
//     const restaurant_details = useSelector(state=>state.restaurant_management.restaurant_details)

//   return (
//     <>
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
      
//         <Tabs defaultValue="restaurant_management_area" className="w-full">
//         <TabsList className="grid  grid-cols-3">
//           <TabsTrigger value="restaurant_details">Restaurant Details</TabsTrigger>
//           <TabsTrigger value="menu_section">Menu Section</TabsTrigger>
//           <TabsTrigger value="order_section">Order Section </TabsTrigger>
//         </TabsList>
//         <TabsContent value="restaurant_details">
//           <Card>
//             <CardHeader>
//               <CardTitle>Restaurant Details</CardTitle>
//               <CardDescription>
//                 View/Update changes to your restaurant here. Click save when you're done.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//             <div className="space-y-1">
//                 <Label htmlFor="restaurant_name">Restaurant Name</Label>
//                 <Input 
//                   id="restaurant_name" 
//                   value={restaurant_details.restaurant_name} 
//                 //   onChange={(e) => setName(e.target.value)} 
//                 />
//               </div>
//             </CardContent>
//             <CardContent className="space-y-2">
//             <div className="space-y-1">
//                 <Label htmlFor="restaurant_name">Restaurant Image URL</Label>
//                 <Input 
//                   id="restaurant_image_link" 
//                   value={restaurant_details.restaurant_image_url} 
//                 //   onChange={(e) => setName(e.target.value)} 
//                 />
//               </div>
//             </CardContent>
//             <CardContent className="space-y-2">
//             <div className="space-y-1">
//                 <Label htmlFor="restaurant_name">Restaurant Address</Label>
//                 <Input 
//                   id="restaurant_image_link" 
//                   value={restaurant_details.restaurant_image_url} 
//                 //   onChange={(e) => setName(e.target.value)} 
//                 />
//               </div>
//             </CardContent>
//             <CardContent className="space-y-2">
//             <div className="space-y-1">
//                 <Label htmlFor="restaurant_name">Discount Offered </Label>
//                 <Input 
//                   id="restaurant_image_link" 
//                   value={restaurant_details.restaurant_image_url} 
//                 //   onChange={(e) => setName(e.target.value)} 
//                 />
//               </div>
//             </CardContent>
//             <CardContent className="space-y-2">
//             <div className="space-y-1">
//                 <Label htmlFor="restaurant_name">Delivery Time</Label>
//                 <Input 
//                   id="restaurant_image_link" 
//                   value={restaurant_details.restaurant_image_url} 
//                 //   onChange={(e) => setName(e.target.value)} 
//                 />
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button>Save changes</Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>
        
//       </Tabs>
//       </div>
      
    
//     </>
//   );
// }


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
// import { updateRestaurantDetails } from "@/store/restaurantSlice"; // Adjust the import based on your slice

export default function RestaurantManagementArea() {
//   const dispatch = useDispatch();
  const restaurant_details = useSelector(state => state.restaurant_management.restaurant_details);

  // Local state for managing input fields
  const [formData, setFormData] = useState({
    restaurantName: restaurant_details.restaurant_name,
    restaurantImage: restaurant_details.restaurant_image_url,
    restaurantAddress: restaurant_details.restaurant_address,
    discountOffered: restaurant_details.discount_offered,
    deliveryTime: restaurant_details.delivery_time,
  });

  // Sync local state with the Redux store
  useEffect(() => {
    setFormData({
      restaurantName: restaurant_details.restaurant_name,
      restaurantImage: restaurant_details.restaurant_image_url,
      restaurantAddress: restaurant_details.restaurant_address,
      discountOffered: restaurant_details.discount_offered,
      deliveryTime: restaurant_details.delivery_time,
    });
  }, [restaurant_details]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = () => {
    // dispatch(updateRestaurantDetails(formData)); // Adjust according to your action
  };

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
                View/Update changes to your restaurant here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Restaurant Name", name: "restaurantName", value: formData.restaurantName },
                { label: "Restaurant Image URL", name: "restaurantImage", value: formData.restaurantImage },
                { label: "Restaurant Address", name: "restaurantAddress", value: formData.restaurantAddress },
                { label: "Discount Offered", name: "discountOffered", value: formData.discountOffered },
                { label: "Delivery Time", name: "deliveryTime", value: formData.deliveryTime },
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
      </Tabs>
    </div>
  );
}
