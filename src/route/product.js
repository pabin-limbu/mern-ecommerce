const express = require("express");
const { requireSignin, adminMiddleware } = require("../common-middleware");
const router = express.Router();
const { createProduct, getProductsBySlug, getProductDetailsById } = require("../controller/product");
const multer = require("multer"); //npm package to work with file upload.
//const upload = multer({ dest: "uploads/" });
const shortid = require("shortid");
const path = require("path");

//multer configuration to set the destination of file and custom file name.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads")); // __dirname--> current directory,dirname.(__dirname)--> current directorys parent directory
  },
  filename: function (req, file, cb) {
    //cb(null, file.fieldname + '-' + Date.now())
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// router.post(
//   "/product/create",
//   requireSignin,
//   adminMiddleware,
//   upload.single("productPicture"),
//   createProduct
// );
router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);

router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);// difference by product and products.

module.exports = router;
