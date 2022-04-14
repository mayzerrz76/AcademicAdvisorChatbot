// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
document.cookie = "username=;Max-Age=-1;"

function checkPassword() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("userPswd").value;
    // replace check with any pair from database
    $.get("/login", { user:username, pass:password }, function(output){
        if (output == ""){
            document.getElementById("demo").innerHTML = "Incorrect username or password";
        }
        else {
            document.cookie = "username=" + username
            window.location.pathname = "/chatbot";
        }
    });

}

function newAccount(){
    window.location.pathname = "/newUser";
}