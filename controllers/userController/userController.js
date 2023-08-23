//imports files
import Users from "../../models/user.js"

export const user = {
    //user registration
    userRegister:async (req,res)=>{
        try {
            const {Name,Email,Mobile,Password} = req.body
            const existingUser = await Users.findOne({Email})
            if(existingUser){
                return res.status(200).send({success:false,message:"Email Already Exist Please Login"})
            }else{
                const user = await Users.create({Name,Email,Mobile,Password})
                const token = await user.creatJwt()
                res.status(201).send({
                    success:true,
                    message:"Registration Success",
                    user:{
                        Name:user.Name,
                        Email:user.Email
                    },
                    token,
                })
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
                success:false,
                message:"Error Registration",
                error,
            })
        }
    }
}