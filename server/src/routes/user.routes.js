import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handler/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
    "/signup",
    body("username")
        .exists()
        .withMessage("username is required")
        .isLength({ min: 8 })
        .withMessage("username must be at least 8 characters long")
        .custom(async (value) => {
            const user = await userModel.findOne({ username: value });
            if (user) return Promise.reject("username already exists");
        }),

    body("password")
        .exists()
        .withMessage("password is required")
        .isLength({ min: 8 })
        .withMessage("password must be at least 8 characters long"),
    body("confirmPassword")
        .exists()
        .withMessage("congirmPassword is required")
        .isLength({ min: 8 })
        .withMessage("confirmPassword must be at least 8 characters long")
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw new Error("confirmPassword not match");
            return true;
        }),
    body("displayName")
        .exists()
        .withMessage("displayName is required")
        .isLength({ min: 8 })
        .withMessage("displayName must be at least 8 characters long"),
    requestHandler.validate,
    userController.signup
);

router.post(
    "/signin",
    body("username")
        .isLength({ min: 8 })
        .withMessage("username must be at least 8 characters long"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("password must be at least 8 characters long"),
    requestHandler.validate,
    userController.signin
);

router.put(
    "/update-password",
    tokenMiddleware.auth,
    body("password")
        .exists()
        .withMessage("password is required")
        .isLength({ min: 8 })
        .withMessage("password must be at least 8 characters long"),
    body("newPassword")
        .exists()
        .withMessage("newPassword is required")
        .isLength({ min: 8 })
        .withMessage("newPassword must be at least 8 characters long"),
    body("confirmNewPassword")
        .exists()
        .withMessage("confirmNewPassword is required")
        .isLength({ min: 8 })
        .withMessage("confirmNewPassword must be at least 8 characters long")
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw new Error("confirmNewPassword not match");
            return true;
        }),
    requestHandler.validate,
    userController.updatePassword
);

router.get("/info", tokenMiddleware.auth, userController.getInfo);

router.get(
    "/favorites",
    tokenMiddleware.auth,
    favoriteController.getFovoritesOfUser
);

router.post(
    "/favorites",
    tokenMiddleware.auth,
    body("mediatype")
        .exists()
        .withMessage("mediatype is required")
        .custom((type) => ["movie", "tv"].includes(type))
        .withMessage("mediaType invalid"),
    body("mediaId")
        .exists()
        .withMessage("mediaId is required")
        .isLength({ min: 1 })
        .withMessage("mediaId cannot be empty"),
    body("mediaTitle").exists().withMessage("mediaTitle is required"),
    body("mediaPoster").exists().withMessage("mediaPoster is required"),
    body("mediaRate").exists().withMessage("mediaRate is required"),
    requestHandler.validate,
    favoriteController.addFavorite
);

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
);

export default router;
