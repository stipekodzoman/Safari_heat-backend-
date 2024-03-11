import betConsumerRun from "./betCounsumer.js";
import spinResultConsumerRun from "./spinResultConsumer.js";
import { Kafka } from "kafkajs";
const runKafka = async(username)=>{
    try{
        const kafka = new Kafka({
            clientId: "safariheat",
            brokers: ['localhost:9092'], 
        });
        await spinResultConsumerRun(kafka,username)
        await betConsumerRun(kafka,username)
        
    }catch(error){
        console.log(error)
    }
    
}

export default runKafka
