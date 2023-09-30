import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

export const new_message_validation = [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Title must not be empty")
        .isLength({ max: 255 })
        .withMessage("Title cannot exceed 255 characters")
        .escape(),

    body("message")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Message must not be empty")
        .isLength({ max: 2000 })
        .withMessage("Message cannot exceed 2000 characters")
        .escape(),

    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("forms/new-message-form", {
                title: "New Message",
                errors: errors.array(),
            });
        } else {
            next();
        }
    }),
];
