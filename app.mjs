import 'dotenv/config';
import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import homeRouter from "./routes/homeRouter.mjs";
import loginRouter from "./routes/loginRouter.mjs";
import signupRouter from "./routes/signupRouter.mjs";
import vipRouter from "./routes/vipRouter.mjs";
import messageRouter from "./routes/messageRouter.mjs";
import session from 'express-session';
import passport from './config/passport.mjs';
import { pool } from './models/pool.mjs';
import pgSession from 'connect-pg-simple';
import flash from 'connect-flash';

// Database connection parameters are now handled by pool.mjs using command line arguments

const app = express();

// Node.js don't have __dirname and __filename in ES Modules so we need to derive them:

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Print out the HTTP method and the requested URL every time a request is received

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Serves static files (images, CSS, etc.)

app.use(express.static(path.join(__dirname, "public")));

// Setting EJS as the view engine

app.set("view engine", "ejs");

// Parses URL-encoded form data (like data from an HTML form) and places it into req.body

app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionSecret = process.env.RAILWAY_SESSION_SECRET || process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('Session secret is required. Please set RAILWAY_SESSION_SECRET or SESSION_SECRET environment variable.');
}

app.use(session({
  store: new (pgSession(session))({
    pool,
    tableName: 'user_sessions'
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.user = req.user || null; // Make user available to all views
  next();
});

// Use express-ejs-layouts and the layout file to wrap other views. 

app.use(expressLayouts);
app.set("layout", "layout");

// Routes

app.use("/", homeRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/vip", vipRouter);
app.use("/messages", messageRouter);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).render("errors/404", { 
    title: "404 Not Found",
    user: req.user || null
  });
});

// Handle database connection errors
app.use((err, req, res, next) => {
  if (err.code === 'ECONNREFUSED' || err.code === '28P01') {
    console.error('Database connection error:', err);
    return res.status(500).render("errors/500", {
      title: "Database Error",
      message: "Unable to connect to the database. Please try again later.",
      user: req.user || null
    });
  }
  next(err);
});

// Handle all other errors
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // For API requests
  if (req.accepts('json')) {
    return res.status(statusCode).json({
      status: 'error',
      message: err.message || 'Something went wrong!',
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // For regular requests
  res.status(statusCode).render("errors/500", {
    title: `Error ${statusCode}`,
    message: err.message || 'Something went wrong!',
    stack: isDevelopment ? err.stack : null,
    user: req.user || null
  });
});

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
