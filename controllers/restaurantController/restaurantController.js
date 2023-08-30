//imports files
import Restarant from "../../models/restaurant.js";
export const restaurant = {
  //restaurant registration
  restaurantRegister: async (req, res) => {
    try {
      const { Name, Email, Mobile, Password,Place } = req.body;
      const existingRest = await Restarant.findOne({ $or:[{Email},{Name}]});
      if (existingRest) {
        return res
          .status(200)
          .send({
            success: false,
            message: "Email Already Exist Please Login",
          });
      } else {
        const restaurant = await Restarant.create({ Name, Email, Mobile, Password, Place });
        const token = await restaurant.creatJwt();
        res.status(201).send({
          success: true,
          message: "Registration Success",
          restaurant: {
            Name: restaurant.Name,
            Email: restaurant.Email,
          },
          token,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error Registration",
        error,
      });
    }
  },
  //userLogin
  restaurantLogin: async (req, res) => {
    try {
      const { Email, Password } = req.body;
      const restaurant = await Restarant.findOne({ Email }).select("+Password");
      if (restaurant) {
        const isMatch = await restaurant.comparePassword(Password);
        if (isMatch) {
          if(restaurant.Is_blocked){
            console.log("blocked");
            res.status(200).send({
              success: false,
              message: "Youre account is blocked",
            });
          }else{
            restaurant.Password = undefined
            const token = await restaurant.creatJwt();
            res.status(201).send({
              success: true,
              message: "Login Success",
              restaurant,
              token,
            });
          }
        } else {
          res.status(200).send({
            success: false,
            message: "Invalid Password",
          });
        }
      } else {
        res.status(200).send({
          success: false,
          message: "Invalid Email",
        });
      }
    } catch (error) {
        console.log(error);
        res.status(400).send({
        success: false,
        message: "Error Login",
        error,
      });
    }
  },
  
};
