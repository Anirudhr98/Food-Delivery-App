import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import logo from '../../../../assets/logo.png';

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <nav className="bg-gray-100 p-4 shadow-md">
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
          <Link to="/cart">
            <FaShoppingCart className="text-gray-700 hover:text-gray-900 text-2xl" />
          </Link>

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
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Orders
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/cart" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Cart
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Logout
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Home
                    </a>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem>
                    <a href="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Home
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/login" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Login
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/signup" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Signup
                    </a>
                  </MenuItem>
                </>
              )}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


