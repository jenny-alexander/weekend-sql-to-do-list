const { query } = require('express');
const express = require('express');
const todoRouter = express.Router();

// DB CONNECTION
const pool = require( '../modules/pool.js' );

// GET
todoRouter.get( '/', ( req, res )=>{
    console.log( `in GET on server` );
    const queryString = `SELECT * FROM tasks`;

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

module.exports = todoRouter;