import betConsumerRun from "./betCounsumer.js";
import spinResultConsumerRun from "./spinResultConsumer.js";
import { Kafka } from "kafkajs";
const runKafka = async(username)=>{
    const kafka = new Kafka({
        clientId: username,
        brokers: ['localhost:9092'], 
    });
    await betConsumerRun(kafka,username)
    await spinResultConsumerRun(kafka,username)
}

export default runKafka
