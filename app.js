import mongoose from 'mongoose';
import config from './lib/config/index.js'
import {initLogs, initSecurityLog, APP_LOG} from './lib/modules/logs.js';

initLogs(APP_LOG);
initSecurityLog();
// ===============================================
import initServer from './lib/init.js';

mongoose.set("strictQuery", false);

mongoose.connect(config['database'])
    .then(() => initServer())
    .catch((error) => console.log('MongoDB connection error:', error));
