import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaPlus, FaMinus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios'
import { addToCart, clearCart,decreaseCartQuantity } from '../redux/cartSlice';
import { logout } from '../redux/userSlice';
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import logo from '../../../../assets/logo.png';
import { toast } from 'react-toastify';

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const backend_base_url = api.baseURL
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await (api.get(`${backend_base_url}/user/logout`))
      dispatch(clearCart());
      dispatch(logout())
      navigate('/')
      toast.success("You have been successfully logged out", { autoClose: 1500 })
    } catch (error) {
      navigate('/')
      toast.error("Unable to logout!", { autoClose: 1500 })
    }
  }

  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item))
}

const handleDecreaseQuantity = (item) => {
  dispatch(decreaseCartQuantity(item))
}

const clearCartDispatch =  () => {
  dispatch(clearCart());
  toast.success("All items have been removed from the cart", { autoClose: 1500 })
}

const handleProceedToCheckoutfalse = () => {
  navigate('/login')
  toast.info('You need to be logged in to make orders')
}

const handleProceedToCheckouttrue = () => {
  navigate('/order_checkout')
}

return (
  <>
    <nav className="bg-gray-100 p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
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
              <FaShoppingCart
                className="text-gray-700 hover:text-gray-900 text-2xl relative"
              />
              {cart.items && cart.items.length > 0 && (
                <span
                  className="absolute top-8 right-[80px] md:right-[80px] lg:right-[80px] xl:right-[120px] bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                >
                  {cart.items.length}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent>
              {cart.items && cart.items.length > 0 ? (

                <>
                  <p className='text-xl font-semibold'>Items In Cart:</p>
                  {cart.items.length > 0 ? (
                    <>
                      {cart.items.map((item, index) => (
                        <div key={index} className="mb-2 flex items-center justify-between mt-8">
                          <div>
                            <p>Name: {item.item_name}</p>
                            <p>Price: Rs. {item.item_price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item)}
                              className="text-gray-700 hover:text-gray-900"
                            >
                              <FaMinus />
                            </button>
                            <p>Quantity: {item.quantity}</p>
                            <button
                              onClick={() => handleIncreaseQuantity(item)}
                              className="text-gray-700 hover:text-gray-900"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <p className="text-lg font-semibold">Total Price: Rs. {cart.total_price}</p>
                      </div>
                      {isAuthenticated ? (
                        <>
                          <button onClick={handleProceedToCheckouttrue} className="bg-orange-400 text-white hover:bg-orange-600 font-bold py-2 px-4 rounded mt-4">
                            Proceed to Checkout
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={handleProceedToCheckoutfalse} className="bg-orange-400 text-white hover:bg-orange-600 font-bold py-2 px-4 rounded mt-4">
                            Proceed to Checkout
                          </button>
                        </>
                      )}
                      <button onClick={clearCartDispatch} className="bg-orange-400 text-white hover:bg-orange-600 font-bold py-2 px-4 rounded mt-4">
                            Clear Cart
                          </button>
                    </>
                  ) : (
                    <p>No items in your cart!</p>
                  )}
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
                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Home
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Orders
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <MenuButton onClick={handleLogout} className="group text-sm text-gray-700 flex w-full items-center -2 px-4 py-2 data-[focus]:bg-gray-100">
                      Logout
                    </MenuButton>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem>
                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Home
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Login
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
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


