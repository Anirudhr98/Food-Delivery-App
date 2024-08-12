import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import OrderCheckout from './components/OrderCheckout'
import Restaurant from './components/Restaurant'
import Orders from './components/Orders'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/order_checkout" element={<OrderCheckout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer />
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
