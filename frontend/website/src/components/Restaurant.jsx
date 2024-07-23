import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { Input } from '../components/ui/input';
import { setSelectedRestaurant } from '../redux/restaurantSlice';
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";

const Home = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedRestaurant = useSelector((state) => state.restaurant.selectedRestaurant);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
        const response = await api.get(`${backend_base_url}/restaurants/${id}`);
        dispatch(setSelectedRestaurant(response.data.restaurant_detail));
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching data';
        toast.error(errorMessage, { autoClose: 3000 });
      }
    };

    if (!selectedRestaurant || selectedRestaurant._id !== id) {
      fetchRestaurant();
    }
  }, [id, selectedRestaurant, dispatch]);

  if (!selectedRestaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">

      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Container */}
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={selectedRestaurant.restaurant_image_url}
              alt={selectedRestaurant.restaurant_name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Content */}
          <div className="p-6 flex flex-col justify-center space-y-4">
            <span className="text-3xl font-semibold text-gray-800">
              {selectedRestaurant.restaurant_name}
            </span>
            <span className="text-lg font-medium text-gray-700">
              Cuisines Available: {selectedRestaurant.cuisines_available.join(', ')}
            </span>
            <span className="text-lg font-medium text-gray-700">
              Delivery Time <CiDeliveryTruck  /> {selectedRestaurant.delivery_time} mins
            </span>
            <span className="text-base font-medium text-gray-600">
            
              Exclusive Discount <CiDiscount1  /> Rs. {selectedRestaurant.discount_offered}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-8">
        <Input type="text" placeholder="Search Dishes.." />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedRestaurant.restaurant_items && selectedRestaurant.restaurant_items.map((restaurant_item) => (
          <div
            key={restaurant_item._id}
            className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
          >
            {/* Image Container */}
            <div className="w-full h-64 overflow-hidden bg-gray-200 group-hover:opacity-75">
              <img
                src={restaurant_item.item_image_url}
                alt={restaurant_item.item_name}
                className="w-full h-full object-contain object-center"
              />
            </div>
            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-medium">
                {restaurant_item.item_name}
              </h3>
              <p className="text-sm font-small text-gray-900">Price: {restaurant_item.item_price}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;
