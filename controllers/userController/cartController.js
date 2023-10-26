import Cart from "../../models/cart.js";
import Product from "../../models/product.js";

export const cart = {
  addToCart: async (req, res) => {
    const { productId, userId, selectedVariant } = req.body;
    try {
      const product = await Product.findOne({ _id: productId }); 
      const userCart = await Cart.findOne({ user: userId });
      if (userCart) {
        console.log("pr-res", product.restaurant_id, "crt-rest", userCart.restaurantId);
        if(product.restaurant_id.equals(userCart.restaurantId)){
          console.log("tryuioopp[p");
        const proExist = userCart.items.findIndex(
            (item) => item.productId == productId
          );
        if (proExist !== -1) {
          const varExist = userCart.items.find(item => item.variant === selectedVariant.name);
          if(varExist){
        await Cart.updateOne(
            { user: userId, "items.productId": productId, "items.variant":selectedVariant.name },
            {
              $inc: {
                "items.$.quantity": 1,
                "items.$.price": selectedVariant.offerPrice,
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
                  price: selectedVariant.offerPrice,
                  variant: selectedVariant.name
                },
              },
            }
          );
          res.status(200).send({
            success: true,
            message: "product added to cart",
          });
        }
        }else{
            await Cart.updateOne(
                { user: userId },
                {
                  $addToSet: {
                    "items": {
                      productId: product._id,
                      price: selectedVariant.offerPrice,
                      variant: selectedVariant.name
                    },
                  },
                }
              );
              res.status(200).send({
                success: true,
                message: "product added to cart",
              });
        }
      }else{
        await Cart.updateOne(
          { user: userId },
          {
             restaurantId:product.restaurant_id,
              items: {
                productId: product._id,
                price: selectedVariant.offerPrice,
                variant: selectedVariant.name
              },
          }
        );
        res.status(200).send({
          success: true,
          message: "product added to cart with updated restaurant",
        });
      }
      } else {
             await Cart.create({
          user: userId,
          restaurantId:product.restaurant_id,
          items: [
            {
              productId: product._id,
              price: selectedVariant.offerPrice,
              variant: selectedVariant.name
            },
          ],
        })
            res.status(200).send({
                success:true,
                message:"product added to cart"
            })
        
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Internal server error", 
      });
    }
  },

  changeQuantity: async(req,res)=>{
    try {
      const {itemId, cartId, action, variant} = req.body
      const product = await Product.findOne({ _id: itemId });
      const vrIndx = product.variants.findIndex(
        (item) => item.name == variant
      );
      if(action.increment){
        await Cart.updateOne({_id:cartId, "items.productId":itemId, "items.variant":variant},{
          $inc: {
            "items.$.quantity": 1,
            "items.$.price": product.variants[vrIndx].offerPrice,
          },
        })
      }else if(action.decrement){
        await Cart.updateOne({_id:cartId, "items.productId":itemId, "items.variant":variant},{
          $inc: {
            "items.$.quantity": -1,
            "items.$.price": -product.variants[vrIndx].offerPrice,
          },
        })
      }
      res.status(200).send({
        success: true,
        message: "quantityChanged",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },

  cancelCartItem:async(req,res)=>{
    try {
      const {itemId, cartId, variant} = req.body
      console.log(req.body);
      await Cart.updateOne({_id:cartId},{
        $pull:{
           items: { productId: itemId, variant }
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
