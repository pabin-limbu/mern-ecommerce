const UserAddress = require("../models/address");
exports.addAddress = (req, res) => {
  //return res.status(200).json({body: req.body})
  const { payload } = req.body;

  if (payload.address) {
    if (payload.address._id) {
      //if updating existing address just update the address.
      UserAddress.findOneAndUpdate(
        { user: req.user._id, "address._id": payload.address._id },
        {
          $set: {
            "address.$": payload.address, //the positional $ operator acts as a placeholder for the first element that matches the query document
          },
        }
      ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        if (address) {
          res.status(201).json({ address });
        }
      });
    } else {
      UserAddress.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            address: payload.address,
          },
        },
        { new: true, upsert: true }
      ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        if (address) {
          res.status(201).json({ address });
        }
      });
    }
  } else {
    res.status(400).json({ error: "Params address required" });
  }
};

exports.getAddress = (req, res) => {
  UserAddress.findOne({ user: req.user._id }).exec((error, UserAddress) => {
    if (error) {
      res.status(400).json({ error });
    }
    if (UserAddress) {
      res.status(200).json({ UserAddress });
    }
  });
};
