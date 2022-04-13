// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Instantiate global variables and switch-variable State
const State = { MAIN:0, PREREQ:1, SCHED:2, DESC:3, PROF:4, LOGOUT:5, COURSE:6, CHANGEPROF:7, PROGREQ:8, CONTACT:9, CHANGESCHED:11}
var menustate = State.MAIN;


var username = document.cookie.split('=')[1];

var globalCourse;

// ------- RUN THE PROGRAM -------
//Initial message
writeMainMenu();
// wait for enter key press
onEnter();
// -------- END PROGRAM --------

// --------------------------------- MAIN MENU START ----------------------------------
function controlFlow() {
    // retrieve user text for main menu
    var rawText = getUserText();
    userSays(rawText);
    switch(rawText)
    {
        // handles the logout case redirecting back to the login screen
        case "0":
            botText = "Logging out...";
            botSays(botText);
            menustate = State.LOGOUT;
            document.cookie = "username=;Max-Age=-1;"
            window.location.pathname = "/";
            break;
        // handles the program requirements case
        case "1":
            menustate = State.PROGREQ;
            getProgReq(username);
            //menustate = State.MAIN;
            break;
        // handles the course prerequisite case
        case "2":
//            botText = "view course pre reqs menu  'WORK TODO";
//            botSays(botText);
            menustate = State.PREREQ;
            botSays(["Which course would you like to know the prerequisites of?","or type 0 to return to main menu"]);
            break;
        // handles the building schedule case
        case "3":
            $.get("/view-schedule", {user:username}, function(scheduleView){
                botSays(scheduleView.split('\n'));
                botSays("Choose a course to add or remove from your planner or type 0 to return to main menu");
                DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
            });
            menustate = State.SCHED;
            break;
        // handles the course description case
        case "4":
            menustate = State.DESC;
            botSays(["Enter a course to view information or type 0 to return to main menu"]);
            break;
        // handles the viewing profile case
        case "5":
            $.get("/view-profile", {user:username}, function(profileView){
                botSays(profileView.split('\n'));
                botSays("Choose a course to add or remove from courses taken or type 0 to return to main menu");
                DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
            });
            menustate = State.PROF;
            break;
        case "6":
            botSays(["List of important contact info", "DPS (315)-443-2224", "SUICIDE HOTLINE (800)-273-8255", "SEXUAL ASSAULT HOTLINE (315)-443-8000", "SU COVID OFFICE (315)-443-6180", "BARNES CENTER (315)-443-8000", "FINANCIAL SUPPORT (315)-443-1513", "DISABILITY RESOURCES (315)-443-4498", "MOHAN (315)-443-2322", "INFORMATION TECHNOLOGY (315)-443-4498", "INTERNATIONAL SERVICES (315)-443-2457"]);
            botSays("Enter input to return to main menu...");
            menustate = State.CONTACT;
            break;
        // handles all other bad input
        default:
            botText = "Please enter a number 0 through 7 to select a menu.";
            botSays(botText);
            writeMainMenu();
            break;
    }
}
// --------------------------------- MAIN MENU END ----------------------------------

// --------------------------------CONTACT INFO FUNCTION START----------

// waits for user input before returning to main menu
function contactInfoControlFlow(){
    userInput = getUserText();
    userSays(userInput);
    writeMainMenu();
    menustate = State.MAIN;
}
// --------------------------------CONTACT INFO FUNCTION END------------


// ---------------------------------PROGRAM REQUIREMENTS FUNCTIONS START----------------------------------

// retrieves program requirements
async function getProgReq(user_name){
    $.get("/prog", {user:user_name}, function(aiText){
        aiText = aiText.split('\n');
        botSays(aiText);
        botSays("Enter input to return to main menu...");
        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
    });
}

// waiting function
async function printWait(howLong){
    await sleep(howLong);
}

// waits for user input before returning to main menu
function progReqControlFlow(){
    userInput = getUserText();
    userSays(userInput);
    writeMainMenu();
    menustate = State.MAIN;
}


// ----------------------------- PROGRAM REQUIREMENTS FUNCTIONS END -------------------------------------

// ----------------------------- USER PROFILE FUNCTIONS START -------------------------------------

// profile submenu control flow
function editProfile(){
    var course = getUserText();
    userSays(course);

    // Make user input case insensitive
    course = course.toUpperCase();

    switch(course) {
            // return to main menu
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            // attempt to get course
            default:
                $.get("/validate-course", {crs: course}, function(aiText) {
                    // error if non valid course name is given
                    if (aiText == "False") {
                        botSays(["I didn't quite get that--","Choose a course or type 0 to return to main menu"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
                    // navigation to new submenu when course exists
                    else {
                        menustate = State.CHANGEPROF;
                        globalCourse = course;
                        botSays(["0) Choose a different course","1) Add course to schedule","2) Remove course from schedule"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
                });
                break;
    }
}


function profileControlFlow(course){

    var action = getUserText();
    userSays(action);
    switch(action)
    {
        // return to user profile main submenu
        case "0":
            menustate = State.PROF;
            botSays("Choose a course to add or remove from course taken or type 0 to return to main menu");
            break;
        // adds course to lists of courses
        case "1":
            $.get("/course-taken", {crs:globalCourse, operation:"add", user:username}, function(aiText){
                botSays(aiText);
                $.get("/view-profile", {user:username}, function(profileView){
                    botSays(profileView.split('\n'));
                    botSays("Choose a course or type 0 to return to main menu");
                    DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                });
            });
            menustate = State.PROF;
            break;
        // removes course from lists of courses
        case "2":
            $.get("/course-taken", {crs:globalCourse, operation:"remove", user:username}, function(aiText){
                botSays(aiText);
                $.get("/view-profile", {user:username}, function(profileView){
                    botSays(profileView.split('\n'));
                    botSays("Choose a course or type 0 to return to main menu");
                    DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                });
            });
            menustate = State.PROF;
            break;
        // error messages for random input
        default:
            botSays("I didn't quite get that--");
            botSays(["0) Choose a different course","1) Add course to courses taken","2) Remove course from courses taken"]);
            DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
            break;
    }
}
// ----------------------------- USER PROFILE FUNCTIONS END -------------------------------------

// ----------------------------- BUILD SCHEDULE FUNCTIONS START -------------------------------------

// accept user input of a course
function editSchedule(){
    var course = getUserText();
    userSays(course);

    // Make user input case insensitive
    course = course.toUpperCase();

    switch(course) {
            // return to main menu page
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            default:
                $.get("/validate-course", {crs: course}, function(aiText) {
                    // given a invalid course
                    if (aiText == "False") {
                        botSays(["I didn't quite get that--","Choose a course or type 0 to return to main menu"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
                    // given a valid course
                    else {
                        menustate = State.CHANGESCHED;
                        globalCourse = course;
                        botSays(["0) Choose a different course","1) Add course to planner","2) Remove course from planner"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
                });
                break;
    }
}
// fucntion for adding or removing from planner
function scheduleControlFlow(course){
    var action = getUserText();
    userSays(action);
    switch(action)
    {
        // return to schedule main menu
        case "0":
            menustate = State.SCHED;
            botSays("Choose a course to add to your planner or type 0 to return to main menu");
            break;
        // allow for users to add courses
        case "1":
            $.get("/course-planner", {crs:globalCourse, operation:"add", user:username}, function(aiText){
                botSays(aiText);
                $.get("/view-schedule", {user:username}, function(profileView){
                    botSays(profileView.split('\n'));
                    botSays("Choose a course or type 0 to return to main menu");
                    DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                });
            });
            menustate = State.SCHED;
            break;
        // allow for users to remove courses
        case "2":
            $.get("/course-planner", {crs:globalCourse, operation:"remove", user:username}, function(aiText){
                botSays(aiText);
                $.get("/view-schedule", {user:username}, function(profileView){
                    botSays(profileView.split('\n'));
                    botSays("Choose a course or type 0 to return to main menu");
                    DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                });
            });
            menustate = State.SCHED;
            break;
        // random input handler
        default:
            botSays("I didn't quite get that--");
            botSays(["0) Choose a different course","1) Add course to planner","2) Remove course from planner"]);
            DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
            break;
    }
}
// ----------------------------- BUILD SCHEDULE FUNCTIONS END -------------------------------------

// ------------------------------ COURSE DESCRIPTION FUNCTION START -------------------------------

// lets the user input a course to get course description
function courseDescription() {
    var course = getUserText();
    userSays(course);

    // Make user input case insensitive
    course = course.toUpperCase();

    switch(course) {
            // return to main menu
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            default:
                $.get("/validate-course", {crs: course}, function(aiText) {
                    // invalid course entry handler
                    if (aiText == "False") {
                        botSays(["I didn't quite get that--","Choose a course or type 0 to return to main menu"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
                    // valid course entry handler
                    else {
                        $.get('/course-description', {crs: course}, function(description) {
                            botSays([course + ":", description]);
                            botSays("Enter another course or type 0 to return to main menu");
                            DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                        });
                    }
                });
                break;
    }
}
// ------------------------------ COURSE DESCRIPTION FUNCTION END ---------------------------------

// ----------------------------- COURSE ACTION FUNCTION START -------------------------------------

// prompts user for course to get prereqs for
function getCoursePrereqs() {
    var course = getUserText();
    userSays(course);

    // Make user input case insensitive
    course = course.toUpperCase();

    switch(course) {
            // return to main menu
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            default:
                $.get("/validate-course", {crs: course}, function(aiText) {
                    // invalid course handler
                    if (aiText == "False") {
                        botSays(["I didn't quite get that--","Choose a course or type 0 to return to main menu"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
                    // valid course handler, prints pre-reqs
                    else {
                        $.get('/course-prereqs', {crs: course}, function(prereqs) {
                            botSays([course + " has prerequisite(s):", prereqs]);
                            botSays("Enter another course or type 0 to return to main menu");
                            DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                        });
                    }
                });
                break;
    }
}


// ------------------------------------ PRINTING TO SCREEN FUNCTIONS START ------------------------

// Retrieves the value from the #textinput html object, this function just improves readability
function getUserText() {
    return $("#textInput").val();
}

// Prints the user's inputs to the chatbox
function userSays(str) {
    // Creates an object from the user input with bordering
    var userHtml = '<p class="userText sb2"><span>' + str + '</span></p>';
    // Place user input into chatbox
    $("#chatbox").append(userHtml);
    // Remove previous entry from input box
    $("#textInput").val("");
}

// Prints the bot's outputs to the chatbox, can accept both strings and arrays of strings
function botSays(strs) {
    // have the bot print a single line
    if (typeof strs == "string")
    {
        // Creates an object from function output with bordering
        var botHtml = '';
        var inside = '<span>' + strs + '</span>';
        botHtml = '<div class="botMsg sb1"><p class="botText">' + inside + '</p></div>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
    }
    // Creates an object from function output with bordering
    // have the bot print multiple lines
    else {
        var botHtml = '';
        var inside = '<span>';
        var i;
        for (i = 0; i < strs.length; i++ ) {
            if (i == (strs.length -1)){
                inside = inside + strs[i] + '</span>';
            }
            else {
                inside = inside + strs[i] + '<br>';
            }
        }

        //
        botHtml = '<div class="botMsg sb1"><p class="botText">' + inside + '</p></div>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
    }
}
// ------------------------------------ PRINTING TO SCREEN FUNCTIONS END ------------------------

// ------------------------------------ NAVIGATION CONTROL START ------------------------

// waits for keystrokes. The nervous system of the entire chatbot
function onEnter(){
    // waits for enter to be pressed "getting" user input
    $("#textInput").keypress(function(e) {
        if (e.which === 13) {
            // handles which submenu to toggle to based on the State
            switch(menustate){
                case State.MAIN:
                    controlFlow();
                    break;
                case State.PREREQ:
                    getCoursePrereqs();
                    break;
                case State.SCHED:
                    editSchedule();
                    break;
                case State.COURSE:
                    scheduleChoices(globalCourse);
                    break;
                case State.PROF:
                    editProfile();
                    break;
                case State.DESC:
                    courseDescription();
                    break;
                case State.CHANGEPROF:
                    profileControlFlow(globalCourse);
                    break;
                case State.CHANGESCHED:
                    scheduleControlFlow(globalCourse);
                    break;
                case State.PROGREQ:
                    progReqControlFlow();
                    break;
                case State.CONTACT:
                    contactInfoControlFlow();
                    break;
                default:
                    window.location.pathname = "/";
            }
        }
    });
}

// writes the opening options for the chatbot!
function writeMainMenu() {
    if (document.cookie.split('=')[1] == '' ) {
        botSays("You are not logged in. Redirecting to login page...");
        window.location.pathname = "/";
    }
    var opening = ["HOW CAN I HELP YOU?","-------------------","0) Logout","1) List Program Reqs.","2) View Course Pre-Reqs.","3) Build Planner","4) View Class Description","5) View My Profile", "6) Important Contact Info"];
    botSays(opening);
}
// ------------------------------------ NAVIGATION CONTROL END ------------------------

// -------------------------- RETURN TO LOGIN PAGE FUNCTION -----------------------//
function returnToLogin() {
    botText = "Logging out...";
    botSays(botText);
    menustate = State.LOGOUT;
    document.cookie = "username=;Max-Age=-1;";
    window.location.pathname = "/";
}
// -------------------------- RETURN TO LOGIN PAGE FUNCTION -----------------------//

// ----------------------------- SCROLLING FUNCTIONALITY START -------------------------------------
//Add a function to initialize the auto-scroll feature on page load
window.onload = function() {
  scrollDiv_init();
};
// This 5 is a magic number don't touch it, JK, I don't have time to explain in this comment how/why it works, but it does
ScrollRate = 5;

//Initializes our chatbox div in index.html to run certain functions when the mouse is either
//over the chat box(i.e., actively scrolling through), or off the chat box
function scrollDiv_init() {
  //Get the chatbox div element we want to add auto-scroll to
  DivElmnt = document.getElementById('chatbox');
  //attach function to run when mouse is hovering over chatbox div
  DivElmnt.onmouseover = pauseDiv;
  //attach function to run when mouse is scrolling on chatbox, even if the browser is not the active application highlighted
  DivElmnt.onscroll = pauseDiv;
  //attach function to run when mouse is not-hovering over chatbox div
  //DivElmnt.onmouseout = resumeDiv;
  // Messing with this to try and get chatbot to scroll to the bottom
  // if they scrolled up, after a message is sent and the mouse is still hovering over
  // the chatbox it won't scroll to bottom until you move mouse out of the chatbox, trying to fix
  InpElmnt = document.getElementById('textInput');
  InpElmnt.onkeydown = scrollDiv;
  InpElmnt.onkeyup = scrollDiv;
  DivElmnt.scrollTop = 0;
  ScrollInterval = setInterval('scrollDiv()', ScrollRate);
}
//function to scroll chatbox element to the bottom
function scrollDiv() {
    if (event.keyCode ==13){
        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
    }
}
//function to pause scrolling on chatbox element to the bottom
//this happens when the mouse pointer is in the chatbox
function pauseDiv() {
  clearInterval(ScrollInterval);
}
//calls the scroll div above, w the scroll rate
function resumeDiv() {
  ScrollInterval = setInterval('scrollDiv()', ScrollRate);
}
// ------------------------------------------ SCROLLING FUNCTIONALITY END ----------------------
