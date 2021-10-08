//GLOBALS
let trashImgButton = `"../images/trash.svg" alt="trash" width="15" height="15"`;
let checkImgButton = `"../images/check-lg.svg" alt="complete" width="15" height="15"`;
let checkImg = `"../images/check-lg.svg" alt="complete" width="18" height="18"`;

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
        //Check that response is not empty before continuing
        if ( response.length != 0 ) {
            let elViewTasks = $( '#outputDiv' );
            elViewTasks.empty();
            elViewTasks.append( createTableOutput( response ) );
        }
    }).catch( function( err ){
        console.log( `error getting tasks:`, err );
        alert('Error getting tasks - see console'); //TODO - change to sweet alert
    });
}
function createTableOutput( taskArray ) {
    let appendString = `<table class="table table-bordered"><thead class="table-header bg-forestGreen">
                        <tr><th>Task</th><th>Completed</th><th>Actions</th></tr></thead><tbody>`;
    for ( let i = 0; i < taskArray.length; i++ ) {
        if ( taskArray[i].completed ) {
            let dateToShow = new Date(taskArray[i].date_completed ).toLocaleDateString();
            appendString += `<tr class="table-success"><td>${taskArray[i].task_name}</td>
                            <td><img id="checkComplete" src=${checkImg}>${dateToShow}</td>
                            <td><button class="btn btn-default btn-outline-danger">`;
        } else {
            appendString += `<tr class="table-default"><td>${taskArray[i].task_name}</td><td></td>
                            <td><button class="btn btn-default btn-outline-success mr-1">
                            <img src=${checkImgButton}></button>
                            <button class="btn btn-default btn-outline-danger">`;
        }
        appendString += `<img src=${trashImgButton}></button></td></tr>`;
    }
    appendString += `</tbody></table>`;
    return appendString;
}