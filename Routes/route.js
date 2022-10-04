const express = require("express");
const userController = require("../Controllers/userController");
const userValidation = require("../Middileware/validate");
const auth = require("../Middileware/auth");
const userSchema = require("../Validation/valid");
const router = express.Router();

router.post(
  "/v1/create",
  userValidation.validate(userSchema.register),
  userController.createUser
);

router.post("/v1/login", userController.login);

router.use(auth.protect);
router.get("/v1/getuser", auth.restrictTo, userController.getUser);
router.get("/v1/getuserbyid/:id", userController.getUserById);
router.patch("/v1/updateuser/:id", userController.updateUser);
router.delete("/v1/deleteuser/:id", userController.deleteUser);

module.exports = router;
