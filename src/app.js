import path from "path";
import logger from "morgan";
import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import session from "express-session";
import createError from "http-errors";

import passport from "./config/passport.js";
import databaseConfig from "./config/database.js";
import indexRouter from "./routes/index.routes.js";

config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.set("strictQuery", false);
const env = process.env.NODE_ENV || "development";
const dbConfig = databaseConfig[env];

try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log("Connected to MongoDB");
} catch (err) {
    console.error("MongoDB connection error:", err);
}

// 1. Import Statements

// 2. Configuration

// 3. Express Initialization

// 4. Logger Middleware
app.use(logger(process.env.MORGAN_LOG_FORMAT));

// 5. Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// 6. Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// 7. Flash Messages Middleware
app.use(flash());

// 8. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 9. Static File Middleware
app.use(express.static(path.join(__dirname, "public")));

// 10. Custom Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// 11. View Engine and Views Directory Configuration
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

// 12. Route Handling Middleware
app.use("/", indexRouter);

// 13. Error Handling Middleware (404)
app.use((req, res, next) => {
    next(createError(404));
});

// 14. Error Handling Middleware (Final)
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

export default app;
