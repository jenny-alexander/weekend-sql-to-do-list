$( function() {
    setupClickListeners();
});
function setupClickListeners() {
    //initialize all tooltips on the page
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

    getTasks();
    $( '#addTaskButton' ).on( 'click', addTask );
    $( '#outputDiv' ).on( 'click', '#removeTaskButton', removeTask );
    $( '#outputDiv' ).on( 'click', '#completeTaskButton', completeTask );
    $( '#outputDiv' ).on( 'click', '#editTaskButton', editTask );
}
function addTask() {
    if ( $( '#task' ).val() ) {
        $.ajax({
            method: 'POST',
            url: '/tasks',
            data: createTaskObject()
        }).then( function ( response ){
            getTasks();
        }).catch( function ( err ){
            console.log( err );
            alert( `Oops! There was an error getting the tasks. Check console for details.` );
        })
    }
}
function getTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then( function ( response ){
        //Check that response is not empty before continuing
        if ( response.length != 0 ) {
            let elViewTasks = $( '#outputDiv' );
            elViewTasks.empty();
            elViewTasks.append( createTableOutput( response ) );
            clearInput();
        }
    }).catch( function( err ){
        console.log( `error getting tasks:`, err );
        alert( `Oops! There was an error adding the task. Check console for details.` ); //TODO - change to sweet alert
    });
}
function removeTask() {
    //id is on the <tr> element which is the "grandparent" of the button
    let idOfTask = $( this ).parent().parent().data( 'id' );

    //Show Sweet Alert(2) popup box. If user chooses yes, then continue saving to DB. If no, then don't do anything.
    Swal.fire({
        title: 'Do you want to delete the task?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#4CAF50',
        denyButtonText: `No`,
        denyButtonColor: '#78808C',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: '/tasks?id=' + idOfTask
            }).then( function ( response ) {
                Swal.fire('Task deleted!', '', 'success')
                getTasks();
            }).catch( function ( error ) {
                console.log( `error with delete`, error );
                alert( `Oops! There was an error deleting the task. Check console for details.` );
            })
        }
    })
}
function completeTask() {
    let taskToUpdate = $( this ).parent().parent().data( 'id' );
    let todayDate = new Date().toISOString(); //send UTC to database

    $.ajax({        
        method: 'PUT',
        url: `/tasks?id=${taskToUpdate}`,
        //data: 'date_completed=10/08/2021'
         //data: 'date_completed='+todayDate
         data: `completed=true&date_completed=${todayDate}`
    }).then( function ( response ) {
        getTasks();
    }).catch( function ( error ){
        console.log( `error with update:`, error );
        alert( `Oops! There was an error completing the task. Check console for details.` );
    })
}
function editTask() {
    console.log( `in editTask` );
}
function createTableOutput( taskArray ) {
    let rowType = '';
    let completedCell = '';
    let completedDateCell = '';
    let actionCell = '';
    // let dateCreated = '';
    let editImage = `"../images/pencil.svg" alt="edit" width="15" height="15"`;
    let trashImage = `"../images/trash.svg" alt="trash" width="15" height="15"`;
    let checkImage = `"../images/check-lg.svg" alt="complete" width="15" height="15"`;
    let largeCheckImage = `"../images/check-lg.svg" alt="complete" width="18" height="18"`;
    let editButton = `<button class="btn btn-default btn-outline-secondary mr-3" id="editTaskButton">
                      <img src=${editImage}></button>`;
    let completeButton = `<button class="btn btn-default btn-outline-success mr-3" id="completeTaskButton">
                          <img src=${checkImage}></button>`;
    let trashButton = `<button class="btn btn-default btn-outline-danger" id="removeTaskButton">
                       <img src=${trashImage}></button>`;

    //Creating this part of the table (table class, headers) doesn't change.
    let appendString = `<table class="table"><thead class="table-header bg-forestGreen">
                        <tr><th>Task</th><th>Assigned To</th><th>Completed</th>
                        <th>Date Completed</th><th>Actions</th></tr></thead><tbody>`;
                        
    for ( let i = 0; i < taskArray.length; i++ ) {
        if ( taskArray[i].completed ) {
            rowType = `success`;
            completedCell = `<img id="checkComplete" src=${largeCheckImage}></img>`;
            completedDateCell = new Date(taskArray[i].date_completed ).toLocaleDateString();
            actionCell = trashButton;            
        } else {
            rowType = `default`;            
            completedCell = '';
            completedDateCell = '';
            actionCell = editButton + completeButton + trashButton;
        }
        appendString += `<tr class="table-${rowType}" data-id="${taskArray[i].id}"><td>${taskArray[i].task_name}</td>
                        <td>${taskArray[i].assigned_to}</td>
                        <td>${completedCell}</td>
                        <td>${completedDateCell}</td>
                        <td>${actionCell}</td>`;

    }
    appendString += `</tbody></table>`;
    return appendString;
}
function createTaskObject() {
    let taskObject = {
        taskName : $( '#task' ).val(),
        assignedTo: $( '#assigned' ).val(),
        //dateCreated: new Date().toLocaleDateString(),
        completed: false,
        dateCompleted: ''
    };
    return taskObject;
}
function clearInput() {
    $( '#task' ).val('');
    $( '#assigned' ).val('');
}
