import fs from 'fs';
import http from 'http';
import https from 'https';
import path from "path";

import express from "express";

import routes from "../routes/index.js";

import config from '../config/index.js';
import {appDir} from "../modules/assist.js";

import RabbitMQService from '../services/rabbitMQ.js'
import {ConsumeQueue} from '../data/collector.js'

const rabbitMQService = new RabbitMQService(config.rabbitMQUrl)
export default async () => {
    try {
        await rabbitMQService.init();
        console.log('rabbit-mq connected!')
        start(rabbitMQService)
        const consumeQueue = new ConsumeQueue(rabbitMQService)
        consumeQueue.startConsume()
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}
const start = (rabbitMQService) => {
    const app = express();

    app.use(express.text());
    app.use(express.urlencoded({limit: "0.4mb", extended: true}));
    app.use(express.json({limit: "2.0mb", extended: true}));


    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        next();
    });

    routes(app, rabbitMQService);
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
        console.error("HTTPS server error:", err.message);
        process.exit(1);
    });
};
