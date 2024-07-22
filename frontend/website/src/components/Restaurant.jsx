import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { setSelectedRestaurant } from '../redux/restaurantSlice';

const RestaurantDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const selectedRestaurant = useSelector((state) => state.restaurant.selectedRestaurant);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
                const response = await api.get(`${backend_base_url}/restaurants/${id}`);
                toast.success(response)
                dispatch(setSelectedRestaurant(response.data.restaurant_detail));
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Error fetching data';
                toast.error(errorMessage, { autoClose: 3000 });
            }
        };

        if (!selectedRestaurant || selectedRestaurant._id !== id) {
            fetchRestaurant();
        }
    }, [id, selectedRestaurant, dispatch]);

    if (!selectedRestaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{selectedRestaurant.restaurant_name}</h1>
            {/* Render other restaurant details */}
        </div>
    );
};

export default RestaurantDetail;
