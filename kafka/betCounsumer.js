import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import SystemBalanceLog from "../models/System_balance_log.js"
import { JACKPOT_POOL_RATE_PER_SPIN } from "../constants/settings.js";
import jackpotProducerRun from "./jackpotProducer.js";
import updateProducerRun from "./updateProducer.js";
import createTopic from "./createTopic.js";
export default async function betConsumerRun(kafka, username) {
    await createTopic("bet_"+username, 1,1)
    const betConsumer = kafka.consumer({ groupId: username });
    await betConsumer.subscribe({ topic: "bet_"+username, fromBeginning: false });
    console.log("-------------->bet_"+username+" consumer is listening....")
    await betConsumer.run({
        
        eachMessage: async ({ topic,message }) => {
            console.log("bet------>",message.value.toString());
            const user=await User.findOne({username:username})
            const system_balance=await SystemBalance.findOne()
            let balance=user.balance
            balance-=message.value
            user.balance=balance
            await user.save()
            system_balance.system_balance+=message.value*(1-JACKPOT_POOL_RATE_PER_SPIN/100)
            system_balance.jackpot+=message.value*JACKPOT_POOL_RATE_PER_SPIN/100
            await system_balance.save()
            const systemBalanceLog= new SystemBalanceLog({
                system_balance:system_balance.system_balance,
                jackpot:system_balance.jackpot
            })
            await systemBalanceLog.save()
            await updateProducerRun(kafka, balance,username)
            await jackpotProducerRun(kafka)
        },
    });
}