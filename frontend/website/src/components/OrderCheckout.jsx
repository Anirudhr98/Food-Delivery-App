import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAddress } from "../redux/cartSlice";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

export default function OrderCheckout() {
  const cart_items = useSelector(state => state.cart.items);
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user.userDetails);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(cart.address || user.address);

  const handleSave = () => {
    toast.success(`Address updated to: ${newAddress}`);
    dispatch(setAddress(newAddress));
    setIsEditing(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="font-medium text-2xl underline">
          Order Checkout Details
        </div>
        {cart_items && user ? (
          <>
            <div className="mb-6 mt-8">
              <p className=" text-xl font-semibold "> Restaurant Name : {cart.items[0].restaurant_name} </p>
              <h3 className="text-xl font-semibold mb-2 mt-8">Cart Items</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Item</th>
                    <th className="py-2 px-4 border-b text-left">Quantity</th>
                    <th className="py-2 px-4 border-b text-left">Price per Item</th>
                    <th className="py-2 px-4 border-b text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart_items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{item.item_name}</td>
                      <td className="py-2 px-4 border-b">{item.quantity}</td>
                      <td className="py-2 px-4 border-b">Rs. {item.item_price}</td>
                      <td className="py-2 px-4 border-b">Rs. {(item.item_price * item.quantity)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}><Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="py-2 px-4 border-b font-bold" colSpan="5">Total Order Price : Rs. {cart.total_price} </AccordionTrigger>
                        <AccordionContent>
                          <p className="py-2 px-4 border-b">All Item Prices &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp;   {cart.all_item_prices}</p>
                          <p className="py-2 px-4 border-b">Discount Offered :&nbsp;&nbsp; {cart.discount_offered}</p>
                          <p className="py-2 px-4 border-b">Delivery Charges :&nbsp;&nbsp; {cart.delivery_charges}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 mt-16 underline">User Details</h3>
              <p className="mb-2 font-medium mt-4">Name : {user.name}</p>
              <div className="mb-2">
                {/* Address Section */}
                {isEditing ? (
                  <div className="mb-2">
                    <textarea
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      rows="3"
                    />
                    <button
                      onClick={handleSave}
                      className="mt-2 px-4 py-2 bg-orange-400 hover:bg-orange-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mb-2">
                    <p className="font-medium">Address: {cart.address || user.address}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 px-4 py-2 bg-orange-400 hover:bg-orange-600 text-white rounded"
                    >
                      Edit Address
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Link to="/">
              <button className="bg-orange-400 text-white hover:bg-orange-600 font-bold py-2 px-4 rounded mt-8">
                Proceed to Checkout
              </button>
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
