import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";

import User from "../models/user.js";
import passport from "../config/passport.js";
import * as user_validation from "../middleware/validation/userValidation.middleware.js";

export const user_sign_up_get = expressAsyncHandler(async (req, res, next) => {
    res.render("forms/sign-up-form", { title: "Sign Up" });
});

export const user_sign_up_post = [
    user_validation.user_sign_up_validation,
    expressAsyncHandler(async (req, res, next) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            first_name: req.body.firstName,
            family_name: req.body.familyName,
            username: req.body.username,
            password: hashedPassword,
        });

        await user.save();
        res.redirect("/");
    }),
];

export const user_log_in_get = expressAsyncHandler(async (req, res, next) => {
    const errorMessage = req.flash("error")[0];
    res.render("forms/log-in-form", { title: "My App", errorMessage });
});

export const user_log_in_post = [
    user_validation.user_log_in_validation,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in",
        failureFlash: true,
    }),
];

export const user_log_out_get = expressAsyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
