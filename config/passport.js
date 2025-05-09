import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL, // e.g. '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    //if email is already registered, then cannot register again
    let isEmailRegistered = await User.findOne({ email: profile.emails[0].value });
    if (isEmailRegistered && !isEmailRegistered.googleId) {
      return done(null, false, { message: 'Email already registered' });
    }
    if (!user) {
      user = await User.create({
        googleId:    profile.id,
        firstName:   profile.name.givenName,
        lastName:    profile.name.familyName,
        email:       profile.emails[0].value,
        password:    profile.id,      // you’ll want to rethink this
        role:        'user',
      });
    }
  
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id);
    done(null, u);
  } catch (e) {
    done(e);
  }
});
