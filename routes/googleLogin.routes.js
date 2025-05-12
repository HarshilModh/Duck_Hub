import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('OAuth error:', err);
        req.session.toast = {
          type: 'error',
          message: `Authentication error: ${err.message}`,
        };
        return res.redirect('/users/login');
      }
      if (!user) {
        // e.g. user denied permissions or no profile returned
        req.session.toast = {
          type: 'error',
          message: info?.message || 'Google login failed',
        };
        return res.redirect('/users/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          req.session.toast = {
            type: 'error',
            message: `Login error: ${err.message}`,
          };
          return res.redirect('/users/login');
        }
        // Success!
        req.session.user = { user };
        req.session.toast = {
          type: 'success',
          message: 'Login successful',
        };
        return res.redirect('/forums');
      });
    })(req, res, next);
  }
);

export default router;
