import amqp from "amqplib";

export default class RabbitMQService {
    constructor(url) {
        this.url = url;
        this.connection = null;
        this.channel = null;
    }

    async init() {
        try {
            await this.#connect()
            await this.#createChannel();
            console.log('rabbit-mq connected!')
        } catch (err) {
            console.error("Failed to initialize RabbitMQ:", err);
            throw err;
        }
    }

    async #connect() {
        try {
            this.connection = await amqp.connect(this.url);
            this.connection.on("error", (err) => {
                console.error("RabbitMQ connection error:", err);
                this.connection = null;
            });
            this.connection.on("close", () => {
                console.warn("RabbitMQ connection closed.");
                this.connection = null;
            });
        } catch (err) {
            console.error("Failed to connect to RabbitMQ:", err);
            throw err;
        }
    }

    async #createChannel() {
        try {
            if (!this.connection)
                await this.#connect()

            this.channel = await this.connection.createChannel();
            this.channel.on("error", (err) => {
                console.error("RabbitMQ channel error:", err);
                this.channel = null;
            });
        } catch (err) {
            console.error("Failed to create channel in RabbitMQ:", err);
            throw err;
        }
    }

    async #assertQueue(queueName) {
        try {
            if (!this.channel)
                await this.#createChannel();

            await this.channel.assertQueue(queueName, {durable: true});
        } catch (err) {
            console.error(`Error asserting queue "${queueName}":`, err);
            throw err;
        }
    }

    /**
     * Send a message to a queue
     * @param queueName {string}
     * @param message {object | string}
     * @returns {Promise<boolean>}
     */
    async sendMessage(queueName, message) {
        try {
            if (typeof message !== "string") {
                message = JSON.stringify(message);
            }
            await this.#assertQueue(queueName);
            await this.channel.sendToQueue(queueName, Buffer.from(message));
            console.log(`message is sent to queue : ${queueName}`)
            return true;
        } catch (err) {
            console.error(`Error sending message to queue "${queueName}":`, err);
            throw err;
        }
    }

    /**
     * Consume messages from a queue
     * @param queueName {string}
     * @param onMessage {Function}
     */
    async consumeMessage(queueName, onMessage) {
        try {
            await this.#assertQueue(queueName);

            await this.channel.consume(queueName, (msg) => {
                if (msg !== null) {
                    try {
                        const content = msg.content.toString();
                        const message = JSON.parse(content);
                        onMessage(message);
                        console.log(`message is red from queue : ${queueName}`)
                        this.channel.ack(msg);
                    } catch (err) {
                        console.error("Failed to process message:", err);
                        this.channel.nack(msg, false, false);
                    }
                }
            });
        } catch (err) {
            console.error(`Error consuming messages from queue "${queueName}":`, err);
            throw err;
        }
    }

    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
        } catch (err) {
            console.error("Error closing RabbitMQ connection:", err);
        }
    }
}
