import TokenGenerator from '../modules/tokenGenerator.js'

const tokenGenerator = new TokenGenerator(64, true, true, true, false)
process.env.ACCESS_TOKEN_SECRET = tokenGenerator.newToken()
process.env.REFRESH_TOKEN_SECRET = tokenGenerator.newToken()

export default {
    database: process.env.DB_CONFIG,
    rabbitMQUrl: process.env.RABBITMQ_URL,
    environment: 'production',
    port: process.env.PORT || 3300,
    clientUrl: "https://fesharino.vrlink.ir",
    accessTokenExpireTime: "10m",
    refreshTokenExpireTime: "1d",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    ssl: false
};
