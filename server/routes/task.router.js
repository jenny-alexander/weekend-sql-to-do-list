// const { query } = require('express');
const { query } = require('express');
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
    const queryString = `INSERT INTO tasks (task_name, assigned_to )
                         VALUES($1, $2);`;    
    // let values = [req.body.taskName, req.body.assignedTo, req.body.dateCreated];
    let values = [req.body.taskName, req.body.assignedTo];
    pool.query( queryString, values ).then( ( results )=>{
        res.sendStatus( 201 );
    }).catch( ( error )=>{
        res.sendStatus( 500) ;
    })
});
// PUT (update record in DB)
taskRouter.put( '/', ( req, res )=>{
    //dynamically get values that will be updated from req.body since we don't know 
    let queryString = `UPDATE tasks SET `;
    //loop through the object values and corresponding keys by using Object.keys & Object.values functionality
    for ( let i = 0; i < Object.keys(req.body).length; i++ ) {
        let key = Object.keys(req.body)[i];
        let value = Object.values(req.body)[i];
        //If the value is a date, add a single quote around it (necessary for DB update to work)
        if ( key.includes('date') ) {
            value = "'" + value + "'";
        }
        queryString += `${key} = ${value},`
    }
    //get rid of the extra ',' at the end of queryString
    queryString = queryString.slice(0, queryString.length-1 ) 
    queryString += ` WHERE id = '${req.query.id}';`;    

    pool.query( queryString ).then( ( results )=>{
        console.log( `results say:`,results );
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