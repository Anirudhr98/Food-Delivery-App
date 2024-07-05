import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    order_items: { type: Array, required: true },
    order_total_price: { type: Number, required: true },
    order_status: { type: String, required: true }
});

const restaurantitemsSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    item_image_url: { type: String, required: true },
    item_description: { type: String },
    item_price: { type: Number, required: true },
    is_best_seller: { type: Boolean, default: false }
});

const restaurantSchema = new mongoose.Schema({
    restaurant_name: { type: String, required: true },
    restaurant_items: [restaurantitemsSchema],
    restaurant_address: { type: String, required: true },
    cuisines: { type: Array, required: true },
    restaurant_image_url: { type: String, required: true },
    discount_offered: { type: Number, default: 0 },
    delivery_time: { type: Number, default:30},
    orders: [ordersSchema],
    is_veg: { type: Boolean, required: true }
});

const restaurantownerSchema = new mongoose.Schema({
    owner_name: { type: String, required: true },
    owner_email: { type: String, required: true },
    owner_password: { type: String, required: true},
    restaurants_owned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    address: { type: String },
    orders: [ordersSchema]
});

const UserModel = mongoose.model("User", userSchema);
const RestaurantOwnerModel = mongoose.model("RestaurantOwner", restaurantownerSchema);
const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);
const RestaurantItemModel = mongoose.model('RestaurantItem', restaurantitemsSchema);
const OrdersModel = mongoose.model('Orders', ordersSchema);

export default { UserModel, RestaurantOwnerModel, RestaurantModel, RestaurantItemModel, OrdersModel };
