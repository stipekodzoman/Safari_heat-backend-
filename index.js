import express, { urlencoded }  from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import cookieParser from "cookie-parser";
import { Kafka, Partitioners} from "kafkajs";
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import profileRoute from './routes/profile.js';
import Settings from "./models/Settings.js";
import SystemBalance from "./models/System_balance.js";
import User from "./models/User.js";
import jackpotSuccessConsumerRun from "./kafka/jackpotSuccessConsumer.js";
import majorAndMinorProducerRun from "./kafka/majorAndMinorProducer.js";
import createTopic from "./kafka/createTopic.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
   origin: true,
   credentials: true,
};
mongoose.set("strictQuery", false);
const connect = async() => {
   try {
      await mongoose.disconnect();
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log('mongodb connected!');
      return "Successfully connected";
   } catch (error) {
      console.log('error: ', error);
      return "That atlas database couldn't fine.Please retype all initailize fields";
   }
}
const createSettings=async()=>{
   try{
      let settings=await Settings.findOne();
      if(!settings){
         const settingsData=new Settings();
         await settingsData.save();
      }
      console.log("created settings");
   }catch(err){
      console.log(err);
   }
   
}
const createAdmin=async()=>{
   try{
      let admin=await User.findOne({role:1});
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync("qwe123!@#", salt);
      if(!admin){
         const adminData=new User({
            username: 'admin',
            firstname:"stipe",
            lastname:"kodzoman",
            phonenumber:"+385994643517",
            email:"99master.code@gmail.com",
            role:1,
            country:"Croatia",
            balance:0.00,
            password:hash
         });
         await adminData.save();
      }
      console.log("created admin");
   }catch(err){
      console.log(err);
   }
   
}
const createSystemBalance=async()=>{
   try{
      let system_balance=await SystemBalance.findOne();
      if(!system_balance){
         const systemBalanceData=new SystemBalance({system_balance:100000});
         await systemBalanceData.save();
      }
      console.log("created system balance");
   }catch(err){
      console.log(err);
   }
   
}
app.use(express.json());
app.use(express.urlencoded());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static('assets'));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile",profileRoute);

const kafka = new Kafka({
   clientId: "safariheat",
   brokers: ['localhost:9092'], // Replace with your Kafka broker(s) configuration
});

app.listen(port, async () => {
   await connect();
   await createAdmin();
   await createSettings();
   await createSystemBalance();
   await jackpotSuccessConsumerRun(kafka)
   await createTopic("major_minor",10,1)
   setInterval(() =>majorAndMinorProducerRun(kafka), 1000);
   console.log('server listening on port', port);
})