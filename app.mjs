import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import homeRouter from "./routes/homeRouter.mjs";
import loginRouter from "./routes/loginRouter.mjs";
import signupRouter from "./routes/signupRouter.mjs";
import vipRouter from "./routes/vipRouter.mjs";
import methodOverride from "method-override";

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

// methodOverride middleware allows us to use PUT and DELETE HTTP methods where they are not supported

app.use(methodOverride("_method"));

// Use express-ejs-layouts and the layout file to wrap other views. 

app.use(expressLayouts);
app.set("layout", "layout");

// Routes

app.use("/", homeRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/vip", vipRouter);

//Test for error handling middleware

// app.get("/crash", (req, res, next) => {
//   throw new Error("Unexpected server crash!");
// });

app.use((req, res, next) => {
  res.status(404).render("404", { title: "404 Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging purposes

  // Set the status code to the error's status, or default to 500
  const statusCode = err.status || 500;

  // Check if the request expects a JSON response (e.g., for an API endpoint)
  if (req.accepts("json")) {
    // Send a JSON response with the error details
    return res.status(statusCode).json({
      status: "error",
      message: err.message || "Something went wrong!",
      stack: process.env.NODE_ENV === "development" ? err.stack : null, // Show stack trace only in development
    });
  }

  // Otherwise, render an error page (for front-end users)
  res.status(statusCode).render("errors", {
    title: `Error ${statusCode}`,
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : null, // Show stack trace only in development
  });
});

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
