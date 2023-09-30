import express from "express";

import * as user_controller from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("index", { title: "My App" });
});

router.get("/sign-up", user_controller.user_sign_up_get);

router.post("/sign-up", user_controller.user_sign_up_post);

router.get("/log-in", user_controller.user_log_in_get);

router.post("/log-in", user_controller.user_log_in_post);

router.get("/log-out", user_controller.user_log_out_get);

router.get("/new-message", user_controller.user_new_message_get);

router.post("/new-message", user_controller.user_new_message_post);

router.get("/become-member", user_controller.user_become_member_get);

router.post("/become-member", user_controller.user_become_member_post);

router.get("/become-admin", user_controller.user_become_admin_get);

router.post("/become-admin", user_controller.user_become_admin_post);

export default router;
