const express = require("express");
const { requireSignin } = require("../../common-middleware");
const router = express.Router();
const { signup, signin, signout } = require("../../controller/admin/auth");
const {
  validateSignupRequest,
  isRequestValidated,
} = require("../../validators/auth");

router.post("/admin/signin", signin);
router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/admin/signout", signout);

module.exports = router;
