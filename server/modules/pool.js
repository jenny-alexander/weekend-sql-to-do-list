//require pg first
const pg = require('pg');
require('dotenv').config();

//Depending on where the app is deployed (heroku or local), get the db connection requirements
const pool = (() => {
    if (process.env.NODE_ENV !== 'production') {
        return new pg.Pool({
            database: 'weekend_to_do_app',
            host: 'localhost',
            port: 5432,
            max: 12,
            idleTimeoutMillis: 30000
        });
    } else {
        return new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
              }
        });
    } })();
//NEW END

//export
module.exports = pool;