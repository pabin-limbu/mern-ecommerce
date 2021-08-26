const express = require("express");
const { upload, requireSignin } = require("../common-middleware");
const { createPage, getPage } = require("../controller/page");
const router = express.Router();
router.post(
  "/page/create",
  upload.fields([{ name: "banners" }, { name: "products" }]),
  requireSignin,
  createPage
);

router.get("/page/:category/:type", getPage);

module.exports = router;
