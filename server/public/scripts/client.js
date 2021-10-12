$( function() {
    setupClickListeners();
});
function setupClickListeners() {
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
            console.log( `error adding task:`, err );            
            Swal.fire({
            icon: 'error',
            title: 'Oops, something went wrong!',
            text: 'There was an error adding the task.',
             footer: 'Check console for details.'
            })
        })
    }
}
function getTasks() {   
    //Display most recently created tasks first (meaning the ones with the biggest ID number).
    //This is done by appending a sort command to the url.
    $.ajax({
        method: 'GET',
        url: '/tasks?sort=-id' //pass sort order here
    }).then( function ( response ){   
        let elViewTasks = $( '#outputDiv' );
        elViewTasks.empty();
        elViewTasks.append( createTableOutput( response ) );
        clearInput();
    }).catch( function( err ){
        console.log( `error getting tasks:`, err );        
        Swal.fire({
            icon: 'error',
            title: 'Oops, something went wrong!',
            text: 'There was an error getting the tasks.',
             footer: 'Check console for details.'
            })        
    });
}
function removeTask() {
    //id is on the <tr> element which is the "grandparent" of the button
    let idOfTask = $( this ).parent().parent().data( 'id' );

    //Show SweetAlert(2) popup box. If user chooses yes, then continue saving to DB. If no, then don't do anything.
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
                Swal.fire({
                    title: 'Success!',
                    text: "Task deleted!",
                    icon: 'success',
                    showCancelButton: false,
                    showCloseButton: true,
                    confirmButtonColor: '#3da133',
                    confirmButtonText: 'Ok!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        getTasks();
                    }
                  })                
            }).catch( function ( error ) {
                console.log( `error with delete`, error );
                Swal.fire({
                    icon: 'error',
                    title: 'Oops, something went wrong!',
                    text: 'There was an error removing the task.',
                     footer: 'Check console for details.'
                    })  
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
        Swal.fire({
            icon: 'error',
            title: 'Oops, something went wrong!',
            text: 'There was an error completing the task.',
             footer: 'Check console for details.'
            })  
    })
}
async function editTask() {
    let grandparent = $( this ).parent().parent();
    //Look for child element (<td>) of this specific row that has the 'task name' field
    let elTaskNode = grandparent.children( '#name' );
    let taskName = elTaskNode[0].textContent;
    //Look for child element (<td>) of this specific row that has the 'assigned to' field
    let elAssignedNode = grandparent.children( '#assigned' );
    let assignedTo = elAssignedNode[0].textContent;   

    //Display SweetAlert popup to user and allow the user to enter task name and assigned to
    const { value: formValues } = await Swal.fire({
        title: 'Edit task',
        html:
          `<label>Enter task name and assigned to:</label>` +
          `<input id="swal-taskName" type="text" placeholder="${taskName}" class="swal2-input">` +
          `<input id="swal-assignedTo" type="text" placeholder="${assignedTo}" class="swal2-input">`,
            focusConfirm: false,
            showCancelButton: true,
            showCloseButton: true,
            //here we are grabbing the values entered by the user
            preConfirm: () => {
                //since task name is mandatory on DB, check to make sure it was entered in popup
                if ( document.getElementById('swal-taskName').value) {
                    return [
                        document.getElementById('swal-taskName').value,
                        document.getElementById('swal-assignedTo').value
                    ]
                } else {                    
                    Swal.showValidationMessage('Task name missing!'); 
                }
        }
      })      
      if (formValues) {
        //First, make sure user enters a task name
        if ( formValues[0] ) {
            //Check what was input by user and send to DB without checking to see if anything actually changed.
            //Build the data string to get sent to PUT method on server side.
            //Get 'task name'.
            let dataString = `task_name=${formValues[0]}`;
            //get 'assigned to'
            if ( formValues[1] ){
                dataString += `&assigned_to=${formValues[1]}`
            }
            //id is on the <tr> element which is the "grandparent" of the button
            let idOfTask = grandparent.data( 'id' );
            $.ajax({        
                method: 'PUT',
                url: `/tasks?id=${idOfTask}`,
                data: dataString
            }).then( function ( response ) {
                Swal.fire('Task updated!', '', 'success')
                getTasks();
            }).catch( function ( error ){
                console.log( `error with update:`, error );
                Swal.fire({
                    icon: 'error',
                    title: 'Oops, something went wrong!',
                    text: 'There was an error editing the task.',
                    footer: 'Check console for details.'
                    })  
            })            
        } 
      }  
}
function createTableOutput( taskArray ) {
    let rowType = '';
    let completedCell = '';
    let completedDateCell = '';
    let actionCell = '';
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
    let appendString = `<table class="table table-sm"><caption>List of tasks</caption><thead class="table-header bg-forestGreen">
                        <tr><th>Task</th><th>Assigned To</th><th>Completed</th>
                        <th>Date Completed</th><th>Actions</th></tr></thead><tbody>`;
                        
    for ( let i = 0; i < taskArray.length; i++ ) {
        if ( taskArray[i].completed ) {
            rowType = `success`;
            completedCell = `<img id="checkComplete" src=${largeCheckImage}></img>`;
            let options = {hour: "2-digit", minute: "2-digit"};
            completedDateCell = new Date(taskArray[i].date_completed ).toLocaleDateString() + ' ' +
                                new Date(taskArray[i].date_completed ).toLocaleTimeString( `en-US`, options );
            actionCell = trashButton;            
        } else {
            rowType = `default`;            
            completedCell = '';
            completedDateCell = '';
            actionCell = editButton + completeButton + trashButton;
        }
        appendString += `<tr class="table-${rowType}" data-id="${taskArray[i].id}">
                        <td id="name">${taskArray[i].task_name}</td>
                        <td id="assigned">${taskArray[i].assigned_to}</td>
                        <td>${completedCell}</td>
                        <td>${completedDateCell}</td>
                        <td>${actionCell}</td>
                        </tr>`;

    }
    appendString += `</tbody></table>`;
    return appendString;
}
function createTaskObject() {
    let taskObject = {
        taskName : $( '#task' ).val(),
        assignedTo: $( '#assigned' ).val(),
        completed: false,
        dateCompleted: ''
    };
    return taskObject;
}
function clearInput() {
    $( '#task' ).val('');
    $( '#assigned' ).val('');
    $( '#task' ).focus();
}
