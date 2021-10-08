$( function() {
    setupClickListeners();
});
function setupClickListeners() {
    //load screen with db records
    getTasks();
}
function addTasks() {
    console.log( `inaddTasks` );

    //create the object to send - make a function for this
    let objectToSend = createTaskObject();
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
    let rowType = '';
    let completeCell = '';
    let actionCell = '';
    let dateCreated = '';
    let trashImage = `"../images/trash.svg" alt="trash" width="15" height="15"`;
    let checkImage = `"../images/check-lg.svg" alt="complete" width="15" height="15"`;
    let largeCheckImage = `"../images/check-lg.svg" alt="complete" width="18" height="18"`;
    let completeButton = `<button class="btn btn-default btn-outline-success mr-1">
                          <img src=${checkImage}></button>`;
    let trashButton = `<button class="btn btn-default btn-outline-danger">
                       <img src=${trashImage}></button>`;

    //Creating this part of the table (table class, headers) doesn't change.
    let appendString = `<table class="table table-bordered"><thead class="table-header bg-forestGreen">
                        <tr><th>Task</th><th>AssignedTo</th><th>Date Created</th>
                        <th>Date Completed</th><th>Actions</th></tr></thead><tbody>`;
                        
    for ( let i = 0; i < taskArray.length; i++ ) {
        dateCreated = new Date( taskArray[i].date_created ).toLocaleDateString();
        if ( taskArray[i].date_completed ) {
            rowType = `success`;
            dateCompleted = new Date(taskArray[i].date_completed ).toLocaleDateString();
            completeCell = `<img id="checkComplete" src=${largeCheckImage}>${dateCompleted}`;
            actionCell = completeButton;
        } else {
            rowType = `default`;
            actionCell = completeButton + trashButton;
        }
        appendString += `<tr class="table-${rowType}"><td>${taskArray[i].task_name}</td>
                        <td>${taskArray[i].assigned_to}</td>
                        <td>${dateCreated}</td>
                        <td>${completeCell}</td>
                        <td>${actionCell}</td>`;
    }
    appendString += `</tbody></table>`;
    return appendString;
}
function createTaskObject() {
    let taskObject = {
        taskName : $( '#taskName' ).val(),
        dateCreated: $( '#dateCreated' ).val(),
        dateCompleted: $( '#dateCompleted' ).val(),
        assignedTo: $( '#assignedTo' ).val()
    };
    return taskObject
}