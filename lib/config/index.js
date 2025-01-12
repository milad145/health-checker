import dotenv from 'dotenv';
dotenv.config();

let config;

if (process.env.NODE_ENV === 'production') {
    config = await import('./production.js');
} else {
    config = await import('./development.js');
}

export default config.default;
