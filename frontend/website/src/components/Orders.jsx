import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
export default function Orders() {
  const user = useSelector((state) => state.user.userDetails);
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        toast.info(`User info is ${user._id}`)
        const response = await api.post(`${backend_base_url}/orders/get_orders`, { user_id: user._id });
        setOrderData(response.data);
      } catch (error) {
        console.error("Error creating order:", error);
      }
    };

    if (user) {
      createOrder();
    }
  }, [user]);

  return (
    <>
      <div>
        <h2>Orders</h2>
        {orderData ? <pre>{JSON.stringify(orderData, null, 2)}</pre> : "Loading..."}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="live_orders">Live Order</TabsTrigger>
            <TabsTrigger value="past_orders">Past Orders</TabsTrigger>
          </TabsList>
          {orderData?.order_status == "Delivered" ? (
            <TabsContent value="past_orders">

            </TabsContent>
          ) : (
            <TabsContent value="live_orders">Make changes to your account here.</TabsContent>
          )}
        </Tabs>
      </div>
      p
    </>
  );
}
