const { Result } = require("express-validator");

const Cart = require("../models/cart");

function runUpdate(condition, updateData) {
  console.log({ condition, updateData });
  console.log(updateData);
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((Result) => resolve())
      .catch((err) => reject(err));
  });
}

exports.addItemToCart = (req, res) => {
  // check if cart for current user exist
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) {
      res.status(400).json({ error });
    }
    //cart for curretn user exst.
    if (cart) {
      let promiseArray = [];
      let condition, update; //set condition and action to reduce some lines;

      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product; // get productid request body--> item that is been send by user. ** productId

        //check if product in cartItem matches the product sent by user.
        const item = cart.cartItems.find((c) => c.product == product); //return single item from cartItems array if product if matches.** single cart item
        if (item) {
          //check both useID and productId sent by user inside single cart item received above.
          condition = { user: req.user._id, "cartItems.product": product };
          update = {
            //ifmatched update quantity.
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }

        promiseArray.push(runUpdate(condition, update));
      });

      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
      res.status(200);
    } else {
      // if cart for current User not existed--> create a new cart.
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });
      cart.save((error, cart) => {
        if (error) {
          res.status(400).json({ error });
        }
        if (cart) {
          res.status(200).json({ cart });
        }
      });
    }
  });
};

exports.getCartItem = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            img: item.product.productPictures[0].img,
            price: item.product.price,
            qty: item.quantity,
          };
        });

        res.status(200).json({ cartItems });
      } else {
        res.status(404).json({ message: "data not found" });
      }
    });
};

// new update remove cart items
exports.removeCartItems = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Cart.update(
      { user: req.user._id },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};
