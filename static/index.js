// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


const State = { MAIN:0, PROGREQ:1, PREREQ:2, SCHED:3, DESC:4, PROF:5, LOGOUT:6 }
var menustate = State.MAIN;

// Creates the opening options for the chatbot!
function makeOpening() {
    var opening = ["HOW CAN I HELP YOU?", "0) Logout", "1) List Program Reqs.", "2) View Course Pre-Reqs.", "3) Build Schedule", "4) View Class Description", "5) View My Profile"];
    for (let i = 0; i < opening.length; i++ ) {
        botSays(opening[i]);
    }
}

makeOpening();

function controlFlow() {
    var rawText = getUserText();
    userSays(rawText);
    switch(rawText)
    {
        case "0":
            botText = "logout";
            botSays(botText);
            menustate = State.LOGOUT
            break;
        case "1":
            $.get("/prog", {user:"cookie"}, function(aiText){
                botSays(aiText);
                botSays("");
                makeOpening();
            });
            break;
        case "2":
            botText = "view course pre reqs menu";
            botSays(botText);
            menustate = State.PREREQ;
            classPre();
            break;
        case "3":
            botText = "build schedule menu";
            botSays(botText);
            menustate = State.SCHED;
            break;
        case "4":
            botText = "view course description menu";
            botSays(botText);
            menustate = State.DESC;
            classDes();
            break;
        case "5":
            botText = "view my profile menu";
            botSays(botText);
            menustate = State.PROF;
            break;
        default:
            botText = "please enter a whole number between 0 and 5";
            botSays(botText);
            botSays("");
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


function classPre(){
    botSays("Which course would you like to know about?");
    botSays("or type 0 to return to main menu");
}

function classDes(){
    botSays("Which course would you like to know about?");
    botSays("or type 0 to return to main menu");
}

function getUserText() {
    // Retrieves the value from the #textinput html object
    return $("#textInput").val();
}
function userSays(str) {
    // Creates an object from the user input with bordering
    var userHtml = '<p class="userText"><span>' + str + '</span></p>';
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
                $.get("/course", { crs:course, type:category}, function(aiText) {
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
    //botSays("un reachable");
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
        //else if (menustate == State.PROGREQ ){
           // getProgReq();
        //}
        else{
            userSays("ahhhh");
        }

    }
});
}

// wait for enter key press
onEnter();


