import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaPlus, FaMinus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios';
import { addToCart, clearCart, decreaseCartQuantity } from '../redux/cartSlice';
import { setRestaurantDetails } from '@/redux/restaurantManagementSlice';
import { logout } from '../redux/userSlice';
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import logo from '../../../../assets/logo.png';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user_details = useSelector((state) => state.user.userDetails)
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState(null);

  const handleLogout = async () => {
    try {
      await api.get(`${backend_base_url}/user/logout`);
      dispatch(clearCart());
      dispatch(logout());
      navigate('/');
      toast.success("You have been successfully logged out", { autoClose: 1500 });
    } catch (error) {
      navigate('/');
      toast.error("Unable to logout!", { autoClose: 1500 });
    }
  };

  useEffect(() => {
    if (user_details?.registered_as === 'restaurant_owner') {
      const fetchRestaurantData = async () => {
        try {
          const response = await api.get(`${backend_base_url}/restaurant_owner/get_restaurant_by_id`, {
            params: { restaurantIds: user_details.restaurants_owned }
          });
          // Assuming setRestaurantData is defined
          setRestaurantData(response.data);
          dispatch(setRestaurantDetails(response.data))
          console.log("Fetched restaurant data:", response.data);
        } catch (error) {
          console.error("Error fetching restaurant data:", error.message);
          toast.error("Error fetching restaurant data", { autoClose: 1500 });
        }
      };

      fetchRestaurantData();
    }
  }, [user_details?.registered_as, backend_base_url, user_details?.restaurants_owned]);


  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(decreaseCartQuantity(item));
  };

  const clearCartDispatch = () => {
    dispatch(clearCart());
    toast.success("All items have been removed from the cart", { autoClose: 1500 });
  };

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      navigate('/order_checkout');
    } else {
      navigate('/login');
      toast.info('You need to be logged in to make orders', { autoClose: 1500 });
    }
  };

  return (
    <>
      <nav className="bg-gray-100 p-4 shadow-md sticky top-0 z-50">
        <div className="container  flex items-center justify-between">
          {/* Logo and Website Name */}
          <Link to="/">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-16 w-auto" />
              <span className="text-xl font-semibold">AR7 Food Delivery</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Popover>
              <PopoverTrigger>
                <FaShoppingCart className="text-gray-700 hover:text-gray-900 text-2xl relative" />
                {cart.items.length > 0 && (
                  <span className="absolute top-8 right-[80px] md:right-[80px] lg:right-[80px] bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cart.items.length}
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent>
                {cart.items.length > 0 ? (
                  <>
                    <p className='text-xl font-semibold'>Items In Cart:</p>
                    <p className='mt-2 font-semibold'>Restaurant : {cart.items[0].restaurant_name}</p>
                    {cart.items.map((item, index) => (
                      <div key={index} className="mb-2 flex items-center justify-between mt-8">
                        <div>
                          <p>Name: {item.item_name}</p>
                          <p>Price: Rs. {item.item_price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleDecreaseQuantity(item)} className="text-gray-700 hover:text-gray-900">
                            <FaMinus />
                          </button>
                          <p>Quantity: {item.quantity}</p>
                          <button onClick={() => handleIncreaseQuantity(item)} className="text-gray-700 hover:text-gray-900">
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    ))}
                    {isAuthenticated ? (
                      <button onClick={handleProceedToCheckout} className="bg-orange-400 text-white hover:bg-orange-600 font-bold py-2 px-4 rounded mt-4">
                        Proceed to Checkout
                      </button>
                    ) : (
                      <button onClick={handleProceedToCheckout} className="bg-orange-400 text-white hover:bg-orange-600 font-bold py-2 px-4 rounded mt-4">
                        Proceed to Checkout
                      </button>
                    )}
                    <button onClick={clearCartDispatch} className="bg-orange-400 text-white hover:bg-orange-600 font-bold py-2 px-4 rounded mt-4">
                      Clear Cart
                    </button>
                  </>
                ) : (
                  <p>No items in your cart!</p>
                )}
              </PopoverContent>
            </Popover>

            {/* Account Icon with Dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="flex items-center text-sm rounded-full focus:outline-none">
                  <FaUserCircle className="text-gray-700 hover:text-gray-900 text-2xl" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {isAuthenticated ? (
                  <>
                    <MenuItem>
                      <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Home
                      </Link>
                    </MenuItem>
                    {user_details.registered_as == 'user' ?
                      (
                        <>
                          <MenuItem>
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Your Profile
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Orders
                            </Link>
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          {restaurantData && restaurantData.map((item, index) => (
                            <MenuItem key={index}>
                              <Link to={`/restaurant_management_area/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                               Management Area
                              </Link>
                            </MenuItem>
                          ))}
                        </>
                      )
                    }
                    <MenuItem>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Logout
                      </button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Home
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Login
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Signup
                      </Link>
                    </MenuItem>
                  </>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
