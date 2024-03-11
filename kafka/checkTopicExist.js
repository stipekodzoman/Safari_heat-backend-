import { Kafka } from "kafkajs";
const kafka = new Kafka({
    brokers: ['localhost:9092'], // Replace with your Kafka broker(s) configuration
    clientId: 'admin' // Provide a unique client ID
});

const admin = kafka.admin();
const checkTopicExists=async(topicName)=> {
    const topicMetadata = await admin.fetchTopicMetadata({ topics: [topicName] });
    const topicExists = topicMetadata.topics.length > 0;
    return topicExists;
}

export default checkTopicExists