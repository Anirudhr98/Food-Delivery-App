import express from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from './config/passportConfig.js';
import {UserRouter,RestaurantOwnerRouter,RestaurantsRouter} from './routes/routes.js';
import 'dotenv/config';

const app = express();
const port = 4000;

// Db connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB Connected to AR7FoodDeliveryApp");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err.message);
  });

app.use(express.json());
app.use(cors());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// API Endpoints
app.get('/', (req, res) => {
  res.send("Home Page Request");
});
app.use('/user', UserRouter);
app.use('/restaurant-owner',RestaurantOwnerRouter);
app.use('/restaurants', RestaurantsRouter);

app.listen(port, () => console.log(`Listening on port localhost:${port}`));
