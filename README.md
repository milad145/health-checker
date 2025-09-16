# Fesharino

A sample Node.js application developed by : Express.js, Mongoose, Redis, RabbitMQ that authorized with JWT.

### Files Structure

```
lib/
---- config/
---- ---- development.js
---- ---- index.js
---- ---- production.js
---- data/
---- ---- collector.js
---- entities/
---- ---- user/
---- ---- ---- user.js
---- ---- ---- service.js
---- modules/
---- ---- assist.js
---- ---- errorHandler.js
---- ---- logs.js
---- ---- middlewares.js
---- ---- tokenGenerator.js
---- routes/
---- ---- signal/
---- ---- ---- route.js
---- ---- ---- service.js
---- ---- ---- validation.js
---- ---- user/
---- ---- ---- route.js
---- ---- ---- service.js
---- ---- ---- validation.js
---- ---- index.js
---- services/
---- ---- rabbitMQ.js
---- ---- redis.js
---- init.js
.gitignore
app.js
package.json
README.md
sample.env
```

### Run Project
1. clone the project

```
git clone https://github.com/milad145/health-checker.git
```

2. go to the project directory

```
cd health-checker
```

3. install all the dependencies

```
npm i
```

4. make a copy of `sapmle.env` and rename it to `.env`

```
cp sample.env .env
```

5. update the `.env` file parameters

```
DB_CONFIG : mongodb connection url
ACCESS_TOKEN_SECRET : secret string for creating access token 
REFRESH_TOKEN_SECRET : secret string for creating refresh token
PORT : the port which app listen on it
RABBITMQ_URL : rabbit-mq connection url
REDIS_HOST : redis connection url
REDIS_PASSWORD : redis password for connection
```

6. run the project with this command

```
npm run dev
```
