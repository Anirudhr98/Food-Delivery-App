import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axios';
import ScrollToTopButton from './ScrollToTopButton';
import { Input } from '../components/ui/input';
import { setSelectedRestaurant } from '../redux/restaurantSlice';
import { addToCart, clearCart } from '../redux/cartSlice'; 
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";

const Restaurant = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const selectedRestaurant = useSelector((state) => state.restaurant.selectedRestaurant);
  const cartItems = useSelector((state) => state.cart.items);

  const handleDescriptionToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (selectedRestaurant && selectedRestaurant.restaurant_items) {
      const filtered = selectedRestaurant.restaurant_items.filter(item =>
        item.item_name.toLowerCase().includes(query) ||
        item.cuisine_type.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
        const response = await api.get(`${backend_base_url}/restaurants/${id}`);
        dispatch(setSelectedRestaurant(response.data.restaurant_detail));
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching data';
        toast.error(errorMessage, { autoClose: 1500 });
      }
    };

    if (!selectedRestaurant || selectedRestaurant._id !== id) {
      fetchRestaurant();
    } else {
      // Initialize filteredItems when selectedRestaurant is available
      setFilteredItems(selectedRestaurant.restaurant_items);
    }
  }, [id, selectedRestaurant, dispatch]);

  // Update filteredItems when searchQuery changes
  useEffect(() => {
    if (selectedRestaurant && selectedRestaurant.restaurant_items) {
      const filtered = selectedRestaurant.restaurant_items.filter(item =>
        item.item_name.toLowerCase().includes(searchQuery) ||
        item.cuisine_type.some(cuisine => cuisine.toLowerCase().includes(searchQuery))
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, selectedRestaurant]);

  const handleAddToCart = (item) => {
    const currentRestaurant = cartItems.length > 0 ? cartItems[0].restaurant_id : null;

    if (currentRestaurant && currentRestaurant !== selectedRestaurant._id) {
      toast.warn(
        <div>
          <div className='font-bold'>
          Items from another restaurant are present in the cart.
          <br />
          Do you want to clear the cart and add items from the new restaurant?
          </div>
          <br />
          <button
            onClick={() => {
              dispatch(clearCart());
              addItemToCart(item);
              toast.dismiss();
            }}
            className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600"
          >
            Yes
          </button> 
          <button
            onClick={() => toast.dismiss()}
            className="mt-2 ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600"
          >
            No
          </button>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
        }
      );
    } else {
      addItemToCart(item);
    }
  };

  const addItemToCart = (item) => {
    const itemWithRestaurantDetails = {
      ...item,
      restaurant_id: selectedRestaurant._id,
      restaurant_name: selectedRestaurant.restaurant_name,
      discount_offered: selectedRestaurant.discount_offered
    };
    dispatch(addToCart(itemWithRestaurantDetails));
    toast.success(`${item.item_name} added to cart!`, { autoClose: 1500 });
  };

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
              Delivery Time <CiDeliveryTruck /> {selectedRestaurant.delivery_time} mins
            </span>
            <span className="text-base font-medium text-gray-600">
              Exclusive Discount <CiDiscount1 /> Rs. {selectedRestaurant.discount_offered}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-8 relative">
        <Input
          type="text"
          placeholder="Search Dishes, Cuisines .."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((restaurant_item) => (
              <div
                key={restaurant_item._id}
                className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition duration-300 transform hover:scale-105"
              >
                {/* Image Container */}
                <div className="w-full h-64 overflow-hidden bg-gray-200 group-hover:opacity-75">
                  <img
                    src={restaurant_item.item_image_url}
                    alt={restaurant_item.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {restaurant_item.item_name}
                  </h3>
                  <p className="text-sm text-gray-900 font-semibold">Cuisine Type: {restaurant_item.cuisine_type}</p>
                  <p
                    className={`text-sm text-gray-600 mb-4 mt-4 ${isExpanded ? '' : 'line-clamp-3'}`}
                    onClick={handleDescriptionToggle}
                    style={{ cursor: 'pointer' }}
                  >
                    {restaurant_item.item_description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-gray-900 font-bold">Rs. {restaurant_item.item_price.toFixed(2)}</p>
                    {restaurant_item.is_veg ? (
                      <div className="flex items-center">
                        <p className="text-sm text-green-500 font-semibold">Vegetarian</p>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p className="text-sm text-red-500 font-semibold">Non-vegetarian</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(restaurant_item)}
                    className="mt-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No items match your search criteria.</p>
          )}
        </div>
      </div>
      <ScrollToTopButton/>
    </div>
  );
};

export default Restaurant;
