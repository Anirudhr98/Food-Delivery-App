import mongoose from 'mongoose';
import models from '../models/models.js';

const { OrdersModel } = models;

export const createorder = async (req, res) => {
    const {
        order_items, all_item_prices, discount_offered, delivery_charges, order_total_price, order_status,
        user_id, delivery_address, restaurant_id, created_at, delivered_at
    } = req.body;


    try {
        const newOrder = new OrdersModel({
            order_items, all_item_prices, discount_offered, delivery_charges, order_total_price, order_status,
            user_id, delivery_address, restaurant_id, created_at, delivered_at
        });
        await newOrder.save();
        res.status(201).json({ message: 'Order created', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
};


export const getOrders = async (req, res) => {
    try {
      const user_id = req.body.user_id; 
      const user_id_objectId = new mongoose.Types.ObjectId(user_id);
      const orders_list = await OrdersModel.find({ user_id: user_id_objectId });
      res.status(200).json({ message: 'Orders found', orders_list: orders_list });
    } catch (err) {
      console.error(err); // Log the error
      res.status(500).json({ message: 'Error finding orders' });
    }
  };
  