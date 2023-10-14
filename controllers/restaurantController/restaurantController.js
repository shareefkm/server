//imports files
import Restarant from "../../models/restaurant.js";
import { genPass } from "../../config/bcript.js";
import { configEmail } from "../../config/emailConfig.js";

const { password } = genPass;
const { sendVerifyMail, sendForgetPassword} = configEmail;
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
        if(restaurant){
          sendVerifyMail(Name, Email, restaurant._id);
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
        }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error Registration",
        error,
      });
    }
  },

  //account verification thrue the email
  verifyMail: async (req, res) => {
    try {
      const { id } = req.params;
      const updateVerifyStatus = await Restarant.updateOne(
        { _id: id },
        { $set: { is_verified: true } }
      );
      if (updateVerifyStatus.modifiedCount === 1) {
        res.status(200).send({
          success: true,
          message: "Your email is verified",
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Restaurant not found or already verified",
        });
      }
    } catch (error) {
      console.error("Error verifying email:", error.message);
      res.status(500).send({
        success: false,
        message: "Error verifying email",
      });
    }
  },
  //restaurant Login
  restaurantLogin: async (req, res) => {
    try {
      const { Email, Password } = req.body;
      const restaurant = await Restarant.findOne({ Email }).select("+Password");
      if (restaurant) {
        const isMatch = await restaurant.comparePassword(Password);
        if (isMatch) {
          if(!restaurant.Is_verify){
            console.log("not vrifyed");
            res.status(401).send({
              success: false,
              message: "Youre account is not verifyed",
            });
          }else if(restaurant.Is_blocked){
              res.status(401).send({
                success: false,
                message: "Youre account is blocked",
              });
          }
          else{
            restaurant.Password = undefined
            const token = await restaurant.creatJwt();
            res.status(200).send({
              success: true,
              message: "Login Success",
              restaurant,
              token,
            });
          }
        } else {
          res.status(403).send({
            success: false,
            message: "Invalid Password",
          });
        }
      } else {
        res.status(403).send({
          success: false,
          message: "Invalid Email",
        });
      }
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error Login",
        error,
      });
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const restaurant = await Restarant.findOne({ Email: email });
      if (restaurant) {
        sendForgetPassword(restaurant.Name, email, restaurant._id);
        res.status(200).send({
          success: true,
          message: "Check your email",
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Invalid Email",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server Error",
      });
    }
  },
  //reset forget password
  restPassword: async (req, res) => {
    try {
      const { _id, newPassword } = req.body;
      const newPass = await password(newPassword);
      await Restarant.updateOne(
        { _id },
        {
          $set: {
            Password: newPass,
          },
        }
      )
      res.status(200).send({
        success:true,
        message:"New password created"
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server error",
      });
    }
  },
  getResProfile: async(req,res)=>{
    try {
      const restId = req.query.id
      const restData = await Restarant.findOne({_id:restId})
      if(restData){
        res.status(200).send({
          success:true,
          restData,
        })
      }else{
        res.status(404).send({
          success:false,
          message:"Restaurant data Not found"
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Server error"
      })
    }
  },
  editProfile: async (req,res)=>{
    try {
      const {editData, address, image, restId} = req.body
      await Restarant.updateOne({_id:restId},{
        $set:{
          Address:address,
          Name:editData.Name,
          Mobile:editData.Mobile,
          Image:image
        }
      }).then(()=>{
        res.status(200).send({
          success:true,
          message:"Profile edited success"
        })
      }).catch((err)=>{
        res.status(404).send({
          success:false,
          message:"Error editing"
        })
      })
    // }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"server error"
      })
    }
  },
  
};
