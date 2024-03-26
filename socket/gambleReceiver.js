import User from "../models/User.js"
import SystemBalance from "../models/System_balance.js"
import updateSenderRun from "./updateSender.js";

export default function gambleReceiverRun(socket, username) {
    socket.on("gamble",async (message) => {
            try{
                const {gamble}=JSON.parse(message)
                const user=await User.findOne({username:username})
                let balance=user.balance
                balance+=parseFloat(gamble)
                user.balance=balance
                await user.save()
                // await updateSenderRun(socket, balance)
            }catch(error){
                console.log("Error occured while processing message")
                console.log(error)
            }
            
        },
    );
}