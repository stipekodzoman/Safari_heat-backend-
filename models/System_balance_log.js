import mongoose from "mongoose";
const systemBalanceLogSchema=new mongoose.Schema({
    system_balance:{
        type:Number,
        required:true,
    },
    jackpot:{
        type:Number,
        required:true
    }
    
},{timestamps:true});
export default mongoose.model('System_balance_log',systemBalanceLogSchema);