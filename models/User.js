import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true,
      
    },
    firstname: {
      type: String,
      required:true,
      default:"test"
      
    },
    lastname: {
      type: String,
      required:true,
      default:"test"
    },
    phonenumber:{
      type:String,
      default:"test",
    },
    email:{
      type:String,
      required:true,
      default:"test"
    },
    password: {
      type: String,
      required: true,
      default:"Aa1234"
    },
    role:{
      type:Number,
      required:true,
      default:0,
      integer:true
    },
    country:{
      type:String,
      required:true,
      default:"test"
    },
    balance:{
      type:String,
      required:true,
      default:0.00
    }
  },{ timestamps: true }
);


export default mongoose.model("User", userSchema);
