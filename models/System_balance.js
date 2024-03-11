import mongoose from "mongoose"
import { INITIAL_JACKPOT } from "../constants/settings.js"
const systemBalanceSchema= new mongoose.Schema({
    system_balance:{
        type:Number,
        required:true,
        default:INITIAL_JACKPOT
    },
    jackpot:{
        type:Number,
        required:true,
        default:0.00
    }
})

export default mongoose.model("System_balance", systemBalanceSchema)