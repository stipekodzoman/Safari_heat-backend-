import { Partitioners } from "kafkajs";
import {INITIAL_JACKPOT} from "../constants/settings.js";
import SystemBalance from "../models/System_balance.js"
import createTopic from "./createTopic.js";
export default async function jackpotProducerRun(kafka) {
    await createTopic("jackpot",10,1)
    const jackpotProducer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    await jackpotProducer.connect()
    const system_balance=await SystemBalance.findOne()
    await jackpotProducer.send({
        topic:"jackpot",
        messages:[{value:INITIAL_JACKPOT+system_balance.jackpot}],
    })
    await jackpotProducer.disconnect() 
}