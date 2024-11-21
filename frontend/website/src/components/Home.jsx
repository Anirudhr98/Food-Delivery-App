import { useState, useEffect } from "react";
import api from "../api/axios";
import ScrollToTopButton from "./ScrollToTopButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "./ui/input";
import { login } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { setSelectedRestaurant } from "../redux/restaurantSlice";
import { ThreeDot } from "react-loading-indicators";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get(`${backend_base_url}/restaurants`);
        const fetched_restaurants = response.data.restaurants_list;
        console.log("Fetched ", fetched_restaurants);
        const requiredFields = [
          "restaurant_name",
          "restaurant_items",
          "restaurant_address",
          "cuisines_available",
          "restaurant_image_url",
          "discount_offered",
          "delivery_time",
        ];
        const filtered_restaurants = fetched_restaurants.filter((rest) =>
          requiredFields.every((field) => rest[field])
        );
        setRestaurants(filtered_restaurants);
        setLoading(false); // Set loading to false after data fetch
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error fetching data";
        toast.error(errorMessage, { autoClose: 1500 });
        setLoading(false); // Set loading to false on error
      }
    };

    if (backend_base_url) {
      fetchRestaurants();
    } else {
      const errorMessage = "Error fetching data";
      toast.error(errorMessage, { autoClose: 1500 });
      setLoading(false); // Set loading to false on error
    }
  }, [backend_base_url]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      getuserdetailsbyid(token);
    }
  }, []);

  const getuserdetailsbyid = async (token) => {
    try {
      const response = await api.get(
        `${backend_base_url}/user/getUserDetailsById?userId=${token}`
      );
      dispatch(login(response.data.user_details));
      navigate("/", { replace: true });
      toast.success("Successfully logged in!");
    } catch (error) {
      const error_message =
        error.response?.data?.message || "Error logging you in";
      toast.error(`${error_message}`, { autoClose: 1500 });
    }
  };

  const handleRestaurantClick = (restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
    navigate(`/restaurant/${restaurant._id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {loading ? (
       <div className="flex justify-center items-center h-screen w-full">
       <ThreeDot color="#cc3147" variant="bounce" size="large" text="Restaurants are being fetched. Might Take A Minute.  Hang On..!!" textColor="#f82525" />
     </div> 
      ) : (
        <>
          {/* Search Bar */}
          <div className="mt-8">
            <Input type="text" placeholder="Search..." />
          </div>
          <div className="font-medium text-2xl mt-8">
            Top Restaurants Near You
          </div>
          <div className="bg-white mt-8">
            <div className="pb-8">
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                    onClick={() => handleRestaurantClick(restaurant)}
                  >
                    {/* Image Container */}
                    <div className="w-full h-64 overflow-hidden bg-gray-200 group-hover:opacity-75">
                      <img
                        src={restaurant.restaurant_image_url}
                        alt={restaurant.restaurant_name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-medium">
                        {restaurant.restaurant_name}
                      </h3>
                      <p className="text-sm font-small text-gray-900">
                        Delivery Time: {restaurant.delivery_time} mins
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Cuisines: {restaurant.cuisines_available.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ScrollToTopButton />
        </>
      )}
    </div>
  );
}
