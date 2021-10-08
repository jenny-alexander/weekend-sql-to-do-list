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
taskRouter.post( '/', ( req, res )=>{
    console.log( 'in POST on server' );
    const queryString = `INSERT INTO tasks (task_name, assigned_to, date_created )
                         VALUES($1, $2, $3)`;

    let values = [req.body.taskName, req.body.assignedTo, req.body.dateCreated];
    console.log( `queryString is:`, queryString );
    console.log( `values are:`, values );
    pool.query( queryString, values ).then( ( results )=>{
        res.sendStatus( 201 );
    }).catch( ( error )=>{
        res.sendStatus( 500) ;
    })
});
// PUT


// DELETE

module.exports = taskRouter;