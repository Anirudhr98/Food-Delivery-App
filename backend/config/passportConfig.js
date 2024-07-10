import passport from 'passport';
// import LocalStrategy from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import models from '../models/models.js';
import bcrypt from 'bcryptjs';
const { UserModel, RestaurantOwnerModel } = models;


// User Model
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Email not found.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));



// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/auth/google/callback',
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await UserModel.findOne({ googleId: profile.id });
//     if (!user) {
//       user = new User({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//       });
//       await user.save();
//     }
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use('restaurant-owner-local',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await RestaurantOwnerModel.findOne({ owner_email:email });
    if (!user) {
      return done(null, false, { message: 'Email not found.' });
    }
    const isMatch = await bcrypt.compare(password, user.owner_password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));



export default passport;
