(function () { // Inits the basic components of the board and connecting it with the index.html page file.

    let taskBoard = document.getElementById("taskBoard"); // Connection to index.html's div.

    let taskArea = document.createElement("div"); // Task preview area.
    taskArea.className = "taskArea";

    let taskArray = didUserUseThisTaskBoardBefore (taskArea); // inits taskArray. If the user visited this task board previously, remaining tasks will be stored here.

    createTaskTitle(taskBoard);

    let formArea = document.createElement("div"); // Creates the form preview area.
    formArea.className = "formArea";

    createFormVisuals(taskArray, taskArea, formArea, taskBoard); // Creates the more "complex" visual components.

    taskBoard.appendChild(formArea);
    taskBoard.appendChild(taskArea);

})();

function didUserUseThisTaskBoardBefore (taskArea) { // Checks if the user already cleared all of his tasks over the last time he visited.
    let taskArray = [];

    if (localStorage.getItem("taskArray") != null) { // Previous visits' tasks are stored in the localStorage.
        taskArray = JSON.parse (localStorage.getItem("taskArray")); // Loads previous tasks from the previous page visits of the user.
        displayTasks(taskArray, taskArea); // Displays previous tasks upon loading the page.
    }

    return taskArray;
}

function createTaskTitle (taskBoard) { // Creates the title visual component.
    let titleArea = document.createElement("div"); 
    titleArea.className = "titleArea display-1";
    titleArea.innerHTML = "My Task Board";
    taskBoard.appendChild(titleArea);
}

function createFormVisuals(taskArray, taskArea, formArea, taskBoard) { // Creates the form's visual components.
  
    let requiredInputInformation = document.createElement("div"); // Matching explanation when hovering on the detailsGlyph icon.

    let errorSign = document.createElement("span"); // Icon showing when there is an input error. Triggered on-hover for brief explanation depending on what is the error.
    let errorArea = document.createElement("div"); // Matching explanation window when hovering on the errorSign icon.

    let taskDetails = createDetailsInputVisualRow (formArea, requiredInputInformation); // Creates the task's details input row.
    let taskDate = createDateInputVisualRow (formArea, requiredInputInformation, errorSign, formArea); // Creates the task's date input row.
    let taskTime = createTimeInputVisualRow (formArea); // Creates the task's time input row.
    createSaveTaskButton (taskDetails, taskDate, taskTime, formArea, taskArray, taskArea, errorSign, errorArea); // Creates the save button and its functions.
    createClearInputButton (taskDetails, taskDate, taskTime, formArea); // Creates the clear button and its functions.
}

function createDetailsInputVisualRow(formArea, requiredInputInformation) { // Creates the form's details input row.

    let taskDetails = document.createElement("input"); // Creates the task details input area.
    taskDetails.className = "taskDetails form-control";
    taskDetails.placeholder = "Task details";

    let detailsGlyph = document.createElement("span"); // Icon triggered on-hover for brief explanation of required details input row.
    detailsGlyph.className = "detailsGlyph glyphicon glyphicon-info-sign";

    detailsGlyph.onmouseover = function () { // Explaining the task's information requirement when hovered over the icon.
        requiredInputInformation.className = "formInformation font-weight-bolder";
        requiredInputInformation.innerHTML = "<h6>Notification message:</h6><hr> You must fill the information row with a description of at the very least 8 letters. <br> Mentioned requirement exists in order to make tasks understandable by having a decent description for your future visits. <hr>";
    
        detailsGlyph.appendChild(requiredInputInformation);
    
    };

    formArea.appendChild(taskDetails);
    formArea.appendChild(detailsGlyph);

    return taskDetails;
}

function createDateInputVisualRow (formArea, requiredInputInformation, errorSign, formArea) { // Creates the form's date input row.

    let taskDate = document.createElement("input"); // Creates the task date input area.
    taskDate.className = "taskDate form-control";
    taskDate.setAttribute ("type", "date");

    let detailsGlyph2 = document.createElement("span"); // Icon triggered on-hover for brief explanation of required date input row.
    detailsGlyph2.className = "detailsGlyph2 glyphicon glyphicon-info-sign";


    detailsGlyph2.onmouseover = function () { // Explaining the task's date requirement when hovered over the icon.
        requiredInputInformation.className = "formInformation2 font-weight-bolder";
        requiredInputInformation.innerHTML = "<h6>Notification message:</h6><hr>You must fill the date row with an appropriate date. Past dates cannot be accepted. <hr>";

        detailsGlyph2.appendChild(errorSign); // Added to hide the errorSign for the situation when there is a details input row error showing up and the user is hovering over
        // the form's detail information icon. Without adding this element, the error icon will hover over the notification message, and that's not something desired.
        // It is known this situation was created due to the order in which different elements were appended as childs to the formArea element.
        detailsGlyph2.appendChild(requiredInputInformation);
    };

    detailsGlyph2.onmouseout = function () {
        formArea.appendChild(errorSign); // Revealing the error icon once again, once the user leaves the form's detail information icon.
    }

    formArea.appendChild(taskDate);
    formArea.appendChild(detailsGlyph2);

    return taskDate;
}

function createTimeInputVisualRow (formArea) { // Creates the form's time input row.

    let taskTime = document.createElement("input"); // Creates the task time input area.
    taskTime.className = "taskTime form-control";
    taskTime.setAttribute ("type", "time");

    formArea.appendChild(taskTime);

    return taskTime;
}

function createSaveTaskButton (taskDetails, taskDate, taskTime, formArea, taskArray, taskArea, errorSign, errorArea) { // Creates the form's create button's visuals and its functions.

    errorSign.appendChild(errorArea);
    formArea.appendChild(errorSign);

    let saveTaskButton = document.createElement("button"); // Creates the insert task button.
    saveTaskButton.className = "createTaskButton btn btn-primary btn-sm";
    saveTaskButton.innerHTML = "Create task";
    saveTaskButton.onclick = function () {
        if(isInputValid (taskDetails, taskDate, taskTime, errorSign, errorArea)){ // Checks if the input inserted by the user is valid.
            createTask(taskDetails.value, taskDate.value, taskTime.value, taskArray); // Creates a task.
            clearInputs (taskDetails, taskDate, taskTime); // Clears the input inside the form.
            localStorage.setItem("willTaskFadeIn", "yes"); // If a task is being created it will fade in, in other cases none of the tasks will. Used as a pseudo boolean with "yes" and "no" values.
           displayTasks(taskArray, taskArea); // Displays the tasks after the addition of the new one.
        }    
    };

    formArea.appendChild(saveTaskButton);
}

function createClearInputButton (taskDetails, taskDate, taskTime, formArea) { // Creates the form's clear button's visuals and its functions.
    
    let clearInputsButton = document.createElement("button"); // Clears the inputs inside the form.
    clearInputsButton.className = "clearInputsButton btn btn-secondary btn-sm";
    clearInputsButton.innerHTML = "Clear";
    clearInputsButton.onclick = function (){ // Clearing function
        clearInputs (taskDetails, taskDate, taskTime);
    };

    formArea.appendChild(clearInputsButton);
}

function isInputValid (taskDetails, taskDate, taskTime, errorSign, errorArea){ // Input verification function.
    // The input errors will appear through icons depending on what row had the input error.
    // Error messages appear once a user hovers over the icon.

    let currentDate = new Date (); // Creating current date object.
    let pickedDate = new Date (taskDate.value); // Creating a new date object with user input.
    if (taskTime.value == "") { // Time isn't a required input. In a case where the user decides not to fill the time input row, in order to avoid rare scenarios, time will be set to the exact last second of the inserted date.
        pickedDate.setHours(23);
        pickedDate.setMinutes(59);
        pickedDate.setSeconds(59);
    }
    else { // If user entered a time input, it will be added to the user input date object.
        let pickedTime = taskTime.value;
        let timeArray = pickedTime.split(':');
        pickedDate.setHours(timeArray[0]);
        pickedDate.setMinutes(timeArray[1]);
    }
    if (taskDetails.value == "") { // Makes sure the user added a details input.
        errorSign.className = "errorGlyphActive glyphicon glyphicon-remove";
        errorArea.innerHTML = "<h5>Input error!</h5><hr>Cannot assign a task without details. <hr>";
        errorArea.className = "errorArea font-weight-bolder";
        return false;
    }
    else if (taskDetails.value.length < 8) { // Makes sure a note will have "enough" letters to explain what the task is about - purely to help the user in future visits.
        errorSign.className = "errorGlyphActive2 glyphicon glyphicon-remove-sign";
        errorArea.innerHTML = "<h5>Input error!</h5><hr>The task's details must contain atleast 8 letters. <hr>";
        errorArea.className = "errorArea2 font-weight-bolder";
        return false;
    }
    if (taskDate.value == "") { // Makes sure the user added a date input.
        errorSign.className = "errorGlyphActive3 glyphicon glyphicon-remove-sign";
        errorArea.innerHTML = "<h5>Input error!</h5><hr> Cannot assign a task without a date due. <br> Make sure the date you are trying to assign exists in the row's calendar. <hr>";
        errorArea.className = "errorArea3 font-weight-bolder";
        return false;
    }
    else if (pickedDate < currentDate) { // Denies past dates in the date input row.
        errorSign.className = "errorGlyphActive4 glyphicon glyphicon-calendar";
        errorArea.innerHTML = "<h5>Input error!</h5><hr> Cannot assign a task with a past date or time (if its in the same day). <hr>";
        errorArea.className = "errorArea4 font-weight-bolder";
        return false;
    }
    errorSign.className = "errorGlyphHidden"; // Hides the error icon once all of the user's input is verified.
    return true;
}

function clearInputs (taskDetails, taskDate, taskTime) { // Clears the inputs inside the form.
    taskDetails.value = "";
    taskDate.value = "";
    taskTime.value = "";
}

function createTask(details, date, time, taskArray) { // Creates a new task object and pushes it into the task array.
    // An index counter is placed inside the localstorage in order to avoid rare occasions of having a few tasks have the same index,
    // by deleting and re-creating tasks.
    if (localStorage.getItem("index") == null) { // Checks if the user already entered old tasks on another occasion.
        localStorage.setItem("index", 1); // Inits localstorage incase its the user's first time.
    }
    var index = localStorage.getItem("index");
    let task = { // Task JSON.
        id: index,
        details : details,
        date: date,
        time: time
    };
    taskArray.push(task);
    index++;
    localStorage.setItem("index", index);
}

function displayTasks (taskArray, taskArea) { // Displays the current tasks on screen.
    taskArea.innerHTML = ""; // Resets the area before displaying.
    for (let i = 0; i < taskArray.length; i++)
    {
        let taskNote = document.createElement("div");
        if (localStorage.getItem("willTaskFadeIn") == "no"){ // Checks whether the last task is a new one or not for the fade-in effect.
            taskNote.className = "taskNote";
        }
        else {
            if (i == taskArray.length-1){ // The last task is the newly made one, and thus it will fade in.
                taskNote.className = "taskNote fade-in";
            }
            else {
                taskNote.className = "taskNote";
            }
        }

        removeTaskVisuals (taskArray, taskArea, taskNote, i);
        postANewTaskWithTheNewUserInput (taskArray, taskNote, i);
        taskArea.appendChild(taskNote);
    }
    localStorage.setItem("willTaskFadeIn", "no"); // Resets the fade-in following variable, in order to avoid non-new tasks having the
    // fading-in effect.
    localStorage.setItem("taskArray", JSON.stringify(taskArray)); // Places the task array into the local storage.
}

function removeTaskVisuals (taskArray, taskArea, taskNote, index) {
    
    let deleteOption = document.createElement("span"); // Task deletion button - gylphicon.
    deleteOption.id = taskArray[index].id;
    deleteOption.className = "deleteOption glyphicon glyphicon-remove";
    deleteOption.onclick = function () {
        removeTask(taskArray, taskArea, this.id); // Task deleting function.
    };

    taskNote.appendChild(deleteOption);
}

function postANewTaskWithTheNewUserInput (taskArray, taskNote, i) {
    let fixedDateOrder = taskArray[i].date.split('-'); // Used to display the date according to Europe's date format.

    let taskInfo = document.createElement("div"); // Displays the task's details.
    taskInfo.className = "taskInfo font-weight-bolder";
    taskInfo.innerHTML = taskArray[i].details;
    let taskDateAndTime = document.createElement("div"); // Displays the task's date and time.
    taskDateAndTime.className = "taskDateAndTime font-weight-bolder";
    taskDateAndTime.innerHTML = fixedDateOrder[2] + "-" + fixedDateOrder[1] + "-" + fixedDateOrder[0] + "<br>" + taskArray[i].time;

    taskNote.appendChild(taskInfo);
    taskNote.appendChild(taskDateAndTime);
}

function removeTask (taskArray, taskArea, currentTaskID) { // Removes the appropriate task.
    for (let i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == currentTaskID) {
            taskArray.splice(i, 1);
        }
    }
    displayTasks(taskArray, taskArea); // Displays the tasks without the one that got deleted.
}