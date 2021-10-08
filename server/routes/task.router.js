// const { query } = require('express');
const express = require('express');
const taskRouter = express.Router();

// DB CONNECTION
const pool = require( '../modules/pool.js' );

// GET
taskRouter.get( '/', ( req, res )=>{
    console.log( `in GET on server` );
    const queryString = `SELECT * FROM tasks ORDER BY id`;

    pool.query( queryString ).then( ( results ) => {
        res.send( results.rows );
        console.log( `results.rows is:`, results.rows );
    }).catch( ( err ) => {
        console.log( `GET error is:`, err );
        res.sendStatus( 500 );
    });
});

// POST


// PUT


// DELETE

module.exports = taskRouter;