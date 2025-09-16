import amqp from "amqplib";

export default class RabbitMQService {
    constructor({rabbitMQUrl}) {
        this.url = rabbitMQUrl;
        this.connection = null;
        this.channel = null;
        this.reconnecting = false;
    }

    async init() {
        try {
            await this.#connect()
            await this.#createChannel();
        } catch (err) {
            console.error("Failed to initialize RabbitMQ:", err);
            this.#scheduleReconnect();
        }
    }

    async #connect() {
        try {
            this.connection = await amqp.connect(this.url);
            console.log("✅ RabbitMQ connected successfully.");
            this.connection.on("error", (err) => {
                console.error("RabbitMQ connection error:", err);
                this.connection = null;
                this.#scheduleReconnect();
            });
            this.connection.on("close", () => {
                console.warn("RabbitMQ connection closed.");
                this.connection = null;
                this.#scheduleReconnect();
            });
        } catch (err) {
            console.error("Failed to connect to RabbitMQ:", err);
            throw err;
        }
    }

    async #createChannel() {
        try {
            if (!this.connection)
                await this.#connect();

            this.channel = await this.connection.createChannel();
            this.channel.on("error", (err) => {
                console.error("RabbitMQ channel error:", err);
                this.channel = null;
                this.#scheduleReconnect();
            });
            this.channel.on("close", () => {
                console.warn("RabbitMQ channel closed.");
                this.channel = null;
                this.#scheduleReconnect();
            });
        } catch (err) {
            console.error("Failed to create channel in RabbitMQ:", err);
            throw err;
        }
    }

    #scheduleReconnect() {
        if (this.reconnecting) return;
        this.reconnecting = true;
        console.warn("Scheduling RabbitMQ reconnection in 15 minutes...");
        setTimeout(async () => {
            try {
                await this.#connect();
                await this.#createChannel();
                this.reconnecting = false;
                console.info("RabbitMQ reconnected successfully.");
            } catch (err) {
                console.error("Reconnection attempt failed:", err);
                this.reconnecting = false;
                this.#scheduleReconnect(); // Retry again
            }
        }, 15 * 60 * 1000);
    }

    async #assertQueue(queueName) {
        if (!this.channel) {
            console.warn("Channel not available, attempting to reconnect...");
            await this.#createChannel();
        }
        return this.channel.assertQueue(queueName, {
            durable: true
        });
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
            this.channel.sendToQueue(queueName, Buffer.from(message));
            console.log(`Message sent to queue: ${queueName}`);
            return true;
        } catch (err) {
            console.error(`Error sending message to queue "${queueName}":`, err);
            this.#scheduleReconnect();
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
            this.channel.consume(queueName, (msg) => {
                if (msg !== null) {
                    try {
                        const content = msg.content.toString();
                        const message = JSON.parse(content);
                        onMessage(message);
                        this.channel.ack(msg);
                    } catch (err) {
                        console.error("Failed to process message:", err);
                        this.channel.nack(msg, false, false);
                    }
                }
            });
        } catch (err) {
            console.error(`Error consuming messages from queue "${queueName}":`, err);
            this.#scheduleReconnect();
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
