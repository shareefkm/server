import Cart from "../../models/cart.js";
import Product from "../../models/product.js";
import Users from "../../models/user.js";

export const cart = {
  addToCart: async (req, res) => {
    const { productId, userId } = req.body;
    try {
      const product = await Product.findOne({ _id: productId });
      const userCart = await Cart.findOne({ user: userId });
      if (userCart) {
        const proExist = userCart.items.findIndex(
            (item) => item.productId == productId
          );
        if (proExist !== -1) {
        await Cart.updateOne(
            { user: userId, "items.productId": productId },
            {
              $inc: {
                "items.$.quantity": 1,
                "items.$.price": product.price,
              },
            }
          );
          res.status(200).send({
            success: true,
            message: "product added to cart",
          });
        }else{
            await Cart.updateOne(
                { user: userId },
                {
                  $addToSet: {
                    "items": {
                      productId: product._id,
                      price: product.price,
                    },
                  },
                }
              );
              res.status(200).send({
                success: true,
                message: "product added to cart",
              });
        }
      } else {
             await Cart.create({
          user: userId,
          items: [
            {
              productId: product._id,
              price: product.price,
            },
          ],
        })
            res.status(200).send({
                success:true,
                message:"product added to cart"
            })
        
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },

  changeQuantity: async(req,res)=>{
    try {
      const {itemId, cartId, action} = req.body
      const product = await Product.findOne({ _id: itemId });
      if(action.increment){
        await Cart.updateOne({_id:cartId, "items.productId":itemId},{
          $inc: {
            "items.$.quantity": 1,
            "items.$.price": product.price,
          },
        })
      }else if(action.decrement){
        await Cart.updateOne({_id:cartId, "items.productId":itemId},{
          $inc: {
            "items.$.quantity": -1,
            "items.$.price": -product.price,
          },
        })
      }
      res.status(200).send({
        success: true,
        message: "quantityChanged",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },

  cancelCartItem:async(req,res)=>{
    try {
      const {itemId, cartId} = req.body
      await Cart.updateOne({_id:cartId},{
        $pull:{
           items: { productId: itemId }
        }
      })
      res.status(200).send({
        success:true,
        message:"Item cancelled"
      })
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },

  cartTotal:async(req,res)=>{
    try {
      const { cartId, amount, grandTotal } = req.body
      await Cart.updateOne({_id:cartId},{
        $set:{
          total:amount,
          grandTotal,
        }
      })
      res.status(200).send({
        success:true,
        message:"total updated"
      })
    } catch (error) {
      res.status(500).send({
        success:false,
        message:"seerver error"
      })
    }
  },
  getcart: async(req,res)=>{
    try {
      const userId  = req.query.id
      const cartData = await Cart.findOne({user:userId}).populate('items.productId')
      if(cartData){
        res.status(200).send({
          success:true,
          cartData
        })
      }else{
        res.status(200).send({
          success:false,
          message:"Your Cart is empty"
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Server error"
      })
    }
  }
};
