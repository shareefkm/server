//imports files
import Employee from "../../models/employee.js";
import { genPass } from "../../config/bcript.js";

const { password } = genPass

export const employee = {
  //Employee Registration
  employeeRegister: async (req, res) => {
    try {
      const { Name, Email, Mobile, Password, address, id_Proof } = req.body;
      const existEmployee = await Employee.findOne({ Email });
      if (existEmployee) {
        return res.status(200).send({
          success: false,
          message: "Email Already Exist Please Login",
        });
      }else{
        const employee = await Employee.create({Name, Email, Mobile, Password, address, id_Proof})
        if(employee){
          sendVerifyMail(Name, Email, employee._id);
          const token = await employee.creatJwt();
          res.status(201).send({
              success: true,
              message: "Registration Success",
              employee: {
                Name: employee.Name,
                Email: employee.Email,
              },
              token
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
      const updateVerifyStatus = await Employee.updateOne(
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
          message: "User not found or already verified",
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

  employeeLogin: async (req,res)=>{
    try {
        const {Email,Password} = req.body
        const employee = await Employee.findOne({Email})
        if(employee){
            const isMatch = await employee.comparePassword(Password)
            if (isMatch) {
                if(!employee.Is_verify){
                  console.log("not vrifyed");
                  res.status(401).send({
                    success: false,
                    message: "Youre account is not verifyed",
                  });
                }else if(employee.Is_blocked){
                    console.log("blocked");
                    res.status(401).send({
                      success: false,
                      message: "Youre account is blocked",
                    });
                }
                else{
                  employee.Password = undefined
                  const token = await employee.creatJwt();
                  res.status(200).send({
                    success: true,
                    message: "Login Success",
                    employee,
                    token,
                  });
                }
              } else {
                res.status(403).send({
                  success: false,
                  message: "Invalid Password",
                });
              }
        }else {
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
  getEmplProfile: async(req,res)=>{
    try {
      const _id = req.params.id
      const profile = await Employee.findOne({_id})
      if(profile){
        res.status(200).send({
          success:true,
          profile
        })
      }else{
        res.status(404).send({
          success:false,
          message:"Data not found"
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Server Error"
      })
    }
  },
  editEmplName: async(req,res)=>{
    try {
      const{ id, name} = req.body
      await Employee.updateOne({_id:id},{$set:{
        Name:name
      }})
      res.status(200).send({
        success:true,
        message:"Your Profile Name is changed success"
      })
    } catch (error) {
      res.status(500).send({
        success:false,
        message:"Server Error"
      })
    }
  },

  //send forgetpassword link

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const employee = await Employee.findOne({ Email: email });
      if (employee) {
        sendForgetPassword(user.Name, email, employee._id);
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
      await Employee.updateOne(
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

  editPassword: async(req,res)=>{
    try {
      const {oldPassword,newPassword, _id} = req.body
      const employee = await Employee.findOne({_id})
      const isMatch = await employee.comparePassword(oldPassword)
      if(isMatch){
        const newPass = await password(newPassword)
          await Employee.updateOne({_id},{$set:{
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
