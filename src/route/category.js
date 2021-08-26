const { Router } = require("express");
const express = require("express");
const { requireSignin, adminMiddleware } = require("../common-middleware");
const router = express.Router();
const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
} = require("../controller/category");
const multer = require("multer"); //npm package to work with file upload.
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

router.post(
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  addCategory
);
router.post(
  "/category/update",
  upload.single("categoryImage"),
  updateCategories
);
router.get("/category/getcategory", getCategories);
router.post("/category/delete", deleteCategories);
module.exports = router;
