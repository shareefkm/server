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
      res.status(500).send({
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
      res.status(500).send({
        success:false,
        message:"Server error"
      })
    }
  },
  editProfile: async (req,res)=>{
    try {
      const {editData, address, image, restId} = req.body
      const existRest = await Restarant.findOne()
      if(existRest.Email === editData.Email || existRest.Mobile === editData.Mobile){
        res.status(404).send({
          success:false,
          message:"Email or Phone Number all ready exist"
        })
      }else{
      await Restarant.updateOne({_id:restId},{
        $set:{
          Address:address,
          Name:editData.Name,
          Mobile:editData.Mobile,
          Email:editData.Email,
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
    }
    } catch (error) {
      res.status(500).send({
        success:false,
        message:"server error"
      })
    }
  },
  
};
