const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true, // index is used so that we can query based on the username.
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // use enum if there are definite number of fixed value for one variable.
      default: "user",
    },
    contactNumber: {
      type: String,
    },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

/** 
 * since it is not recomended to use synchronous function in serverside.
//Virtual field-
//--> allow us to set field as alternative to custom setter.
// Here we will drectly get the password-->hash it-->save hashed passowrd in user schema.
// allow us to lesser the code in controller.
userSchema.virtual("password").set(function (password) {
  //virtual look for incoming data and if the match find it executes the set function.
  //this function is for hassing a password before saving.
  this.hash_password = bcrypt.hashSync(password, 10);
});
*/
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: function (passowrd) {
    return bcrypt.compare(passowrd, this.hash_password); // function to compare the plain pw with hashed password.
  },
};

module.exports = mongoose.model("User", userSchema);
