//imports packages
import mongoose from "mongoose";
import validator from "validator";

import { genPass } from "../config/bcript.js";
import { auth } from "../middlewares/auth.js";
const {password, compairePass} = genPass
const {genrateToken} = auth
const { Schema, ObjectId } = mongoose;

const RestarantSchema = new Schema({
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
  Address: {
    street: String,
    city: String,
    state: String,
    postalCode: String
    },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
    }],
  product:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      review: {
        type: String,
        maxlength: 500
      }
    },
    { timestamps: true }
  ],
  rating: [
    {
      userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
  },
  { timestamps: true }
  ],
  
  website:{
    type:String
  },
  Is_blocked: { 
    type: Boolean,
    default:false 
    },
  Is_verify:{
    type:Boolean,
    default:false
    },
  
},{timestamps:true}
);
//cnvrtPass
RestarantSchema.pre('save',async function(){
    const newPassword = await password(this.Password)
    this.Password = newPassword
} )
//compare password
RestarantSchema.methods.comparePassword = async function(password){
  const isMatch = await compairePass(password,this.Password)
  
  return isMatch;
}
//jwtToken
RestarantSchema.methods.creatJwt = async function(){
    const token = await genrateToken(this._id)
    return token
}
const Restarant = mongoose.model("Restarant", RestarantSchema);

export default Restarant;
