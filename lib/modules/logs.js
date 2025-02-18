/* logs.js */

import fs from 'fs';
import os from 'os';
import path from 'path';
import util from 'util';


export const APP_LOG = path.join("logs", "app.log");
export const SECURITY_LOG = path.join("logs", "security.log");
export const WORKER_LOG = path.join("logs", "worker.log");
let mainLogFile = null;
let securityLogFile = null;


export const initLogs = (logPath) => {
    const {debug, error, info, log, warn} = console;


    console.debug = (data, ...args) => {
        data = format(data);
        if (debug) debug.apply(this, ["[DEBUG] " + data, ...args]);
        logger(mainLogFile, "[DEBUG] ", data, args);
    };

    console.error = (data, ...args) => {
        data = format(data);
        if (error) error.apply(this, ["[ERROR] " + data, ...args]);
        logger(mainLogFile, "[ERROR] ", data, args);
    };

    console.info = (data, ...args) => {
        data = format(data);
        if (info) info.apply(this, ["[INFO] " + data, ...args]);
        logger(mainLogFile, "[INFO] ", data, args);
    };

    console.log = (data, ...args) => {
        data = format(data);
        if (log) log.apply(this, [data, ...args]);
        logger(mainLogFile, "", data, args);
    };

    console.warn = (data, ...args) => {
        data = format(data);
        if (warn) warn.apply(this, ["[WARNING] " + data, ...args]);
        logger(mainLogFile, "[WARNING] ", data, args);
    };

    try {
        fs.mkdirSync("logs")
    } catch (err) {
    }

    mainLogFile = fs.createWriteStream(logPath, {flags: 'a'});

    mainLogFile.on('error', function (err) {
        warn("Failed to create log file:", err.message);
        mainLogFile = null;
    });

    if (mainLogFile) {
        mainLogFile.write(os.EOL + "-".repeat(74) + os.EOL);
        mainLogFile.write("Logs begin at " + new Date().toString() + os.EOL);
        mainLogFile.write("-".repeat(74) + os.EOL + os.EOL);
    }

    process.on('unhandledRejection', function (reason/*, promise*/) {
        console.error('Unhandled promise rejection:', reason)
    });

    process.on('uncaughtException', function (err) {
        console.error("[EXCEPTION] Unhandled", err);
        console.error("Process will be terminated because of unhandled exception!");

        if (mainLogFile)
            mainLogFile.end(function () {
                process.exit(1)
            });
        else
            process.exit(1)
    });
};


export const initSecurityLog = () => {
    try {
        fs.mkdirSync("logs")
    } catch (err) {
    }

    securityLogFile = fs.createWriteStream(SECURITY_LOG, {flags: 'a'});

    securityLogFile.on('error', function (err) {
        console.warn("Failed to create log file:", err.message);
        securityLogFile = null;
    });

    if (securityLogFile) {
        securityLogFile.write(os.EOL + "-".repeat(74) + os.EOL);
        securityLogFile.write("Logs begin at " + new Date().toString() + os.EOL);
        securityLogFile.write("-".repeat(74) + os.EOL + os.EOL);
    }
};


export const security = new class {
    error(data, ...args) {
        data = format(data);
        logger(securityLogFile, "[ERROR] ", data, args);
    }

    warn(data, ...args) {
        data = format(data);
        logger(securityLogFile, "[WARNING] ", data, args);
    }
};


/*
 * Utility Functions
*/

function format(data) {
    return (!!data && (data.constructor === Object || data.constructor === Array)) ?
        JSON.stringify(data, null, 1).replace(/\r?\n|\r/g, "") : data
}

function logger(file, type, data, args) {
    if (file)
        file.write("[" + new Date().toLocaleString(
                'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replace(",", "") + "] " +
            util.format.apply(this, [type + data, ...args])
                .replace(/([\n\r]+)(?!\s{2})/g, os.EOL + "  ") + os.EOL);
}
