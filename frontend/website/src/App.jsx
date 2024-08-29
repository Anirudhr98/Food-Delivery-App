import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import OrderCheckout from './components/OrderCheckout';
import Restaurant from './components/Restaurant';
import Orders from './components/Orders';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterRestaurant from './components/RegisterRestaurant';
import ManagementArea from './components/ManagementArea';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/order_checkout" element={<OrderCheckout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/register_restaurant" element={<RegisterRestaurant />} />
            <Route path="/management_area" element={<ManagementArea />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ToastContainer />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
