//require pg first
const pg = require('pg');

// const pool = new pg.Pool({
//     database: 'weekend_to_do_app',
//     host: 'localhost',
//     port: 5432,
//     max: 12,
//     idleTimeoutMillis: 30000
// });

// NEW START
let pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
if ( pool.connectionString == undefined ) {
    pool = new pg.Pool({
            database: 'weekend_to_do_app',
            host: 'localhost',
            port: 5432,
            max: 12,
            idleTimeoutMillis: 30000
        });    
}
//NEW END

//export
module.exports = pool;