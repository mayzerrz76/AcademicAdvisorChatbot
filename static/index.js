// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


const State = { MAIN:0, PROGREQ:1, PREREQ:2, SCHED:3, DESC:4, PROF:5, LOGOUT:6, COURSE:7, CHANGEPROF:8, WHICHPROG:9 }
var menustate = State.MAIN;
var globalCourse = "definitely not null";

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

// Creates the opening options for the chatbot!
function makeOpening() {
    if (document.cookie.split('=')[1] == '' ) {
        botMenuStr("You are not logged in. Redirecting to login page...");
        window.location.pathname = "/";
    }
    var opening = ["HOW CAN I HELP YOU?","-------------------","0) Logout","1) List Program Reqs.","2) View Course Pre-Reqs.","3) Build Schedule","4) View Class Description","5) View My Profile"];
    botMenu(opening);
}

//Initial message
makeOpening();

function controlFlow() {
    var rawText = getUserText();
    userSays(rawText);
    switch(rawText)
    {
        case "0":
            botText = "Logging out...";
            botMenuStr(botText);
            menustate = State.LOGOUT;
            document.cookie = "username=;expires=-1"
            window.location.pathname = "/";
            break;
        case "1":
            whichProgram();
            botText = "****get choice from user and fetch prog info from DB 'WORK TODO****";
            botMenuStr(botText);
            menustate = State.PROGREQ;
            break;
        case "2":
            botText = "view course pre reqs menu  'WORK TODO";
            botMenuStr(botText);
            menustate = State.PREREQ;
            classPre();
            break;
        case "3":
            botText = "build schedule menu  'WORK TODO";
            botMenuStr(botText);
            menustate = State.SCHED;
            buildSched();
            break;
        case "4":
            botText = "view course description menu  'WORK TODO";
            botMenuStr(botText);
            menustate = State.DESC;
            classDes();
            break;
        case "5":
            botText = "Your profile:";
            botMenuStr(botText);
            menustate = State.PROF;
            viewProf();
            break;
        default:
            botText = "please enter a whole number between 0 and 5";
            botMenuStr(botText);
            makeOpening();
            break;
    }
}

function getProgReq(cookie){
    $.get("/prog", {user:cookie}, function(aiText){
        botMenu([aiText,"----------"]);
    });
    menustate = State.MAIN;
    makeOpening();
}

function whichProgram() {
    botMenu(["Choose A Program:","-----------------","0.)Return to Main Menu","1.)Computer Science","2.)Mathematics" ]);
}

function progReqControlFlow() {
    var progMenuSelection = getUserText();
    userSays(progMenuSelection);
    switch(progMenuSelection)
    {
        case "0":
            abotText = "logout";
            botMenuStr(abotText);
            menustate = State.Main;
            makeOpening();
            break;
        case "1":
            abotText = "****fetch CIS prog info from DB  'WORK TODO****";
            botMenuStr(abotText);
            $.get("/getCISReqs");

            menustate = State.MAIN;
            break;
        case "2":
            abotText = "****fetch MAT prog info from DB  'WORK TODO****";
            botMenuStr(abotText);
            menustate = State.MAIN;
            break;
        default:
            abotText = "Please enter a valid menu selection! (1-2)";
            botMenuStr(abotText);
            whichProgram();
            break;
    }

}

function viewProf(){
    botMenu(["Choose a course or type 0 to return to main menu"])
}

function editProfile(){
    var course = getUserText();
    userSays(course);
    if ( course.length <= 7 ) {
        switch(course)
        {
            case "0":
                menustate = State.MAIN;
                makeOpening();
                break;
            default:
                $.get("/course", { crs:course, type:"schedule", user:"cookie"}, function(aiText) {
                    if (aiText == "bad input") {
                        botMenuStr("I didn't quite get that--");
                        viewProf();
                    }
                    else {
                        menustate = State.CHANGEPROF;
                        botMenuStr(aiText);
                        globalCourse = course;
                        chooseAction2();
                    }
                });
                break;
        }
    }
    else {
    botMenuStr("I didn't quite get that--");
    viewProf();
    }
}


function chooseAction2(){
    botMenu(["0) choose a different course","1) add course to schedule","2) remove course from schedule"]);
    //botSays("0) choose a different course");
    //botSays("1) add course to schedule");
    //botSays("2) remove course from schedule");
}

function changeProfile(course){
   var action = getUserText();
    userSays(action);
    switch(action)
    {
        case "0":
            menustate = State.PROF;
            viewProf();
            break;
        case "1":
            // change this to its own path!
            $.get("/schedule", {crs:course, type:"add", user:"cookie"}, function(aiText){
                botMenuStr(aiText);
                chooseAction2();
            });
            break;
        case "2":
            // change this to its own path!
            $.get("/schedule", {crs:course, type:"remove", user:"cookie"}, function(aiText){
                botMenuStr(aiText);
                chooseAction2();
            });
            break;
        default:
            botMenuStr("I didn't quite get that--");
            chooseAction2();
            break;
    }
}



function buildSched(){
    botMenu(["Input a course?", "or type 0 to return to main menu"]);
    //botSays("Input a course?");
    //botSays("or type 0 to return to main menu");
}


function makeSchedule(){
    var course = getUserText();
    userSays(course);
    if ( course.length <= 7 ) {
        switch(course)
        {
            case "0":
                menustate = State.MAIN;
                makeOpening();
                break;
            default:
                $.get("/course", { crs:course, type:"schedule", user:"cookie"}, function(aiText) {
                    if (aiText == "bad input") {
                        botMenuStr("I didn't quite get that--");
                        buildSched();
                    }
                    else {
                        menustate = State.COURSE;
                        botMenuStr(aiText);
                        globalCourse = course;
                        chooseAction();
                    }
                });
                break;
        }
    }
    else {
    botMenuStr("I didn't quite get that--");
    buildSched();
    }
}


function chooseAction(){
    botMenu(["0) choose a different course", "1) get course time", "2) add course to schedule", "3) remove course from schedule"]);
    /*botSays("0) choose a different course");
    botSays("1) get course time");
    botSays("2) add course to schedule");
    botSays("3) remove course from schedule");*/
}


function makeAction(course){
    var action = getUserText();
    userSays(action);
    switch(action)
    {
        case "0":
            menustate = State.SCHED;
            buildSched();
            break;
        case "1":
            $.get("/schedule", {crs:course, type:"query", user:"cookie"}, function(aiText){
                botMenuStr(aiText);
                chooseAction();
            });
            break;
        case "2":
            $.get("/schedule", {crs:course, type:"add", user:"cookie"}, function(aiText){
                botMenuStr(aiText);
                chooseAction();
            });
            break;
        case "3":
            $.get("/schedule", {crs:course, type:"remove", user:"cookie"}, function(aiText){
                botMenuStr(aiText);
                chooseAction();
            });
            break;
        default:
            botMenuStr("I didn't quite get that--");
            chooseAction();
            break;
    }
}


function classPre(){
    classPreStr = ["Which course would you like to know about?","or type 0 to return to main menu"];
    botMenu(classPreStr);
}


function classDes(){
    classDesStr = ["Which course would you like to know about?","or type 0 to return to main menu"];
    botMenu(classDesStr);
}


function getUserText() {
    // Retrieves the value from the #textinput html object
    return $("#textInput").val();
}


function userSays(str) {
    // Creates an object from the user input with bordering
    var userHtml = '<p class="userText sb2"><span>' + str + '</span></p>';
    // Place user input into chatbox
    $("#chatbox").append(userHtml);
    // Remove previous entry from input box
    $("#textInput").val("");
}


function getCourse(category) {
    var course = getUserText();
    userSays(course);
    if (course.length <= 7) {
        switch(course){
            case "0":
                menustate = State.MAIN;
                makeOpening();
                break;
            default:
                $.get("/course", { crs:course, type:category, user:"cookie"}, function(aiText) {
                    if (aiText == "bad input") {
                        botMenu(["I didn't quite get that--","Which course would you like to know about?", "or type 0 to return to main menu"]);
                        /*botSays("I didn't quite get that--")
                        botSays("Which course would you like to know about?");
                        botSays("or type 0 to return to main menu"); */
                    }
                    else{
                        botMenu([aiText, "Would you like to know about another course?", "or type 0 to return to main menu" ]);
                        /* botSays("Would you like to know about another course?");
                        botSays("or type 0 to return to main menu"); */
                    }

                });
                break;
        }
    }
    else {
        botMenu(["I didn't quite get that--", "Which course would you like to know about?", "or type 0 to return to main menu" ]);
        /*botSays("I didn't quite get that--")
        botSays("Which course would you like to know about?");
        botSays("or type 0 to return to main menu"); */
    }
}


function botMenu(strs) {
        // Creates an object from function output with bordering
        var botHtml = '';
        var inside = '<span>';
        var i = 0;
        for (i = 0; i < strs.length; i++ ) {
            if (i == (strs.length -1)){
                inside = inside + strs[i] + '</span>';
            }
            else {
                inside = inside + strs[i] + '<br>';
            }
        }

        //}
        botHtml = '<div class="botMsg sb1"><p class="botText">' + inside + '</p></div>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
}

function botMenuStr(str) {
        // Creates an object from function output with bordering
        var botHtml = '';
        var inside = '<span>' + str + '</span>';
        botHtml = '<div class="botMsg sb1"><p class="botText">' + inside + '</p></div>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
}


/*function botSays(str) {
        // Creates an object from function output with bordering
        var botHtml = '<p class="botText"><span>' + str + '</span></p>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
} */


function onEnter(){
    $("#textInput").keypress(function(e) {
    if (e.which === 13) {
        if (menustate == State.MAIN) {
            controlFlow();
        }
        else if (menustate == State.PREREQ){
            getCourse("prereqs");
        }
        else if (menustate == State.DESC) {
            getCourse("description");
        }
        else if (menustate == State.SCHED){
           makeSchedule();
        }
        else if (menustate == State.COURSE){
            makeAction(globalCourse);
        }
        else if (menustate == State.PROF){
            editProfile();
        }
        else if (menustate == State.CHANGEPROF){
            changeProfile(globalCourse);
        }
        else if (menustate == State.PROGREQ){
            progReqControlFlow();
        }
        else{
            userSays("ahhhh");
        }


    }
});
}

// wait for enter key press
onEnter();


