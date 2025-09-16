import mongoose from 'mongoose';

import config from './lib/config/index.js'

import {initLogs, initSecurityLog, APP_LOG} from './lib/modules/logs.js';

import SMSService from './lib/services/sms.js'
import RabbitMQService from './lib/services/rabbitMQ.js';
import RedisService from './lib/services/redis.js'

const smsService = new SMSService(config)
const rabbitMQService = new RabbitMQService(config)
const redisService = new RedisService(config)

initLogs(APP_LOG);
initSecurityLog();
// ===============================================
import initiateExpress from './lib/init.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.database);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await rabbitMQService.init();
        await redisService.init();
        const dependencies = {config, smsService, redisService, rabbitMQService}
        await initiateExpress(dependencies)
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

(() => connectDB())()
