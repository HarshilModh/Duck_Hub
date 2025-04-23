import express from 'express';
import session from 'express-session';

export const checkRole = (roles) => {return (req, res, next) => {
    // Check if the user is logged in and has a role of "admin" or "user"
    let user = req.session.user;
    if (!user) {
        req.session.toast = {
            type: 'error',
            message: 'Please log in to access this page.',
        };
        return res.redirect('/users/login');
    }
    if (user.user.role === roles) {

        // User is logged in and has the required role
        next();
    }
    else {
        // User does not have the required role
        req.session.toast = {
            type: 'error',
            message: 'You do not have permission to access this page.',
        };
        return res.redirect('/users/userProfile');
    }
}
}
