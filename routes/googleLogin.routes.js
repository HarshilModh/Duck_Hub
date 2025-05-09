import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google',
    { failureRedirect: '/users/login' }),
  (req, res, next) => {
    try {
      // At this point req.user is set by Passport
      // Copy it into your own session key if you like:
      // req.session.user = req.user;
      req.session.user = { user: req.user };
      req.locals.googleUser = req.user;
      req.session.toast = {
        type: 'success',
        message: 'Login successful',
      };
      console.log('User authenticated:', req.session.user);

      res.redirect('/forums'); // Redirect to the desired page after successful login
    } catch (err) {
      console.log(err);
      req.session.toast = {
        type: 'error',
        message: `Error: ${err.message}`,
      };
      res.redirect('/users/login'); // Redirect to login on error
    }
  }
);

export default router;
