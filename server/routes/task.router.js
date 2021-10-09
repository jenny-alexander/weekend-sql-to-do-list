// const { query } = require('express');
const express = require('express');
const taskRouter = express.Router();

// DB CONNECTION
const pool = require( '../modules/pool.js' );

// GET
taskRouter.get( '/', ( req, res )=>{
    const queryString = `SELECT * FROM tasks ORDER BY id;`;
    pool.query( queryString ).then( ( results ) => {
        res.send( results.rows );
    }).catch( ( err ) => {
        console.log( `GET error is:`, err );
        res.sendStatus( 500 );
    });
});
// POST (Create new task record in DB)
taskRouter.post( '/', ( req, res )=>{
    const queryString = `INSERT INTO tasks (task_name, assigned_to, date_created )
                         VALUES($1, $2, $3);`;
    let values = [req.body.taskName, req.body.assignedTo, req.body.dateCreated];
    pool.query( queryString, values ).then( ( results )=>{
        res.sendStatus( 201 );
    }).catch( ( error )=>{
        res.sendStatus( 500) ;
    })
});
// PUT (update record in DB)
//At the moment, the only thing that can be updated is the date_completed
taskRouter.put( '/', ( req, res )=>{
    //dynamically get values that will be updated from req.body
    const queryString = `UPDATE tasks SET ${Object.keys(req.body)} = '${Object.values(req.body)}' 
                         WHERE id = '${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 );
    }).catch( ( error )=>{
        console.log( error );
        res.sendStatus( 500 );
    })
})
// DELETE
taskRouter.delete( '/', ( req, res )=>{
    const queryString = `DELETE FROM tasks WHERE id='${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 );
    }).catch( ( error )=>{
        console.log( error );
        res.sendStatus( 500 );
    })
})

module.exports = taskRouter;