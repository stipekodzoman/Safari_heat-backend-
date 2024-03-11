import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import SystemBalanceLog from "../models/System_balance_log.js"
import jackpotProducerRun from "./jackpotProducer.js";
import updateProducerRun from "./updateProducer.js";
import createTopic from "./createTopic.js";
export default async function jackpotSuccessConsumerRun(kafka) {
    await createTopic("jackpotsuccess",5,1)
    const jackpotSuccessConsumer = kafka.consumer({ groupId: "admin" });
    await jackpotSuccessConsumer.subscribe({ topic: "jackpotsuccess", fromBeginning: false });
    console.log("Connecting to kafka...")
    await jackpotSuccessConsumer.run({
        eachMessage: async ({ topic,message }) => {
            const { jackpot, win_username } = JSON.parse(message.value.toString());
            const user=await User.findOne({username:win_username})
            const system_balance=await SystemBalance.findOne()
            let balance=user.balance
            balance+=jackpot
            user.balance=balance
            await user.save()
            system_balance.system_balance-=jackpot
            system_balance.jackpot=0.00
            await system_balance.save()
            const systemBalanceLog= new SystemBalanceLog({
                system_balance:system_balance.system_balance,
                jackpot:system_balance.jackpot
            })
            await systemBalanceLog.save()
            await updateProducerRun(kafka, balance)
            await jackpotProducerRun(kafka)
        },
    });
    console.log("Connected to kafka")
    console.log("Jackpot success consumer is listening...")
}