import { Partitioners } from "kafkajs";
import generate_major from "../RNG/major_rng.js"
import generate_minor from "../RNG/minor_rng.js"
import createTopic from "./createTopic.js";
export default async function majorAndMinorProducerRun(kafka) {
    const majorAndMinorProducer =kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    await majorAndMinorProducer.connect()
    const major=await generate_major()
    const minor=await generate_minor()
    await majorAndMinorProducer.send({
        topic:"major_minor",
        messages:[{value:JSON.stringify({major:major,minor:minor})}],
    })
    await majorAndMinorProducer.disconnect() 
}