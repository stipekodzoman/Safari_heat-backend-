import express, { urlencoded }  from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { Server } from "socket.io";
import {createServer} from 'http'
import cookieParser from "cookie-parser";
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import profileRoute from './routes/profile.js';
import Settings from "./models/Settings.js";
import SystemBalance from "./models/System_balance.js";
import User from "./models/User.js";
import betReceiverRun from "./socket/betReceiver.js";
import jackpotSuccessReceiverRun from "./socket/jackpotSuccessReceiver.js";
import majorAndMinorSenderRun from "./socket/majorAndMinorSender.js";
import spinResultReceiverRun from "./socket/spinResultReceiver.js";
import jackpotSenderRun from "./socket/jackpotSender.js";
import gambleReceiverRun from "./socket/gambleReceiver.js";
import jackpotRandomSenderRun from "./socket/jackpotRandomSender.js";
dotenv.config();
const app = express();
const httpServer=createServer(app)
const io=new Server(httpServer,{
   cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials:true,
      secure:true
    },
})
jackpotRandomSenderRun(io)
io.on('connection', async(socket) => {
   console.log('User connected');
   socket.on('username', async (username) => {
      console.log(`Received username: ${username}`);
      const user=await User.findOne({username:username})
      await socket.emit('balance',JSON.stringify({balance:user.balance}))
      betReceiverRun(io,socket,username)
      jackpotSuccessReceiverRun(io,socket)
      majorAndMinorSenderRun(socket)
      spinResultReceiverRun(socket,username)
      jackpotSenderRun(io)
      gambleReceiverRun(socket,username)
   });

   socket.on('disconnect', () => {
      console.log('User disconnected');
   });
});
const port = process.env.PORT || 8000;
// const corsOptions = {
//    origin: true,
//    credentials: true,
// };
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
app.use(cors({
   origin: '*',
   methods: ["GET", "POST"],
   credentials:true,
   secure:true
 }));
app.use(cookieParser());
app.use(express.static('assets'));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile",profileRoute);

httpServer.listen(port, async () => {
   await connect();
   await createAdmin();
   await createSettings();
   await createSystemBalance();

   console.log('server listening on port', port);
})