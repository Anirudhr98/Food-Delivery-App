import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAddress } from "../redux/cartSlice";
import { toast } from "react-toastify";

export default function OrderCheckout() {
  const cart = useSelector(state => state.cart.items);
  const total_order_price = useSelector(state => state.cart.total_price);
  const cartAddress = useSelector(state => state.cart.address);
  const user = useSelector(state => state.user.userDetails);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(cartAddress || user.address);

  const handleSave = () => {
    toast.success(`Address updated to: ${newAddress}`);
    dispatch(setAddress(newAddress));
    setIsEditing(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="font-medium text-2xl">
          Order Checkout Details
        </div>
        {cart && user ? (
          <>
            <div className="mb-6 mt-16">
              <h3 className="text-xl font-semibold mb-2">Cart Items</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Restaurant Name</th>
                    <th className="py-2 px-4 border-b text-left">Item</th>
                    <th className="py-2 px-4 border-b text-left">Quantity</th>
                    <th className="py-2 px-4 border-b text-left">Price per Item</th>
                    <th className="py-2 px-4 border-b text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{item.restaurant_name}</td>
                      <td className="py-2 px-4 border-b">{item.item_name}</td>
                      <td className="py-2 px-4 border-b">{item.quantity}</td>
                      <td className="py-2 px-4 border-b">Rs. {item.item_price}</td>
                      <td className="py-2 px-4 border-b">Rs. {(item.item_price * item.quantity)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 px-4 border-b font-bold" colSpan="5">Total Order Price : Rs. {total_order_price}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 mt-16">User Details</h3>
              <p className="mb-2 font-medium">Name : {user.name}</p>
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
                    <p className="font-medium">Address: {cartAddress || user.address}</p>
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
