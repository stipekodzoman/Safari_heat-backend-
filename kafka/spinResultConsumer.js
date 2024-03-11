import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import SystemBalanceLog from "../models/System_balance_log.js"
import UserHistory from "../models/User_history.js"
import updateProducerRun from "./updateProducer.js";
import createTopic from "./createTopic.js";
export default async function spinResultConsumerRun(kafka, username) {
    await createTopic("spinresult_"+username,1,1)
    const spinResultConsumer = kafka.consumer({ groupId: username });
    await spinResultConsumer.subscribe({ topic: "spinresult_"+username, fromBeginning: false });
    console.log("-------------->Spinresult_"+username+" consumer is listening...")
    await spinResultConsumer.run({
        eachMessage: async ({ topic,message }) => {
            const { lines, bet, spin_type, pay_lines, winning } = JSON.parse(message.value.toString());
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
            })
            await systemBalanceLog.save()
            await updateProducerRun(kafka, balance,username)
            const user_history = new UserHistory({
                username:username,
                lines:lines,
                bet:bet,
                spin_type:spin_type,
                pay_lines:pay_lines,
                winning:winning
            })
            await user_history.save()
        },
    });
}