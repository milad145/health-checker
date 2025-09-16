import {createClient} from 'redis';

export default class RedisService {
    constructor({redis}) {
        const {host, port, password} = redis;
        let config = {
            socket: {
                host, port
            }
        }
        if (password)
            config.password = password;

        this.config = config
        this.redisClient = null;
    }

    async init() {
        try {
            return await this.#connect()
        } catch (err) {
            console.error("Failed to initialize Redis:", err);
            throw err;
        }
    }

    async #connect() {
        try {
            this.redisClient = createClient(this.config);

            this.redisClient.on('connect', () => {
                console.log('Connected to Redis server');
            });

            this.redisClient.on('error', (err) => {
                throw new Error(err);
            });

            await this.redisClient.connect();
        } catch (err) {
            throw err;
        }
    }


    /**
     * save a message in Redis
     * @param key {string}
     * @param value {object}
     * @param expireTimeInSecond {number}
     * @returns {Promise<boolean>}
     */
    async saveMessage(key, value, expireTimeInSecond = 60) {
        try {
            if (typeof value !== "object")
                throw new Error("value have to be object!")
            value = JSON.stringify(value);

            await this.redisClient.set(key, value, {EX: expireTimeInSecond});
        } catch (err) {
            console.error(`Error saving message in Redis "${key}":`, err);
            throw err;
        }
    }

    /**
     * Get message from Redis
     * @param key {string}
     */
    async getMessage(key) {
        try {
            let value = await this.redisClient.get(key);
            if (value)
                return JSON.parse(value);
            else
                return undefined
        } catch (err) {
            console.error(`Error getting messages from Redis "${key}":`, err);
            throw err;
        }
    }

}
