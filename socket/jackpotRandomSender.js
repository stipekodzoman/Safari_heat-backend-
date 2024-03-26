import {INITIAL_JACKPOT} from "../constants/settings.js";
import SystemBalance from "../models/System_balance.js"
export default async function jackpotRandomSenderRun(io) {
    try{
        setInterval(async()=>{
            const randomValue = parseFloat((Math.random() * (0.07 - 0.01) + 0.01).toFixed(2));
            const system_balance=await SystemBalance.findOne()
            system_balance.jackpot+=randomValue
            system_balance.save()
            io.emit("jackpot",JSON.stringify({jackpot:(INITIAL_JACKPOT+system_balance.jackpot)}))
        },1000)
        
        
    }   catch(error){
        console.log(error)
    }
    
}