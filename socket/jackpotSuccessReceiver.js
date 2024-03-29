import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import SystemBalanceLog from "../models/System_balance_log.js"
import jackpotSenderRun from "./jackpotSender.js";
import updateSenderRun from "./updateSender.js";
export default async function jackpotSuccessReceiverRun(io,socket) {
    socket.on("jackpot_success",async( message ) => {
            try{
                const { jackpot, win_username } = JSON.parse(message.toString());
                console.log(win_username," won ",jackpot, " in this jackpot")
                const user=await User.findOne({username:win_username})
                const system_balance=await SystemBalance.findOne()
                let balance=user.balance
                balance+=parseFloat(jackpot)
                user.balance=balance
                await user.save()
                system_balance.system_balance-=parseFloat(jackpot)
                system_balance.jackpot-=parseFloat(jackpot)
                await system_balance.save()
                const systemBalanceLog= new SystemBalanceLog({
                    system_balance:system_balance.system_balance,
                    jackpot:system_balance.jackpot
                })
                await systemBalanceLog.save()
                // await updateSenderRun(socket, balance)
                await jackpotSenderRun(io)
            }catch(error){
                console.log(error)
            }
            
        },
    );
}