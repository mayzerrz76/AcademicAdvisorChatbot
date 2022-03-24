// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var mainbool = true;
var progreqbool = false;
var prereqbool = false;
var schedbool = false;
var descbool = false;
var profbool = false;



// Creates the opening options for the chatbot!
function makeOpening() {
    var opening = ["HOW CAN I HELP YOU?", "0) Logout", "1) List Program Reqs.", "2) View Course Pre-Reqs.", "3) Build Schedule", "4) View Class Description", "5) View My Profile"];
    for (let i = 0; i < opening.length; i++ ) {
        botSays(opening[i]);
    }
}

makeOpening();

function controlFlow() {
    var rawText = $("#textInput").val();
    var botText = "hi";
    userSays(rawText);
    switch(rawText)
    {
        case "0":
            botText = "logout";
            botSays(botText);
            mainbool = false;
            break;
        case "1":
            botText = "list program reqs menu";
            botSays(botText);
            mainbool = false;
            progreqbool = true;
            break;
        case "2":
            botText = "view course pre reqs menu";
            botSays(botText);
            mainbool = false;
            prereqbool = true;
            break;
        case "3":
            botText = "build schedule menu";
            botSays(botText);
            mainbool = false;
            schedbool = false;
            break;
        case "4":
            botText = "view class description menu";
            botSays(botText);
            mainbool = false;
            descbool = true;
            classDes();
            break;
        case "5":
            botText = "view my profile menu";
            botSays(botText);
            mainbool = false;
            profbool = true;
            break;
        default:
            botText = "please enter a whole number between 0 and 5";
            botSays(botText);
            botSays("");
            makeOpening();
            break;
    }


}

function classDes(){
    botSays("Which course would you like to know about?");
    botSays("or type 0 to return to main menu");
}

function getUserText() {
    // Retrieves the value from the #textinput html object
    userSays($("#textInput").val());
    // finds the /test route, passes rawText as parameter msg, executes generic function with output as param
    $.get("/test", { msg:rawTex, date:"3/22/22" }, function(aiText) {
            botSays(aiText);
    });
}
function userSays(str) {
    // Creates an object from the user input with bordering
    var userHtml = '<p class="userText"><span>' + str + '</span></p>';
    // Place user input into chatbox
    $("#chatbox").append(userHtml);
    // Remove previous entry from input box
    $("#textInput").val("");
}

function getCourse() {
    var course = $("#textInput").val();
    userSays(course);
    switch(course){
        case "0":
            mainbool = true;
            descbool = false;
            makeOpening();
            break;
        default:
            botSays("Description of " + course);
            break;
    }
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
        if (mainbool == true) {
            controlFlow();
        }
        else if (descbool == true) {
            getCourse();
        }
        else
            getUserText();

    }
});
}

// wait for enter key press
onEnter();


