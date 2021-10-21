//require pg first
const pg = require('pg');
require('dotenv').config();

// const pool = new pg.Pool({
//     database: 'weekend_to_do_app',
//     host: 'localhost',
//     port: 5432,
//     max: 12,
//     idleTimeoutMillis: 30000
// });

// NEW START
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