import { useState, useEffect } from 'react';
import api from '../api/axios'; // Assuming you're using Axios for HTTP requests
import { toast } from 'react-toastify';

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await api.get(`${backend_base_url}/restaurants`);
                setRestaurants(response.data.restaurants_list); // Assuming response.data is an array of restaurants
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Error fetching data';
                setError(errorMessage);
                toast.error(errorMessage, { autoClose: 3000 });
            } finally {
                setLoading(false);
            }
        };

        if (backend_base_url) {
            fetchRestaurants();
        } else {
            setError('Backend base URL not defined.');
            setLoading(false);
        }
    }, [backend_base_url]);

    return (
        <div className="container">
            <h1>Restaurant List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {restaurants.map((restaurant) => (
                        <li key={restaurant._id}>{restaurant.restaurant_image_url}  {restaurant.restaurant_name}</li>

                    ))}
                </ul>
            )}
        </div>
    );
}
