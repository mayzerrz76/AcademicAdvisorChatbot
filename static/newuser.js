// Import JQuery Directly
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

function createUser() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("userPswd").value;
    var password2 = document.getElementById("userPswdConfirm").value;
    var program = document.getElementById("userProgram").value;
    var courses = document.getElementById("coursesTaken").value;

    // GET function to a new backend method which creates account goes here
    window.location.pathname = "/";

    //IF ACCOUNT CREATION IS SUCCESSFUL, TOGGLE BACK TO LOGIN SCREEN

    //IF UNSUCCESSFUL, OUTPUT WHICH ERROR IN DEMO
    }