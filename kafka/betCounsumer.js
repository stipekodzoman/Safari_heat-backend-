import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import SystemBalanceLog from "../models/System_balance_log.js"
import { JACKPOT_POOL_RATE_PER_SPIN } from "../constants/settings.js";
import jackpotProducerRun from "./jackpotProducer.js";
import updateProducerRun from "./updateProducer.js";
import createTopic from "./createTopic.js";
export default async function betConsumerRun(kafka, username) {
    // await createTopic("bet_"+username, 1,1)
    const betConsumer = kafka.consumer({ groupId: "bet_"+username });
    await betConsumer.subscribe({ topic: "bet_"+username, fromBeginning: false });
    
    await betConsumer.run({
        eachMessage: async ({ topic,message }) => {
            console.log("bet------>",message.value.toString());
            try{
                const {bet}=JSON.parse(message.value.toString());
                console.log(bet)
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
                await updateProducerRun(kafka, balance,username)
                await jackpotProducerRun(kafka)
            }catch(error){
                console.log("Error occured while processing message")
                console.log(error)
            }
            
        },
    });
    console.log("-------------->bet_"+username+" consumer is listening....")
}