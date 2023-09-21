import Admin from '../../models/admin.js'

import { auth } from '../../middlewares/auth.js'

export const admin = {
    adminLogin: async (req,res)=> {
        try {
            const {Email, Password} = req.body
            const admin = await Admin.findOne({Email})
            if(admin){
                const isMatch = await admin.comparePassword(Password);
                if(isMatch){
                    admin.Password = undefined
                    const token = await admin.creatJwt();
                    res.status(200).send({
                    success: true,
                    message: "Login Success",
                    admin,
                    token,
                  });
                }else{
                    res.status(403).send({
                        success: false,
                        message: "Invalid Password",
                      });
                }
            }else{
                res.status(403).send({
                    success: false,
                    message: "Invalid Admin",
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
    // create:async(req,res)=>{
    //    try {
    //     const {Email,Password} = req.body
    //     const admin = await Admin.create({Email,Password})
    //     res.status(201).send({
    //         success:true,
    //         message:"success"
    //     })
    //    } catch (error) {
    //      console.log(error);
    //    }
    // },
    
}