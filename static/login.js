// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
var random;
function checkPassword() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("userPswd").value;
    // replace check with any pair from database
    $.get("/login", { user:username, pass:password }, function(output){
        if (output == "correct login!"){
            window.location.pathname = "/chatbot";
        }
        else {
            document.getElementById("demo").innerHTML = output;
        }
    });

}