// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

function getUserText() {
    // Retrieves the value from the #textinput html object
    var rawText = $("#textInput").val();
    // Creates an object from the user input with bordering
    var userHtml = '<p class="userText"><span>' + rawText + '</span></p>';
    // Place user input into chatbox
    $("#chatbox").append(userHtml);
    // Remove previous entry from input box
    $("#textInput").val("");

    // finds the /test route, passes rawText as parameter msg, executes generic function with output as param
    $.get("/test", { msg:rawText, date:"3/22/22" }, function(aiText) {
        // Creates an object from function output with bordering
        var botHtml = '<p class="botText"><span>' + aiText + '</span></p>';
        // Place ai output into chatbox
        $("#chatbox").append(botHtml);
    });
}

// wait for enter key press
$("#textInput").keypress(function(e) {
    if (e.which === 13) {
        getUserText();
}
});