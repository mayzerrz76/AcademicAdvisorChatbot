import chatbot.dbobjects as db
import chatbot.dbprogreqs as reqDB
from flask import Flask, render_template, request

app = Flask(__name__)

# loads the login page
@app.route("/")
def home():
    # allows for interacting with login page
    # return render_template("login.html")
    # allow for interacting with chatbot page
    return render_template("login.html")

# loads the chatbot page
@app.route("/chatbot")
def landing_page():

    return render_template("index.html")

# allows for editing a user schedule object
@app.route("/schedule")
def build_schedule():
    course = request.args.get('crs')
    action = request.args.get('type')
    username = request.args.get('user')
    if action == "add":
        #mongo db stuff for adding to here
        return "schedule with " + str(course) + " added!"
    elif action == "remove":
        # mongo db stuff for removing here
        return str(course) + " removed from schedule"
    elif action == "query":
        # mongo db stuff for getting information
        return str(course) + " date & time"

# allows for retrieving course information
@app.route("/course")
def get_course_info():
    course = request.args.get('crs')
    info = request.args.get('type')
    username = request.args.get('user')
    # impliment logic flow for which data to get depending on the call from the database
    # if course DNE in mongo return bad input
    # return "bad input
    if info == "prereqs":
        # heres where the mongo response should go
        return "course prereqs for " + str(course) + " are: "
    elif info == "description":
        # heres where the mongo response should go
        return "course description for " + str(course) + " is: "
    elif info == "schedule":
        # this is technically not needed
        return "valid course!"
    else:
        return "this shouldn't be accessible!"

# allows for retrieving program requirements
@app.route("/prog")
def get_program_requirements():
    username = request.args.get('user')
    # heres where the database should be queried for program requirements
    return "your program requirements are: " + str(username)

# appropriate login procedure
@app.route("/login")
def validate_login():
    username = request.args.get('user')
    password = request.args.get('pass')
    try:
        currentUser = db.UserAccount.from_mongo(username)
    except KeyError:
        return ""
    if currentUser.authenticate(password):
        return username
    else:
        return ""


# gets Program requirements for CIS program?
@app.route("/getCISReqs")
def cis_prog_reqs():
    cisReqDB = reqDB.CisReqs.get_database()
    compScience = ["Computer Science Requirements:","------------------------------"]
    #collectionSize = cisReqDB.count()

    print(cisReqDB.find())
    return tuple(compScience)

@app.route("/view-profile")
def view_profile():
    username = request.args.get('user')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
