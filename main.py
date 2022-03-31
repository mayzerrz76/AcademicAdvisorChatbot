import chatbot.dbobjects as db
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
def get_program():
    username = request.args.get('user')
    # heres where the database should be queried for program requirements
    currentUser = db.UserAccount.from_mongo(username)
    programs = currentUser.degree_programs
    proList = []
    for program in programs:
        proList.append(program + " Requirements:")
        proList.append("---------------")
        proList.append("Core Requirements:")
        proReqs = db.Req.from_mongo(program)
        cores = proReqs.core_reqs
        for course in cores:
            proList.append(course)
        print(str(proList))
    return '\n'.join(proList)

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

@app.route("/view-profile")
def view_profile():
    username = request.args.get('user')
    current_user = db.UserAccount.from_mongo(username)

    profile_view = '--- Profile Info: ---\n'
    profile_view += 'Username: ' + current_user.username + '\n'
    profile_view += 'Degree programs: '
    if current_user.degree_programs:
        profile_view += ' '.join(current_user.degree_programs)
    else:
        profile_view += 'none'
    profile_view += '\nCourses taken: '
    if current_user.courses_taken:
        profile_view += ' '.join(current_user.courses_taken)
    else:
        profile_view += 'none'
    profile_view += '\nPlanner: '
    if current_user.planner:
        profile_view += ' '.join(current_user.planner)
    else:
        profile_view += 'none'

    return profile_view


@app.route("/validate-course")
def validate_course():
    course = request.args.get('crs')
    if len(course) != 7 or len(course.split()) != 2:
        return "False"
    subject_code, course_num = course.split()
    matching_courses = db.Course.COURSES.find({'subject_code': subject_code, 'course_num': course_num})
    if len(list(matching_courses)):
        return "True"
    return "False"


@app.route('/course-taken')
def add_course_taken():
    username = request.args.get('user')
    course = request.args.get('crs')
    operation = request.args.get('operation')

    this_user = db.UserAccount.from_mongo(username)
    message = ''
    if operation == 'add':
        if course not in this_user.courses_taken:
            this_user.courses_taken.append(course)
            this_user.courses_taken = sorted(this_user.courses_taken)
            message = course + ' successfully added.'
        else:
            message = course + ' already listed as taken.'
    elif operation == 'remove':
        if course in this_user.courses_taken:
            this_user.courses_taken.remove(course)
            message = course + ' successfully removed.'
        else:
            message = course + ' not listed as taken.'
    this_user.update_database()
    return message


@app.route('/course-description')
def course_description():
    course = request.args.get('crs')
    this_course = db.Course.COURSES.find({'subject_code': subject_code, 'course_num': course_num}).next()
    return this_course.description



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
