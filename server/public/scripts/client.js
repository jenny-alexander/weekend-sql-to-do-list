const e = require("express");

$( function() {
    setupClickListeners();
});
function setupClickListeners() {
    //load screen with db records
    getTasks();
}
function getTasks() {
    console.log( `in getTasks()` );
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then( function ( response ){
        console.log( `in back from GET on server with response:`, response );
        let elViewTasks = $( '#outputDiv' );
        elViewTasks.empty();
        //crate separate function and pass method type (i.e. 'GET' ) in order to know what to do?
        let appendString = `<table class="table table-bordered"><thead class="table-header bg-forestGreen">
                            <tr><th>Task</th><th>Completed</th><th>Actions</th></tr></thead>
                            <tbody><tr class="table-success"><td>${response[i].taskName}</td>`
        if ( response[i].completed ) {
            appendString += `<td><img src="./images/check-lg.svg" alt="complete" width="18" height="18"></td>
                             <td><button class="btn btn-default btn-outline-danger">
                             <img src="./images/trash.svg" alt="trash" width="15" height="15"></button></td>`;
        } else {
            appendString += `<td></td><td><button class="btn btn-default btn-outline-success mr-1">
                             <img src="./images/check-lg.svg" alt="complete" width="15" height="15"></button>
                             <button class="btn btn-default btn-outline-danger">
                             <img src="./images/trash.svg" alt="trash" width="15" height="15"></button></td>`;
        }
        appendString += `</tr></tbody></table>`;
        elViewTasks.append( appendString );
    }).catch( function( err ){
        console.log( `error getting tasks:`, err );
        alert('Error getting tasks - see console'); //TODO - change to sweet alert
    });
}