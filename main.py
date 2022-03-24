import chatbot.dbobjects as db
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    # allows for interacting with login page
    # return render_template("login.html")
    # allow for interacting with chatbot page
    return render_template("index.html")


@app.route("/test")
def echo_user_response():
    userText = request.args.get('msg')
    return str(userText) + " echo"

@app.route("/course")
def get_course_info():
    course = request.args.get('crs')
    info = request.args.get('type')
    # impliment logic flow for which data to get depending on the call from the database
    # if course dne in mongo return bad input
    # return "bad input
    if info == "prereqs":
        # heres where the mongo response should go
        return "course prereqs for " + str(course) + " are: "
    if info == "description":
        # heres where the mongo response should go
        return "course description for " + str(course) + " is: "
    else:
        return "this shouldn't be accessible!"

@app.route("/prog")
def get_program_requirements():
    username = request.args.get('user')
    # heres where the database should be queried for program requirements
    return "your program requirements are: " + str(username)

@app.route("/login")
def validate_login():
    username = request.args.get('user')
    password = request.args.get('pass')
    try:
        currentUser = db.UserAccount.from_mongo(username)
    except KeyError:
        return "incorrect username and password"
    if currentUser.authenticate(password):
        return "correct login!"
    else:
        return "incorrect username and password"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
