const { response } = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bycript = require("bcrypt");
const shortId = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

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
      userName: shortId.generate(),
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
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
      if (
        (await user.authenticate(req.body.password)) &&
        user.role === "user"
      ) {
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
        return res
          .status(400)
          .json({ message: "INVALID PASSWORD OR USERNAME" });
      }
    } else {
      return res.status(400).json({ message: "User Not Found" });
    }
  });
};
