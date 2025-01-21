export default {
    database: process.env.DB_CONFIG,
    rabbitMQUrl: process.env.RABBITMQ_URL,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    },
    environment: 'development',
    port: process.env.PORT || 3300,
    clientUrl: "https://192.168.1.137:3300",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpireTime: "2h",
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpireTime: "1d",
    ssl: true
};
