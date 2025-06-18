import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import { connectDB } from "./dbConfig/index.js";
import exphbs from "express-handlebars";
import session from "express-session";
import passport from 'passport';
import './config/passport.js'
import authRoutes from './routes/googleLogin.routes.js';




//  Create your app
const app = express();
dotenv.config();

// Standard middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/public", express.static("public"));

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};
app.use(rewriteUnsupportedBrowserMethods);

//  Session (must come before toast-middleware)
app.use(
  session({
    name: "AuthenticationState",
    secret: process.env.SESSION_SECRET || "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

//  Toast-middleware: expose once, then clear
app.use((req, res, next) => {
  res.locals.toast = req.session.toast || null;
  delete req.session.toast;
  next();
});
//add user to res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user?.user || null;
  res.locals.googleUser = req.session.user?.user.googleId || null;
  console.log("User in session:", req.session.user);
  console.log("User in locals:", res.locals.user);
  console.log("Google user in locals:", res.locals.googleUser);
  
  next();
});
//  Register Handlebars + `json` helper
app.engine(
  "handlebars",
  exphbs.engine({ 
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a == b,
      json: (context) => JSON.stringify(context || {}),
      formatDate: (d) =>
        new Date(d).toLocaleString("en-US", { timeZone: "America/New_York" }),
      ifEquals: function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      },
      and: (a, b) => a && b
    },
  })
);
app.set("view engine", "handlebars");

// Your routes
//google login routes
app.use('/auth', authRoutes); // Google login routes
// app.use("/", indexRoutes)
indexRoutes(app);



//  Connect DB & start server
connectDB()
  .then(() =>
    app.listen(process.env.PORT, '0.0.0.0', () =>
      console.log(`✅ Server running on http://0.0.0.0:${process.env.PORT}`)
    )
  )
  .catch((err) => console.error("❌ DB connection error:", err));
