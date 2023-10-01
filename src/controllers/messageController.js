import expressAsyncHandler from "express-async-handler";

import Message from "../models/message.js";
import authenticate from "../middleware/authenticate.middleware.js";
import * as message_validation from "../middleware/validation/messageValidation.middleware.js";

export const message_list_get = expressAsyncHandler(async (req, res, next) => {
    const messages = await Message.find({})
        .populate("user", "first_name family_name")
        .exec();
    res.render("index", { title: "Incognito Lounge", messages: messages });
});

export const new_message_get = [
    authenticate,
    expressAsyncHandler(async (req, res, next) => {
        res.render("forms/new-message-form", { title: "New Message" });
    }),
];

export const new_message_post = [
    message_validation.new_message_validation,
    expressAsyncHandler(async (req, res, next) => {
        const newMessage = await Message({
            user: req.user._id,
            title: req.body.title,
            message: req.body.message,
        });
        await newMessage.save();
        res.redirect("/");
    }),
];

export const delete_message_post = [
    expressAsyncHandler(async (req, res, next) => {
        await Message.findByIdAndDelete(req.body.id);
        res.redirect("/");
    }),
];
