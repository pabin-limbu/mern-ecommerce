const express = require("express");
const { validationResult } = require("express-validator");

const router = express.Router();
const { signup, signin } = require("../controller/auth");
const { validateSignupRequest, isRequestValidated } = require("../validators/auth");

router.post("/signin", signin);
router.post("/signup", validateSignupRequest, isRequestValidated, signup);

module.exports = router;
