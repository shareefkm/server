import Product from "../../models/product.js";

export const products = {
  addProduct: async (req, res) => {
    try {
      const { name, description, category, price, images, restaurant_id } =
        req.body;
      const product = await Product.create({
        name,
        description,
        category,
        price,
        images,
        restaurant_id,
      });
      res.status(201).send({
        success: true,
        message: "Product added success",
        product,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
        error,
      });
    }
  },
  getRestaurantProduct: async(req,res)=>{
    try {
      const restId = req.query.id
      const product = await Product.find({ isDeleted: false, restaurant_id:restId });
      if (product.length > 0) {
        res.status(200).send({
          success: true,
          product,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Product not available",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Product.find({ isDeleted: false });
      if (product.length > 0) {
        res.status(200).send({
          success: true,
          product,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Product not available",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { proId } = req.body;
      await Product.updateOne(
        { _id: proId },
        {
          $set: {
            isDeleted: true,
          },
        }
      )
        .then(() => {
          res.status(200).send({
            success: true,
            message: "product deleted",
          });
        })
        .catch(() => {
          res.status(404).send({
            success: false,
            message: "Something went wrong",
          });
        });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },
  getEditProduct: async (req, res) => {
    try {
      const { id } = req.query;
      const foundProduct = await Product.findOne({ _id: id });
      if (foundProduct) {
        res.status(200).send({ success: true, product: foundProduct });
      } else {
        res.status(404).send({ success: false, message: "Product not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },
  editProduct: async (req, res) => {
    try {
      const { productId, name, description, price, category, images } =
        req.body;
      await Product.updateOne(
        { _id: productId },
        {
          $set: {
            name,
            description,
            price,
            category,
            images,
          },
        }
      ).then(()=>{
        res.status(200).send({
          success:true,
          message:"Product edited"
        })
      }).catch((err)=>{
        res.status(404).send({
          success:false,
          message:"Somthing went wrong"
        })
      })
    } catch (error) {
      res.status(500).send({
        success:false,
        message:"server error"
      })
    }
  },
};
