//imports packages
import mongoose from "mongoose";
import validator from "validator";

import { genPass } from "../config/bcript.js";
import { auth } from "../middlewares/auth.js";
const { password, compairePass } = genPass;
const { genrateToken } = auth;
const { Schema, ObjectId } = mongoose;

const EmployeeSchema = new Schema(
  {
    Name: {
      type: String,
      required: [true, "Name is Require"],
    },
    Email: {
      type: String,
      required: [true, "Email is Require"],
      unique: true,
      validator: validator.isEmail,
    },
    Mobile: {
      type: String,
    },
    Password: {
      type: String,
      required: [true, "Password is required"],
    },
    Image: {
      type: String,
    },
    id_Proof: {
      type: String,
      required: true,
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
    address: {
      street: {type:String},
      city: {type:String},
      state: {type:String},
      postalCode: {type:String},
      },
    ernings:{
      type:Number,
      default:0
    },
    Is_blocked: {
      type: Boolean,
      default: false,
    },
    Is_verify: {
      type: Boolean,
      default: false,
    },
    is_engaged:{
      type: Boolean,
      default: false,
    },
    rating:{
      type:Number
    },
  },
  { timestamps: true }
);
//cnvrtPass
EmployeeSchema.pre("save", async function () {
  const newPassword = await password(this.Password);
  this.Password = newPassword;
});
//compare password
EmployeeSchema.methods.comparePassword = async function (password) {
  const isMatch = await compairePass(password, this.Password);
  return isMatch;
};
//jwtToken
EmployeeSchema.methods.creatJwt = async function () {
  const token = await genrateToken(this._id);
  return token;
};
const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
