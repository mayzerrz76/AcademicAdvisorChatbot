// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


const State = { MAIN:0, PROGREQ:1, PREREQ:2, SCHED:3, DESC:4, PROF:5, LOGOUT:6, COURSE:7, CHANGEPROF:8 }
var menustate = State.MAIN;
var globalCourse = "definitely not null";

// Creates the opening options for the chatbot!
function makeOpening() {
    var opening = ["HOW CAN I HELP YOU?","-------------------","0) Logout","1) List Program Reqs.","2) View Course Pre-Reqs.","3) Build Schedule","4) View Class Description","5) View My Profile"];
    //for (let i = 0; i < opening.length; i++ ) {
        //botSays(opening[i]);
    botMenu(opening);
    //}
}

makeOpening();

function controlFlow() {
    var rawText = getUserText();
    userSays(rawText);
    switch(rawText)
    {
        case "0":
            botText = "logout";
            botMenuStr(botText);
            menustate = "logout";
            break;
        case "1":
            botText = "list program reqs menu  'WORK TODO";
            botMenuStr(botText);
            menustate = "progreq";
            getProgReq();
            break;
        case "2":
            botText = "view course pre reqs menu  'WORK TODO";
            botMenuStr(botText);
            menustate = "prereq";
            classPre();
            break;
        case "3":
            botText = "build schedule menu  'WORK TODO";
            botMenuStr(botText);
            menustate = "sched";
            break;
        case "4":
            botText = "view course description menu  'WORK TODO";
            botMenuStr(botText);
            menustate = "desc";
            classDes();
            break;
        case "5":
            botText = "view my profile menu  'WORK TODO";
            botMenuStr(botText);
            menustate = "prof";
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
        botSays(aiText);
    });
    botSays("");
    menustate = State.MAIN;
    makeOpening();
}

function viewProf(){
    botSays("Choose a course")
    botSays("or type 0 to return to main menu")
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
                        botSays("I didn't quite get that--");
                        viewProf();
                    }
                    else {
                        menustate = State.CHANGEPROF;
                        botSays(aiText);
                        globalCourse = course;
                        chooseAction2();
                    }
                });
                break;
        }
    }
    else {
    botSays("I didn't quite get that--");
    viewProf();
    }
}


function chooseAction2(){
    botSays("0) choose a different course");
    botSays("1) add course to schedule");
    botSays("2) remove course from schedule");
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
                botSays(aiText);
                chooseAction2();
            });
            break;
        case "2":
            // change this to its own path!
            $.get("/schedule", {crs:course, type:"remove", user:"cookie"}, function(aiText){
                botSays(aiText);
                chooseAction2();
            });
            break;
        default:
            botSays("I didn't quite get that--");
            chooseAction2();
            break;
    }
}



function buildSched(){
    botSays("Input a course?");
    botSays("or type 0 to return to main menu");
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
                        botSays("I didn't quite get that--");
                        buildSched();
                    }
                    else {
                        menustate = State.COURSE;
                        botSays(aiText);
                        globalCourse = course;
                        chooseAction();
                    }
                });
                break;
        }
    }
    else {
    botSays("I didn't quite get that--");
    buildSched();
    }
}


function chooseAction(){
    botSays("0) choose a different course");
    botSays("1) get course time");
    botSays("2) add course to schedule");
    botSays("3) remove course from schedule");
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
                botSays(aiText);
                chooseAction();
            });
            break;
        case "2":
            $.get("/schedule", {crs:course, type:"add", user:"cookie"}, function(aiText){
                botSays(aiText);
                chooseAction();
            });
            break;
        case "3":
            $.get("/schedule", {crs:course, type:"remove", user:"cookie"}, function(aiText){
                botSays(aiText);
                chooseAction();
            });
            break;
        default:
            botSays("I didn't quite get that--");
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
                        botSays("I didn't quite get that--")
                        botSays("Which course would you like to know about?");
                        botSays("or type 0 to return to main menu");
                    }
                    else{
                        botSays(aiText);
                        botSays("Would you like to know about another course?");
                        botSays("or type 0 to return to main menu");
                    }

                });
                break;
        }
    }
    else {
        botSays("I didn't quite get that--")
        botSays("Which course would you like to know about?");
        botSays("or type 0 to return to main menu");
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


function botSays(str) {
        // Creates an object from function output with bordering
        var botHtml = '<p class="botText"><span>' + str + '</span></p>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
}


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
        else{
            userSays("ahhhh");
        }


    }
});
}

// wait for enter key press
onEnter();


