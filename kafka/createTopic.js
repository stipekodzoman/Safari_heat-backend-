import { Kafka } from "kafkajs";
import checkTopicExists from "./checkTopicExist.js";
const kafka = new Kafka({
    clientId: "root",
    brokers: ["localhost:9092"], // Replace with your Kafka broker(s) configuration
});
const admin = kafka.admin({ retry: { retries: 2 }});

const createTopic = async (topic, numPartitions, replicationFactor) => {
    await admin.connect();
    try{
        await admin.createTopics({
            topics: [
                {
                    topic: topic, // Replace with your desired topic name
                    numPartitions: numPartitions, // Number of partitions for the topic
                    replicationFactor: replicationFactor, // Replication factor for the topic
                },
            ],
            waitForLeaders: true
        });
        console.log("Topic created------>", topic)
    }catch(error){
        console.log("That topic is already exists")
    }
    
    
    await admin.disconnect();
};

export default createTopic;