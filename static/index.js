// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var menustate = "main";



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

function getProgReq(){
    var course = getUserText();
    userSays(course);
    $.get("/prog", {user:cookie}, function(aiText){
        botSays(aiText);
    });
    botSays("");
    mainbool = true;
    progreqbool = false;
    makeOpening();
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
                menustate = "main";
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
        if (menustate == "main") {
            controlFlow();
        }
        else if (menustate == "prereq"){
            getCourse("prereqs");
            //botSays("leave loop?")
        }
        else if (menustate == "desc") {
            getCourse("description");
        }
        else if (menustate == "progreq"){
            getProgReq();
        }
        else{
            getUserText();
        }

    }
});
}

// wait for enter key press
onEnter();


