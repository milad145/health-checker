import user from './user/route.js'
import signal from './signal/route.js'

const routes = (app, {smsService, rabbitMQService, redisService}) => {
    app.use('/user', user({smsService}));
    app.use('/signal', signal({rabbitMQService, redisService}));
};

export default routes;
