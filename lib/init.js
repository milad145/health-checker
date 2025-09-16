import fs from 'fs';
import http from 'http';
import https from 'https';
import path from "path";

import express from "express";
import cookieParser from 'cookie-parser';

import routes from "./routes/index.js";

import {errorHandler} from "./middlewares/errorHandler.js";
import {appDir} from "./modules/assist.js";

import {ConsumeQueue} from './data/collector.js'
import mongoose from "mongoose";

export default async ({config, smsService, redisService, rabbitMQService}) => {
    try {
        start(config, smsService, rabbitMQService, redisService)

        const consumeQueue = new ConsumeQueue(rabbitMQService, redisService)
        consumeQueue.startConsume()
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}
const start = (config, smsService, rabbitMQService, redisService) => {
    const app = express();

    app.disable('x-powered-by');
    app.set('etag', false);

    app.use(cookieParser());

    app.use(express.text());
    app.use(express.urlencoded({limit: "0.4mb", extended: true}));
    app.use(express.json({limit: "2.0mb", extended: true}));

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        next();
    });

    routes(app, {smsService, rabbitMQService, redisService});
    app.use(errorHandler)
    // ===============================================
    const port = config["port"];
    const ssl = config["ssl"];

    let server = http.createServer({}, app);
    if (ssl) {
        server = https.createServer({
            key: fs.readFileSync(path.join(appDir, "lib", "data", "ssl", "privkey.pem")),
            cert: fs.readFileSync(path.join(appDir, "lib", "data", "ssl", "fullchain.pem"))
        }, app)
    }
    server.listen(port, function () {
        console.log("panel app listening on port " + port + "!");
    }).on('error', function (err) {
        rabbitMQService.close();
        console.error("HTTPS server error:", err.message);
        process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
        console.log("\n🛑 Shutting down gracefully...");
        await mongoose.connection.close();
        console.log("✅ MongoDB connection closed");
        process.exit(0);
    });
};
