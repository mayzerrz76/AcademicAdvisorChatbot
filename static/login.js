function checkPassword() {
    var x = document.getElementById("userName").value;
    var y = document.getElementById("userPswd").value;
    // replace check with any pair from database
    if ((x == "u") && (y == "p")) {
        // replace google url with chatbot framework
        //window.location.href = "../templates/index.html"

    }
    else {
        document.getElementById("demo").innerHTML = "incorrect username or password";
    }
}