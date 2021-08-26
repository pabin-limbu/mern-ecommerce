const { Router } = require("express");
const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const router = express.Router();
const {
  addItemToCart,
  getCartItem,
  removeCartItems,
} = require("../controller/cart");
router.post(
  "/user/cart/addtocart",
  requireSignin,
  userMiddleware,
  addItemToCart
);
router.post(
  "/user/cart/getCartItems",
  requireSignin,
  userMiddleware,
  getCartItem
);
//router.get("/category/getcategory", getCategories);

//new update
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);

module.exports = router;
