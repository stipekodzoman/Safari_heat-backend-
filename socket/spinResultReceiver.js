import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import SystemBalanceLog from "../models/System_balance_log.js"
import UserHistory from "../models/User_history.js"
import updateSenderRun from "./updateSender.js";
export default async function spinResultReceiverRun(socket, username) {
    socket.on("spinresult",async(message ) => {
            try{
                const { lines, bet, spin_type, pay_lines, winning } = JSON.parse(message.toString());
                const user=await User.findOne({username:username})
                const system_balance=await SystemBalance.findOne()
                let balance=user.balance
                balance+=winning
                user.balance=balance
                await user.save()
                system_balance.system_balance-=winning
                await system_balance.save()
                const systemBalanceLog= new SystemBalanceLog({
                    system_balance:system_balance.system_balance,
                    jackpot:system_balance.jackpot
                })
                await systemBalanceLog.save()
                await updateSenderRun(socket, balance,username)
                const user_history=await UserHistory.findOne({username:username})
                if (user_history){
                    user_history.histories.push({
                        lines:lines,
                        bet:bet,
                        spin_type:spin_type,
                        pay_lines:pay_lines,
                        winning:winning,
                    })
                    await user_history.save()
                } else{
                    const userhistory=new UserHistory({
                        username:username,
                        histories:[{
                            lines:lines,
                            bet:bet,
                            spin_type:spin_type,
                            pay_lines:pay_lines,
                            winning:winning
                        }]
                    })
                    await userhistory.save()
                }
                

                console.log("Spinresults was stored successfully")
            }catch(e){
                console.log(e)
            }
            
        },
    );
}