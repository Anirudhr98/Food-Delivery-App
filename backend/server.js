import express from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import RedisStore from 'connect-redis';
import passport from './config/passportConfig.js';
import { UserRouter, RestaurantsRouter,OrdersRouter,RestaurantOwnerRouter } from './routes/routes.js';
import { createClient } from 'redis';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

// Redis client setup
const redisClient = createClient({
  socket: {
    host: 'redis-10766.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 10766,
  },
  password: process.env.REDIS_PASSWORD // Use environment variable for Redis password
})
redisClient.connect().catch(console.error)

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
})


const sessionMiddleware = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
});

// Db connection
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
app.use('/restaurant_owner',RestaurantOwnerRouter);
app.use('/restaurants', RestaurantsRouter);
app.use('/orders',OrdersRouter)
app.listen(port, () => console.log(`Listening on port localhost:${port}`));

export {redisClient}