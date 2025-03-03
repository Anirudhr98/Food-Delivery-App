import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/axios";
import { toast } from "react-toastify";
import { login } from "@/redux/userSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Profile() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
  
  // Ensure restaurant_details is always an array
  const restaurant_details = useSelector(
    (state) => state.restaurant_management.restaurant_details || []
  );

  // Initial values for the form
  const [originalValues] = useState({
    name: userDetails.name || "",
    address: userDetails.address || "",
    _id: userDetails._id,
    restaurants_owned:
      userDetails.registered_as === "restaurant_owner"
        ? restaurant_details.map((restaurant) => restaurant.restaurant_name).join(", ")
        : "",
  });

  const [formValues, setFormValues] = useState(originalValues);
  const [editMode, setEditMode] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Submit updated user details
  const handleSubmit = async () => {
    try {
      const response = await api.put(
        `${backend_base_url}/user/updateUserDetails`,
        formValues
      );
      dispatch(login(response.data.updatedUserDetails));
      toast.success("Updated Details successfully!", { autoClose: 1500 });
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update details. Please try again.", {
        autoClose: 1500,
      });
    }
  };

  // Cancel edit mode and revert changes
  const handleCancel = () => {
    setFormValues(originalValues);
    setEditMode(false);
  };

  return (
    <Card className="w-3/6 mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Name Section */}
        <div className="mb-4">
          <strong className="block mb-2">Name:</strong>
          <div className="flex items-center">
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="block p-2 border border-gray-300 rounded bg-gray-50 flex-grow"
                style={{ flexBasis: "90%" }}
              />
            ) : (
              <span
                className="block p-2 border border-gray-300 rounded bg-gray-50 flex-grow"
                style={{ flexBasis: "90%" }}
              >
                {userDetails.name}
              </span>
            )}
          </div>
        </div>

        {/* Email Section */}
        <div className="mb-4">
          <strong className="block mb-2">Email:</strong>
          <div className="flex items-center">
            <span
              className="block p-2 border border-gray-300 rounded bg-gray-50 flex-grow"
              style={{ flexBasis: "90%" }}
            >
              {userDetails.email}
            </span>
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-4">
          <strong className="block mb-2">Address:</strong>
          <div className="flex items-start">
            <textarea
              rows={4}
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded flex-grow"
              style={{ flexBasis: "90%" }}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* Restaurants Owned Section */}
        {userDetails.registered_as === "restaurant_owner" && restaurant_details.length > 0 && (
          <div className="mb-4">
            <strong className="block mb-2">Restaurants Owned:</strong>
            <div className="flex items-start">
              <textarea
                rows={1}
                name="restaurants_owned"
                value={formValues.restaurants_owned}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded flex-grow"
                style={{ flexBasis: "90%" }}
                disabled
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end">
          {editMode ? (
            <>
              <button
                onClick={handleSubmit}
                className="ml-2 p-2 bg-orange-400 hover:bg-orange-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="ml-2 p-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="ml-2 p-2 bg-orange-400 hover:bg-orange-500 text-white rounded"
            >
              Edit Profile Details
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
