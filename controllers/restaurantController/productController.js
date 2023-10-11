import Product from "../../models/product.js";

export const products = {
  addProduct: async (req, res) => {
    try {
      const { name, description, category, images, restId, variants } =
        req.body;
      const product = await Product.create({
        name,
        description,
        category,
        images,
        variants,
        restaurant_id: restId,
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
  getRestaurantProduct: async (req, res) => {
    try {
      const restId = req.query.id;
      const product = await Product.find({
        isDeleted: false,
        restaurant_id: restId,
      });
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
  getProductData: async (req, res) => {
     try {
      const { id } = req.query;
      const foundProduct = await Product.findOne({ _id: id }).populate('category');
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
      const { name, description, category, images, variants, productId
      } = req.body;
      await Product.updateOne(
        { _id: productId },
        {
          $set: {
            name, description, category, images, variants
          },
        }
      )
        .then(() => {
          res.status(200).send({
            success: true,
            message: "Product edited",
          });
        })
        .catch((err) => {
          res.status(404).send({
            success: false,
            message: "Somthing went wrong",
          });
        });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },
  // searchProduct: async (req, res) => {
  //   try {
  //     const keyword = req.query.keyword;
  //     const allProducts = await Product.find().populate('restaurant_id').populate('category')
  //     const product = allProducts.find(product => {
  //       return (
  //         product.name.match(new RegExp(keyword, 'i')) ||
  //         product.variants.some(variant => variant.name.match(new RegExp(keyword, 'i'))) ||
  //         product.category.match(new RegExp(keyword, 'i')) ||
  //         product.restaurant_id === keyword
  //       );
  //     });
      
  //     const products = product ? [product] : [];
  //     res.send({allProducts})      
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({
  //       success: false,
  //       message: "Server Error"
  //     });
  //   }
  // }  
  searchProduct: async (req, res) => {
    try {
      const keyword = req.query.keyword;
  
      // Search products based on name, variants name, category, and restaurant_id
      const products = await Product.find({
        $or: [
          { name: { $regex: new RegExp(keyword, 'i') } },
          { 'category.name': { $regex: new RegExp(keyword, 'i') } },
          { 'restaurant_id.Name': { $regex: new RegExp(keyword, 'i') } }  // Assuming 'Name' is the field in the 'restaurant' subdocument
        ]
      })
      .populate('restaurant_id', 'Name')
      .populate('category', 'name');
  
      res.send({ products });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server Error"
      });
    }
  }
  
  
};
