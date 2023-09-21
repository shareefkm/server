import mongoose from "mongoose";

import { genPass } from "../config/bcript.js";
import { auth } from "../middlewares/auth.js";
const {compairePass, password} = genPass
const {genrateToken} = auth
const { Schema, ObjectId } = mongoose;

const AdminSchema = new Schema({
    Email:{
        type:String
    },
    Password:{
        type:String
    }
})

//cnvrtPass
AdminSchema.pre("save", async function () {
    const newPassword = await password(this.Password);
    this.Password = newPassword;
  });
  //compare password
  AdminSchema.methods.comparePassword = async function (password) {
    const isMatch = await compairePass(password, this.Password);
    return isMatch;
  };
  //jwtToken
  AdminSchema.methods.creatJwt = async function () {
    const token = await genrateToken(this._id);
    return token;
  };
  const Admin = mongoose.model("Admin", AdminSchema);
  
  export default Admin;