import { Partitioners } from "kafkajs";
import createTopic from "./createTopic.js";
export default async function updateProducerRun(kafka, balance,username) {
    await createTopic("update_"+username,1,1)
    const updateProducer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    await updateProducer.connect()
    await updateProducer.send({
        topic:"update_"+username,
        messages:[{value:balance}]
    })
    await updateProducer.disconnect()
}
