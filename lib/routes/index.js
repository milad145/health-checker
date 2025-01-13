import user from './user/route.js'
import signal from './signal/route.js'

const routes = (app, rabbitMQService) => {
    app.use('/user', user);
    app.use('/signal', signal(rabbitMQService));
};

export default routes;
