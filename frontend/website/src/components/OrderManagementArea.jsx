import { useEffect, useState, useMemo } from "react";
import api from "../api/axios.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function OrderManagementArea() {
  const user = useSelector((state) => state.user.userDetails);
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
  const [orderData, setOrderData] = useState([]);
  const [defaultTab, setDefaultTab] = useState("past_orders");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.post(
          `${backend_base_url}/orders/get_orders`,
          { user_id: user._id }
        );
        const orders = response.data.orders_list || [];
        setOrderData(orders);

        const hasLiveOrders = orders.some(
          (order) => order.order_status !== "Delivered"
        );
        setDefaultTab(hasLiveOrders ? "live_orders" : "past_orders");
      } catch (error) {
        navigate("/", { replace: true });
        toast.info("Error fetching Orders", { autoClose: 1500 });
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, backend_base_url, navigate]);

  const filteredOrders = useMemo(() => {
    return orderData.filter(
      (order) =>
        order.restaurant_name?.toLowerCase().includes(searchQuery) ||
        new Date(order.created_at)
          .toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          .toLowerCase()
          .includes(searchQuery)
    );
  }, [orderData, searchQuery]);

  const filteredLiveOrders = useMemo(() => {
    return filteredOrders.filter((order) => order.order_status !== "Delivered");
  }, [filteredOrders]);

  const filteredPastOrders = useMemo(() => {
    return filteredOrders.filter((order) => order.order_status === "Delivered");
  }, [filteredOrders]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
        {/* Search Bar */}
        <div className="mt-8 mx-8">
          <Input
            type="text"
            placeholder="Search Orders based on date .."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="container mt-8">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList>
              <TabsTrigger value="live_orders">
                <span className="text-green-600 text-3xl mb-1">&#8226;</span>
                Live Order
              </TabsTrigger>
              <TabsTrigger value="past_orders">
                <span className="text-red-600 text-3xl mb-1">&#8226;</span>
                Past Orders
              </TabsTrigger>
            </TabsList>
            {filteredLiveOrders.length > 0 ? (
              <TabsContent value="live_orders">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead>Restaurant Name</TableHead> */}
                      <TableHead>Items Ordered</TableHead>
                      <TableHead>Total Order Price</TableHead>
                      <TableHead>Ordered By</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Ordered On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLiveOrders.map((order, index) => (
                      <TableRow key={index}>
                        {/* <TableCell>{order.restaurant_name}</TableCell> */}
                        <TableCell>
                          {order.order_items
                            .map((item) => item.item_name)
                            .join(", ")}
                        </TableCell>
                        <TableCell>Rs. {order.order_total_price}</TableCell>
                        <TableCell>{order.order_status}</TableCell>
                        <TableCell>{order.order_status}</TableCell>
                        <TableCell>{order.delivery_address}</TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}{" "}
                          at{" "}
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ) : null}
            {filteredPastOrders.length > 0 ? (
              <TabsContent value="past_orders">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead>Restaurant Name</TableHead> */}
                      <TableHead>Items Ordered</TableHead>
                      <TableHead>Total Order Price</TableHead>
                      <TableHead>Ordered By</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Ordered On</TableHead>
                      <TableHead>Delivered On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPastOrders.map((order, index) => (
                      <TableRow key={index}>
                        {/* <TableCell>{order.restaurant_name}</TableCell> */}
                        <TableCell>
                          {order.order_items
                            .map((item) => item.item_name)
                            .join(", ")}
                        </TableCell>
                        <TableCell>Rs. {order.order_total_price}</TableCell>
                        <TableCell>{order.order_status}</TableCell>
                        <TableCell>{order.order_status}</TableCell>
                        <TableCell>{order.delivery_address}</TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}{" "}
                          at{" "}
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(order.delivered_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}{" "}
                          at{" "}
                          {new Date(order.delivered_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ) : null}
          </Tabs>
        </div>
      </div>
    </>
  );
}
