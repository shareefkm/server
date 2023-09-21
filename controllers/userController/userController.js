//imports files
import Users from "../../models/user.js";
import { genPass } from "../../config/bcript.js";

const { password } = genPass

export const user = {
  //user registration
  userRegister: async (req, res) => {
    try {
      const { Name, Email, Mobile, Password } = req.body;
      const existingUser = await Users.findOne({ Email });
      if (existingUser) {
        return res.status(200).send({
          success: false,
          message: "Email Already Exist Please Login",
        });
      } else {
        const user = await Users.create({ Name, Email, Mobile, Password });
        const token = await user.creatJwt();
        res.status(201).send({
          success: true,
          message: "Registration Success",
          user: {
            Name: user.Name,
            Email: user.Email,
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
  userLogin: async (req, res) => {
    try {
      const { Email, Password } = req.body;
      const user = await Users.findOne({ Email }).select("+Password");
      if (user) {
        const isMatch = await user.comparePassword(Password);
        if (isMatch) {
          if (user.Is_blocked) {
            res.status(403).send({
              success: false,
              message: "Youre account is blocked",
            });
          } else {
            user.Password = undefined;
            const token = await user.creatJwt();
            res.status(200).send({
              success: true,
              message: "Login Success",
              user,
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
  getUserDetail: async (req, res) => {
    try {
      const user = await Users.findById(req.query.id);
      if (user) {
        res.status(200).send({
          success: true,
          user,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "User data Not found",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },
  addAddress: async (req, res) => {
    try {
      const id = req.body.id;
      const userAddress = await Users.findOne({ _id: id });
      if (userAddress.Address.length < 3) {
        await Users.updateOne(
          { _id: id },
          {
            $push: {
              Address: req.body.address,
            },
          }
        )
          .then(() => {
            res.status(201).send({
              success: true,
              message: "Address added success",
            });
          })
          .catch(() => {
            res.status(200).send({
              success: false,
              message: "something went wrong",
            });
          });
      } else {
        res.status(404).send({
          success: false,
          message: "Max Address Limit is 3",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },
  editAddress: async (req, res) => {
    const { id, address, index } = req.body;
    try {
      await Users.updateOne(
        { _id: id },
        {
          $set: {
            [`Address.${index}`]: address,
          },
        }
      ).then((resp) => {
        res.status(200).send({
          success: true,
          message: "address edited success",
          resp,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Internal server error ",
        error,
      });
    }
  },
  profileImage: async (req, res) => {
    const { id, image } = req.body;
    try {
      await Users.updateOne({ _id: id }, { $set: { Image: image } })
        .then(() => {
          res.status(200).send({
            success: true,
            message: "Image Added success",
          });
        })
        .catch((err) => {
          res.status(404).send({
            success: false,
            message: "something went wrong",
          });
        });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },
  deletAddress: async (req, res) => {
    try {
      const { id, index } = req.body;
      const updateResult = await Users.updateOne(
        { _id: id },
        {
          $unset: {
            [`Address.${index}`]: 1,
          },
        }
      );
      if (updateResult.modifiedCount === 1) {
        await Users.updateOne(
          { _id: id },
          {
            $pull: {
              Address: null,
            },
          }
        );
        res.status(200).send({
          success: true,
          message: "Address removed",
        });
      } else {
        console.log(err);
        res.status(404).send({
          success: false,
          message: "something went wrong",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Internal server error ",
      });
    }
  },
  
  editProfile: async (req, res) => {
    try {
      const {id, name, email, mobile} = req.body
      await Users.updateOne({_id:id},{
        $set:{
          Name:name,
          Email:email,
          Mobile:mobile
        }
      }).then(()=>{
        res.status(200).send({
          success:true,
          message:"Profile Updated success"
        })
      }).catch(()=>{
        res.status(404).send({
          success:false,
          message:"Something went wrong"
        })
      })
     
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Server error",
      });
    }
  },

  editPassword: async(req,res)=>{
    try {
      const {oldPassword,newPassword, _id} = req.body
      const user = await Users.findOne({_id})
      const isMatch = await user.comparePassword(oldPassword)
      if(isMatch){
        const newPass = await password(newPassword)
          await Users.updateOne({_id},{$set:{
            Password:newPass
          }}).then(()=>{
            res.status(200).send({
              success:true,
              message:"Password changed success"
            })
          }).catch((err)=>{
            res.status(404).send({
              success:false,
              message:"Something went wrong"
            })
          })
      }else{
        res.status(404).send({
          success:false,
          message:"password is not match"
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
