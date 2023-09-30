import express from "express";

import * as user_controller from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res, next) => {
    if (req.user) {
        res.render("index", { title: "My App" });
    } else {
        res.render("forms/log-in-form", { title: "My App" });
    }
});

router.get("/sign-up", user_controller.user_sign_up_get);

router.post("/sign-up", user_controller.user_sign_up_post);

router.get("/log-in", user_controller.user_log_in_get);

router.post("/log-in", user_controller.user_log_in_post);

router.get("/log-out", user_controller.user_log_out_get);

export default router;
