import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import User from "../../models/user.js";

export const user_sign_up_validation = [
    body("firstName")
        .trim()
        .isLength({ min: 1 })
        .withMessage("First name must not be empty")
        .isLength({ max: 100 })
        .withMessage("First name cannot exceed 100 characters")
        .escape(),

    body("familyName")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Family name must not be empty")
        .isLength({ max: 100 })
        .withMessage("Family name cannot exceed 100 characters")
        .escape(),

    body("username")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Username must not be empty")
        .isLength({ max: 50 })
        .withMessage("Username cannot exceed 50 characters")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .escape(),

    body("password")
        .trim()
        .isLength({ max: 128 })
        .withMessage("Password cannot exceed 128 characters")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
            pointsPerUnique: 1,
            pointsPerRepeat: 0.5,
            pointsForContainingLower: 10,
            pointsForContainingUpper: 10,
            pointsForContainingNumber: 10,
            pointsForContainingSymbol: 10,
        })
        .withMessage(
            "Password is too weak. Field must contain min. of 8 characters, 1 lowercase and uppercase character and a symbol"
        )
        .escape(),

    body("confirm-password")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
        .escape(),
    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const user = {
            firstName: req.body.firstName,
            familyName: req.body.familyName,
            username: req.body.username,
        };

        const existingUser = await User.findOne({
            username: req.body.username,
        });

        if (!errors.isEmpty() || existingUser) {
            const existingUserError = existingUser
                ? `Sorry, the username '${req.body.username}' is already taken. Please choose a different username.`
                : "";

            res.render("forms/sign-up-form", {
                title: "Sign Up",
                user: user,
                errors: errors.array(),
                existingUserError: existingUserError,
            });
        } else {
            next();
        }
    }),
];

export const user_log_in_validation = [
    body("username")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Username must not be empty")
        .isLength({ max: 50 })
        .withMessage("Username cannot exceed 50 characters")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .escape(),

    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Password must not be empty")
        .isLength({ max: 128 })
        .withMessage("Password cannot exceed 128 characters")
        .escape(),

    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const user = {
            username: req.body.username,
        };

        if (!errors.isEmpty()) {
            res.render("forms/log-in-form", {
                title: "My App",
                user: user,
                errors: errors.array(),
            });
        } else {
            next();
        }
    }),
];
