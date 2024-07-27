import { useState } from 'react';
import { useSelector } from 'react-redux';
// import { updateUserAddress } from '../redux/actions'; // Adjust the path based on your project structure

export default function Profile() {
  const userDetails = useSelector((state) => state.user.userDetails);

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveAddress = () => {
    // dispatch(updateUserAddress(address)); // Make sure to define this action in your Redux actions
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="font-medium text-2xl mt-8">User Profile</div>
      <div className="mb-4 mt-8">
        <strong>Name:</strong> {userDetails.name}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {userDetails.email}
      </div>
      <div className="mb-4">
        <strong>Address:</strong>
        {isEditing ? (
          <>
            <input
              type="text"
              value={userDetails.address}
            //   onChange={handleAddressChange}
              className="border p-2 rounded ml-2"
            />
            <button
              onClick={handleSaveAddress}
              className="bg-blue-500 text-white hover:bg-blue-600 font-bold py-1 px-4 rounded ml-2"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <span className="ml-2">{userDetails.address}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white hover:bg-green-600 font-bold py-1 px-4 rounded ml-2"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
