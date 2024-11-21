import { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRestaurants = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get(
          `${backend_base_url}/restaurants?page=${page}`
        );
        const { restaurants_list, total_pages } = response.data;

        const requiredFields = [
          "restaurant_name",
          "restaurant_items",
          "restaurant_address",
          "cuisines_available",
          "restaurant_image_url",
          "discount_offered",
          "delivery_time",
        ];

        const filtered_restaurants = restaurants_list.filter((rest) =>
          requiredFields.every((field) => rest[field])
        );

        setRestaurants((prev) =>
          page === 1 ? filtered_restaurants : [...prev, ...filtered_restaurants]
        );
        setFilteredItems((prev) =>
          page === 1 ? filtered_restaurants : [...prev, ...filtered_restaurants]
        );
        setTotalPages(total_pages);
        setLoading(false);
        setIsLoadingMore(false);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error fetching data";
        toast.error(errorMessage, { autoClose: 1500 });
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [backend_base_url]
  );

  const getuserdetailsbyid = useCallback(
    async (token) => {
      try {
        const response = await api.get(
          `${backend_base_url}/user/getUserDetailsById?userId=${token}`
        );
        dispatch(login(response.data.user_details));
        navigate("/", { replace: true });
        toast.success("Successfully logged in!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error logging you in";
        toast.error(errorMessage, { autoClose: 1500 });
      }
    },
    [backend_base_url, dispatch, navigate]
  );

  useEffect(() => {
    if (backend_base_url) fetchRestaurants();
  }, [backend_base_url, fetchRestaurants]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) getuserdetailsbyid(token);
  }, [getuserdetailsbyid]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = restaurants.filter((restaurant) =>
      restaurant.restaurant_name.toLowerCase().includes(query) ||
      restaurant.cuisines_available.some((cuisine) =>
        cuisine.toLowerCase().includes(query)
      )
    );
    setFilteredItems(filtered);
  };

  const handleRestaurantClick = (restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
    navigate(`/restaurant/${restaurant._id}`);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage((prevPage) => prevPage + 1);
      fetchRestaurants(currentPage + 1);
    }
  };

  return (
    <>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <ThreeDot
            color="#cc3147"
            variant="bounce"
            size="large"
            text="Restaurants are being fetched. Might Take A Minute. Hang On..!!"
            textColor="#f82525"
          />
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="mt-8">
            <Input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          <div className="font-medium text-2xl mt-8">
            Top Restaurants Near You
          </div>
          <div className="bg-white mt-8">
            {filteredItems.length === 0 && searchQuery ? (
              <div className="text-center text-gray-500">
                No restaurants found.
              </div>
            ) : (
              <div className="pb-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {filteredItems.map((restaurant) => (
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
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                          onError={(e) =>
                            (e.target.src = "/fallback-image.jpg")
                          }
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
                {currentPage < totalPages && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      {isLoadingMore ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <ScrollToTopButton />
        </>
      )}
    </div>
    </>
  );
}
