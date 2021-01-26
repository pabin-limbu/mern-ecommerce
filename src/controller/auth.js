const { response } = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bycript = require("bcrypt");
exports.signup = (req, res) => {
  // const errors = validationResult(req);
  // return res.status(400).json({ errors: errors.array() });

  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({ message: "User Already Registered" });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bycript.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      userName: Math.random().toString(),
    });

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      if (data) {
        // return res.status(201).json({ user: data });
        return res.status(201).json({ message: "User created" });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
     // console.log(user.authenticate("as"));
      //user.authenticate is a User schema method written in user schema to compare password .
      if (await user.authenticate(req.body.password)) {
        //if user exist and pw is true --> return token to manage a user session.
        //whenever a user is loged in --user will send token with every request which will be verified in backend.
        //Token
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const { firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: { firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({ message: "INVALID PASSWORD" });
      }
    } else {
      return res.status(400).json({ message: "User Not Found" });
    }
  });
};
