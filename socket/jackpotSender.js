import {INITIAL_JACKPOT} from "../constants/settings.js";
import SystemBalance from "../models/System_balance.js"
export default async function jackpotSenderRun(io) {
    try{
        const system_balance=await SystemBalance.findOne()
        io.emit("jackpot",JSON.stringify({jackpot:(INITIAL_JACKPOT+system_balance.jackpot)}),
        )
    }   catch(error){
        console.log(error)
    }
    
}