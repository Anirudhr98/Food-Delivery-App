import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    order_items: { type: Array, required: true },
    order_total_price: { type: Number, required: true },
    order_status: { type: String, required: true },
    user_id : {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    restaurant_id : {type:mongoose.Schema.Types.ObjectId,ref:'Restaurant'}
});


const restaurantitemsSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    item_image_url: { type: String, required: true },
    item_description: { type: String },
    item_price: { type: Number, required: true },
    cuisine_type: [{ type: String, required: true}],
    item_categories: [{ type: String, required: true}],
    is_best_seller: { type: Boolean, default: false },
    is_veg: { type: Boolean, required: true }
});

const restaurantSchema = new mongoose.Schema({
    restaurant_name: { type: String, required: true },
    restaurant_items: [restaurantitemsSchema],
    restaurant_address: { type: String, required: true },
    cuisines_available: { type: Array, required: true },
    restaurant_image_url: { type: String, required: true },
    discount_offered: { type: Number, default: 50 },
    delivery_time: { type: Number, default:30},
    orders: [ordersSchema],
});

// const restaurantownerSchema = new mongoose.Schema({
//     owner_name: { type: String, required: true },
//     owner_email: { type: String, required: true },
//     owner_password: { type: String, required: true},
//     restaurants_owned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
// });

const userSchema = new mongoose.Schema({
    googleId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    address: { type: String },
    orders: [ordersSchema],
    registered_as: {
        type: String,
        enum: ['user', 'restaurant_owner'],
        default: 'user' 
        },
    restaurants_owned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
});


const UserModel = mongoose.model("User", userSchema);
// const RestaurantOwnerModel = mongoose.model("RestaurantOwner", restaurantownerSchema);
const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);
const RestaurantItemModel = mongoose.model('RestaurantItem', restaurantitemsSchema);
const OrdersModel = mongoose.model('Orders', ordersSchema);

export default { UserModel, RestaurantModel, RestaurantItemModel, OrdersModel };
