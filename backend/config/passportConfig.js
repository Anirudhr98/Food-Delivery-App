import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import models from '../models/models.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
const { UserModel } = models;


// Manual User Registration
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

// Registration Using Google Account
passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClientID,
    clientSecret: process.env.GoogleClientSecret,
    callbackURL: `${process.env.BACKEND_BASE_URL}/user/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }
      user = new UserModel({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id
      });
      await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await UserModel.findById(_id).select('-password');;
    done(null, user);
  } catch (err) {
    done(err);
  }
});


export default passport;
