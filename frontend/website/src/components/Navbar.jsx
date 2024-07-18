import logo from '../../../../assets/logo.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <nav className="bg-gray-100 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Website Name */}
        <Link to='/'>
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <span className="text-xl font-semibold">AR7 Food Delivery</span>
        </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-4 ml-32 hidden md:flex">
          <Input type="text" placeholder="Search..." className="w-full max-w-lg" />
        </div>

        {/* Signup Button */}
        <Link to='/signup'>
        <Button
          className="bg-orange-400 text-white hover:bg-orange-500 hidden md:inline-block"
        >
          Sign Up
        </Button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-gray-500 border-gray-400 hover:text-gray-700 hover:border-gray-600"
          onClick={toggleMobileMenu}
        >
          <svg className="fill-current h-6 w-6" viewBox="0 0 20 20">
            <path d="M0 3h20v2H0V3zm0 5h20v2H0V8zm0 5h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden block bg-gray-100 mt-2 p-4">
          <div className="mb-4">
            <Input type="text" placeholder="Search..." className="w-full" />
          </div>
        <Link to='/signup'>
          <Button
            className="bg-orange-300 text-white hover:bg-orange-400 w-full"
          >
            Sign Up
          </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
