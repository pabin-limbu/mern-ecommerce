const { response } = require("express");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({ message: "Admin Already Registered" });
    }

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      userName: shortid.generate(),
      role: "admin",
    });

    _user.save((error, data) => {
      if (error) {
        return res
          .status(400)
          .json({ message: "something went wrong Path: admin controller" });
      }

      if (data) {
        // return res.status(201).json({ user: data });
        return res.status(201).json({ message: "Admin created" });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ message: "error admin" });
    if (user) {
      // console.log(user.authenticate("as"));
      //user.authenticate is a User schema method written in user schema to compare password .
      if (
        (await user.authenticate(req.body.password)) &&
        user.role === "admin"
      ) {
        // console.log("h2", user.authenticate(req.body.password));
        //if user exist and pw is true --> return token to manage a user session.
        //whenever a user is loged in --user will send token with every request which will be verified in backend.
        //Token
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const { firstName, lastName, email, role, fullName } = user;
        res.cookie("token", token, { expiresIn: "1d" });
        res.status(200).json({
          token,
          user: { firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(401).json({ message: "INVALID PASSWORD" });
      }
    } else {
      return res.status(400).json({ message: "User Not Found" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "SIGNOUT SUCCESS" });
};
