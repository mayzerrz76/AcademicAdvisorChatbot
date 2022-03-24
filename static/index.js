// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


// allows for control flow to work
var lol = true;
// Creates the opening options for the chatbot!
function makeOpening() {
    var opening = ["HOW CAN I HELP YOU?", "1) List Program Reqs.", "2) View Course Pre-Reqs.", "3) Build Schedule", "4) View Class Description", "5) View My Profile"];
    for (let i = 0; i < opening.length; i++ ) {
        botSays(opening[i]);
    }
}

function controlFlow() {
    var rawText = $("#textInput").val();
    userSays(rawText);
    $.get("/main", { num:rawText}, function(aiText){
        botSays(aiText);
        if (aiText != "please enter a whole number between 0 and 5") {
            lol = false;
        }
        else {
            makeOpening();
        }
    });

}


function getUserText() {
    // Retrieves the value from the #textinput html object
    var rawText = $("#textInput").val();
    userSays(rawText);
    // finds the /test route, passes rawText as parameter msg, executes generic function with output as param
    $.get("/test", { msg:rawText, date:"3/22/22" }, function(aiText) {
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

function botSays(str) {
        // Creates an object from function output with bordering
        var botHtml = '<p class="botText"><span>' + str + '</span></p>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
}
makeOpening();

// wait for enter key press
$("#textInput").keypress(function(e) {
    if (e.which === 13) {
        if (lol == true){
            controlFlow();
        }
        else
            getUserText();

    }
});
