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
const State = { MAIN:0, PREREQ:1, SCHED:2, DESC:3, PROF:4, LOGOUT:5, COURSE:6, CHANGEPROF:7, PROGREQ:8 }
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
            document.cookie = "username=;expires=-1"
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
            botText = "view course pre reqs menu  'WORK TODO";
            botSays(botText);
            menustate = State.PREREQ;
            botSays(["Which course would you like to know about?","or type 0 to return to main menu"]);
            break;
        // handles the building schedule case
        case "3":
            botText = "build schedule menu  'WORK TODO";
            botSays(botText);
            menustate = State.SCHED;
            botSays(["Input a course?", "or type 0 to return to main menu"]);
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
            });
            menustate = State.PROF;
            break;
        // handles all other bad input
        default:
            botText = "please enter a whole number between 0 and 5";
            botSays(botText);
            writeMainMenu();
            break;
    }
}
// --------------------------------- MAIN MENU END ----------------------------------

// ---------------------------------PROGRAM REQUIREMENTS FUNCTIONS START----------------------------------

// SHOULD output the users program requirements (specific to user?)
async function getProgReq(user_name){
    $.get("/prog", {user:user_name}, function(aiText){
        aiText = aiText.split('\n');
        botSays(aiText);
        //menustate = State.PROGREQ;
        botSays("Enter input to return to main menu...");
        //progReqControlFlow();
        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
    });
}

async function printWait(howLong){
    await sleep(howLong);
}

function progReqControlFlow(){
    userInput = getUserText();
    userSays(userInput);
    writeMainMenu();
    menustate = State.MAIN;
}


// ----------------------------- PROGRAM REQUIREMENTS FUNCTIONS END -------------------------------------

// ----------------------------- USER PROFILE FUNCTIONS START -------------------------------------
function editProfile(){
    var course = getUserText();
    userSays(course);

    switch(course) {
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            default:
                $.get("/validate-course", {crs: course}, function(aiText) {
                    if (aiText == "False") {
                        botSays(["I didn't quite get that--","Choose a course or type 0 to return to main menu"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
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
        case "0":
            menustate = State.PROF;
            botSays("Choose a course to add to your course taken or type 0 to return to main menu");
            break;
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
        default:
            botSays("I didn't quite get that--");
            botSays(["0) Choose a different course","1) Add course to schedule","2) Remove course from schedule"]);
            DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
            break;
    }
}
// ----------------------------- USER PROFILE FUNCTIONS END -------------------------------------

// ----------------------------- BUILD SCHEDULE FUNCTIONS START -------------------------------------
function scheduleControlFlow(){
    var course = getUserText();
    userSays(course);
    if ( course.length <= 7 ) {
        switch(course)
        {
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            default:
                $.get("/course", { crs:course, type:"schedule", user:"cookie"}, function(aiText) {
                    if (aiText == "bad input") {
                        botSays("I didn't quite get that--");
                        botSays(["Input a course?", "or type 0 to return to main menu"]);
                    }
                    else {
                        menustate = State.COURSE;
                        botSays(aiText);
                        globalCourse = course;
                        botSays(["0) choose a different course", "1) get course time", "2) add course to schedule", "3) remove course from schedule"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
                });
                break;
        }
    }
    else {
    botSays("I didn't quite get that--");
    botSays(["Input a course?", "or type 0 to return to main menu"]);
    }
}


function scheduleChoices(course){
    var action = getUserText();
    userSays(action);
    switch(action)
    {
        case "0":
            menustate = State.SCHED;
            botSays(["Input a course?", "or type 0 to return to main menu"]);
            break;
        case "1":
            $.get("/schedule", {crs:course, type:"query", user:"cookie"}, function(aiText){
                botSays(aiText);
                botSays(["0) choose a different course", "1) get course time", "2) add course to schedule", "3) remove course from schedule"]);
            });
            break;
        case "2":
            $.get("/schedule", {crs:course, type:"add", user:"cookie"}, function(aiText){
                botSays(aiText);
                botSays(["0) choose a different course", "1) get course time", "2) add course to schedule", "3) remove course from schedule"]);
            });
            break;
        case "3":
            $.get("/schedule", {crs:course, type:"remove", user:"cookie"}, function(aiText){
                botSays(aiText);
                botSays(["0) choose a different course", "1) get course time", "2) add course to schedule", "3) remove course from schedule"]);
            });
            break;
        default:
            botSays("I didn't quite get that--");
            botSays(["0) choose a different course", "1) get course time", "2) add course to schedule", "3) remove course from schedule"]);
            break;
    }
}
// ----------------------------- BUILD SCHEDULE FUNCTIONS END -------------------------------------

// ------------------------------ COURSE DESCRIPTION FUNCTION START -------------------------------
function courseDescription() {
    var course = getUserText();
    userSays(course);
    switch(course) {
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            default:
                $.get("/validate-course", {crs: course}, function(aiText) {
                    if (aiText == "False") {
                        botSays(["I didn't quite get that--","Choose a course or type 0 to return to main menu"]);
                        DivElmnt.scrollTop = DivElmnt.scrollHeight - DivElmnt.offsetHeight+100;
                    }
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
function getCourse(category) {
    var course = getUserText();
    userSays(course);
    if (course.length <= 7) {
        switch(course){
            case "0":
                menustate = State.MAIN;
                writeMainMenu();
                break;
            default:
                $.get("/course", { crs:course, type:category, user:"cookie"}, function(aiText) {
                    if (aiText == "bad input") {
                        botSays(["I didn't quite get that--","Which course would you like to know about?", "or type 0 to return to main menu"]);
                    }
                    else{
                        botSays(aiText);
                        botSays(["Would you like to know about another course?", "or type 0 to return to main menu" ]);
                    }

                });
                break;
        }
    }
    else {
        botSays(["I didn't quite get that--", "Which course would you like to know about?", "or type 0 to return to main menu" ]);
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
                    getCourse("prereqs");
                    break;
                case State.SCHED:
                    scheduleControlFlow();
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
                case State.PROGREQ:
                    progReqControlFlow();
                    break;
                default:
                    userSays("ahhhh");
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
    var opening = ["HOW CAN I HELP YOU?","-------------------","0) Logout","1) List Program Reqs.","2) View Course Pre-Reqs.","3) Build Schedule","4) View Class Description","5) View My Profile"];
    botSays(opening);
}
// ------------------------------------ NAVIGATION CONTROL END ------------------------

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
