import user from './user/route.js'
import signal from './signal/route.js'

const routes = (app) => {
    app.use('/user', user);
    app.use('/signal', signal);
};

export default routes;
