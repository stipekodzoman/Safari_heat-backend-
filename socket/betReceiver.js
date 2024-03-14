import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import SystemBalanceLog from "../models/System_balance_log.js"
import { JACKPOT_POOL_RATE_PER_SPIN } from "../constants/settings.js";
import jackpotSenderRun from "./jackpotSender.js";
import updateSenderRun from "./updateSender.js";

export default function betReceiverRun(socket, username) {
    socket.on("bet",async (message) => {
            try{
                const {bet}=JSON.parse(message)
                const user=await User.findOne({username:username})
                const system_balance=await SystemBalance.findOne()
                let balance=user.balance
                balance-=bet
                user.balance=balance
                await user.save()
                system_balance.system_balance+=parseFloat((bet*(1-JACKPOT_POOL_RATE_PER_SPIN/100)).toFixed(2))
                system_balance.jackpot+=parseFloat((bet*JACKPOT_POOL_RATE_PER_SPIN/100).toFixed(6))
                await system_balance.save()
                const systemBalanceLog= new SystemBalanceLog({
                    system_balance:system_balance.system_balance,
                    jackpot:system_balance.jackpot
                })
                await systemBalanceLog.save()
                await updateSenderRun(socket, balance)
                await jackpotSenderRun(socket)
            }catch(error){
                console.log("Error occured while processing message")
                console.log(error)
            }
            
        },
    );
}