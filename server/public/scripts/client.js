$( function() {
    setupClickListeners();
});
function setupClickListeners() {
    //load screen with db records
    getTasks();
    $( '#addTaskButton' ).on( 'click', addTask );
    $( '#outputDiv' ).on( 'click', '#removeTaskButton', removeTask )
}
function addTask() {
    console.log( `in addTask` );
    let taskToSend = createTaskObject();
    console.log( `in addTasks`, taskToSend  );
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: taskToSend
    }).then( function ( response ){
        getTasks();
    }).catch( function ( err ){
        console.log( err );
        alert( `error saving task` );
    })
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
            clearInput();
        }
    }).catch( function( err ){
        console.log( `error getting tasks:`, err );
        alert('Error getting tasks - see console'); //TODO - change to sweet alert
    });
}
function removeTask() {
    console.log( `in removeTask and the id is:`, $( this ).parent().parent().data( 'id' ) );
    //id is on the <tr> element which is the "grandparent" of the button
    let idOfTask = $( this ).parent().parent().data( 'id' );

    $.ajax({
        method: 'DELETE',
        url: '/tasks?id=' + idOfTask
    }).then( function ( response ) {
        console.log( 'remove task', response );
        getTasks();
    }).catch( function ( error ) {
        console.log( `error with delete`, error );
        alert( `Oops! There was an error with your delete. Check console for details.` );
    })
}
function createTableOutput( taskArray ) {
    let rowType = '';
    let completeCell = '';
    let actionCell = '';
    let dateCreated = '';
    let trashImage = `"../images/trash.svg" alt="trash" width="15" height="15"`;
    let checkImage = `"../images/check-lg.svg" alt="complete" width="15" height="15"`;
    let largeCheckImage = `"../images/check-lg.svg" alt="complete" width="18" height="18"`;
    let completeButton = `<button class="btn btn-default btn-outline-success mr-1" id="completeTaskButton">
                          <img src=${checkImage}></button>`;
    let trashButton = `<button class="btn btn-default btn-outline-danger" id="removeTaskButton">
                       <img src=${trashImage}></button>`;

    //Creating this part of the table (table class, headers) doesn't change.
    let appendString = `<table class="table"><thead class="table-header bg-forestGreen">
                        <tr><th>Task</th><th>AssignedTo</th><th>Date Created</th>
                        <th>Date Completed</th><th>Actions</th></tr></thead><tbody>`;
                        
    for ( let i = 0; i < taskArray.length; i++ ) {
        dateCreated = new Date( taskArray[i].date_created ).toLocaleDateString();
        if ( taskArray[i].date_completed == null ) {
            rowType = `default`;
            actionCell = completeButton + trashButton;
            completeCell = '';
        } else {
            rowType = `success`;
            let dateCompleted = new Date(taskArray[i].date_completed ).toLocaleDateString();
            completeCell = `<img id="checkComplete" src=${largeCheckImage}>${dateCompleted}`;
            actionCell = trashButton;
        }
        appendString += `<tr class="table-${rowType}" data-id="${taskArray[i].id}"><td>${taskArray[i].task_name}</td>
                        <td>${taskArray[i].assigned_to}</td>
                        <td>${dateCreated}</td>
                        <td>${completeCell}</td>
                        <td>${actionCell}</td>`;

    }
    appendString += `</tbody></table>`;
    return appendString;
}
function createTaskObject() {
    console.log( `task name is:`, $( '#task' ).val() );
    console.log( `assigned to is:`, $( '#assigned' ).val() );
    let taskObject = {
        taskName : $( '#task' ).val(),
        assignedTo: $( '#assigned' ).val(),
        dateCreated: new Date().toLocaleDateString(),
        dateCompleted: ''
    };
    console.log( `taskObject:`, taskObject );
    return taskObject;
}
function clearInput() {
    $( '#task' ).val('');
    $( '#assigned' ).val('');
}
