// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

function checkPassword() {
    var x = document.getElementById("userName").value;
    var y = document.getElementById("userPswd").value;
    // replace check with any pair from database
    $.get("/login", { user:x, pass:y }, function(output){
        document.getElementById("demo").innerHTML = output;
        $.get("/chatbot", {}, function(url){
        window.location.assign(url)
        });

    });
}