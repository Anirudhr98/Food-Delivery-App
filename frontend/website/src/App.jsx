import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import Cart from './components/Cart'
import Restaurant from './components/Restaurant'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path ="/" element = {<Home />} />
      <Route path ="/login" element = {<Login />} />
      <Route path ="/signup" element = {<Signup />} />
      <Route path ="/cart" element = {<Cart />} /> 
      <Route path="/restaurant/:id" element={<Restaurant />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    <ToastContainer/>
    </BrowserRouter>
    </>
  )
}

export default App
