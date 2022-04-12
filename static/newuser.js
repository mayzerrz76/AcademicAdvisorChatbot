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

    if (password != password2) {
        document.getElementById("demo").innerHTML = "Passwords do not match."
    }

    else {
        // GET function to a new backend method which creates account goes here
        $.get("/create-user", { user:username, pass:password, prog:program, crs:courses }, function(output){
            if (output == "Success!"){
                document.cookie = "username=" + username
                window.location.pathname = "/chatbot";
            }
            else {
                document.getElementById("demo").innerHTML = output;
            }
        });
    }
}