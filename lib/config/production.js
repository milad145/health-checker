import TokenGenerator from '../modules/tokenGenerator.js'

const tokenGenerator = new TokenGenerator(64, true, true, true, false)
process.env.ACCESS_TOKEN_SECRET = tokenGenerator.newToken()
process.env.REFRESH_TOKEN_SECRET = tokenGenerator.newToken()

export default {
    database: process.env.DB_CONFIG,
    environment: 'development',
    port: process.env.PORT || 3300,
    clientUrl: "https://192.168.1.137:3300",
    accessTokenExpireTime: "10m",
    refreshTokenExpireTime: "1d",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    ssl: false
};
