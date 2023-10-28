//imports packages
import mongoose from "mongoose";
import validator from "validator";

import { genPass } from "../config/bcript.js";
import { auth } from "../middlewares/auth.js";
const {password, compairePass} = genPass
const {genrateToken} = auth
const { Schema, ObjectId } = mongoose;

const UsersSchema = new Schema({
  Name: {
    type: String,
    required:[true,"Name is Require"]
  },
  Email: { 
      type: String,
      required:[true, "Email is Require"],
      unique:true,
      validator:validator.isEmail,
    },
  Mobile: {
       type: String,
    },
  Password: { 
    type: String,
    required:[true, "Password is required"] 
    },
  Image: { 
    type: String
    },
    Place:{
      type:String
    },
    longitude:{
      type:Number
    },
     latitude:{
      type:Number
    },
  Address: [{
    street: {type:String},
    city: {type:String},
    state: {type:String},
    postalCode: {type:String},
    }],
  Is_blocked: { 
    type: Boolean,
    default:false 
    },
  is_verified: {
      type: Boolean,
      default: false,
    },
  Wallet:{
    type:Number,
    default:0
    },
},{timestamps:true}
);
//cnvrtPass
UsersSchema.pre('save',async function(){
    const newPassword = await password(this.Password)
    this.Password = newPassword
} )
//compare password
UsersSchema.methods.comparePassword = async function(password){
  const isMatch = await compairePass(password,this.Password)
  return isMatch;
}
//jwtToken
UsersSchema.methods.creatJwt = async function(){
    const token = await genrateToken(this._id)
    return token
}
const Users = mongoose.model("Users", UsersSchema);

export default Users;
