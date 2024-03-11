import { Partitioners } from "kafkajs";
import createTopic from "./createTopic.js";
export default async function updateProducerRun(kafka, balance,username) {
    try{
        //await createTopic("update_"+username,1,1)
        const updateProducer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
        await updateProducer.connect()
        console.log(username, "'s balance was updated")
        await updateProducer.send({
            topic:"update_"+username,
            messages:[{value:JSON.stringify({balance:balance})}]
        })
        await updateProducer.disconnect()
        
    }catch(e){
        console.log(e)
    }
    
}
