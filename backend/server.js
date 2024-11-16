import express from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo'; 
import passport from './config/passportConfig.js';
import { UserRouter, RestaurantsRouter, OrdersRouter, RestaurantOwnerRouter } from './routes/routes.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

// MongoDB session store setup
const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,  // MongoDB connection URI for session store
    dbName: 'AR7FoodDelivery',  // Specify database name for session storage
    collectionName: 'sessions', // Optional: default is 'sessions'
  }),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
});

// DB connection
mongoose.connect(process.env.MONGODB_URI, { dbName: 'AR7FoodDelivery' })
  .then(() => {
    console.log("DB Connected to AR7FoodDeliveryApp");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err.message);
  });

app.use(express.json());
app.use(cors());
app.use(sessionMiddleware);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// API Endpoints
app.get('/', (req, res) => {
  res.send("Home Page Request");
});
app.use('/user', UserRouter);
app.use('/restaurant_owner', RestaurantOwnerRouter);
app.use('/restaurants', RestaurantsRouter);
app.use('/orders', OrdersRouter);

app.listen(port, () => console.log(`Listening on port localhost:${port}`));
