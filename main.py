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


# loads the new user page
@app.route("/newUser")
def new_user():

    return render_template("newuser.html")


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

        # This logic checks if each course has been completed and fills in the checkbox if so
        courses_taken = currentUser.courses_taken
        proReqs = db.Req.from_mongo(program)
        cores = proReqs.core_reqs
        for course in cores:
            course_code = ' '.join(course.split()[:2])
            line = '['
            if course_code in courses_taken:
                line += 'X'
            else:
                line += ' '
            line += '] ' + course
            proList.append(line)
        # print(str(proList))
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
        profile_view += ', '.join(current_user.degree_programs)
    else:
        profile_view += 'none'
    profile_view += '\nCourses taken: '
    if current_user.courses_taken:
        profile_view += ', '.join(current_user.courses_taken)
    else:
        profile_view += 'none'
    profile_view += '\nPlanner: '
    if current_user.planner:
        profile_view += ', '.join(current_user.planner)
    else:
        profile_view += 'none'

    return profile_view


@app.route('/view-schedule')
def view_schedule():
    username = request.args.get('user')
    current_user = db.UserAccount.from_mongo(username)
    schedule_view = 'Courses in planner: '
    if current_user.planner:
        schedule_view += ', '.join(current_user.planner)
    else:
        schedule_view += 'none'

    return schedule_view


@app.route("/validate-course")
def validate_course():
    course = request.args.get('crs')
    return str(internal_validate_course(course))


def internal_validate_course(course):
    if len(course) != 7 or len(course.split()) != 2:
        return False
    subject_code, course_num = course.split()
    matching_courses = db.Course.COURSES.find({'subject_code': subject_code, 'course_num': course_num})
    if len(list(matching_courses)):
        return True
    return False


@app.route('/course-taken')
def course_taken():
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


@app.route('/course-planner')
def course_planner():
    username = request.args.get('user')
    course = request.args.get('crs')
    operation = request.args.get('operation')

    this_user = db.UserAccount.from_mongo(username)
    message = ''
    if operation == 'add':
        if course not in this_user.planner:
            this_user.planner.append(course)
            this_user.planner = sorted(this_user.planner)
            message = course + ' successfully added.'
        else:
            message = course + ' already listed in planner.'
    elif operation == 'remove':
        if course in this_user.planner:
            this_user.planner.remove(course)
            message = course + ' successfully removed.'
        else:
            message = course + ' not in planner.'
    this_user.update_database()
    return message


@app.route('/course-description')
def course_description():
    course = request.args.get('crs')
    subject_code, course_num = course.split()
    message = ''

    these_courses = db.Course.COURSES.find({'subject_code': subject_code, 'course_num': course_num})
    these_courses = [db.Course.from_mongo(i) for i in these_courses]
    message += these_courses[0].description + '\n'
    message += 'The following section(s) of this course are being offered:\n'
    for this_course in these_courses:
        this_message = ''
        this_message += this_course.section + '\t'
        this_message += this_course.days + '\t'
        this_message += this_course.time + '\t'
        this_message += this_course.instructor + '\t'
        this_message += this_course.location
        message += this_message + '\n'
    return message


@app.route('/course-prereqs')
def course_prereqs():
    course = request.args.get('crs')
    subject_code, course_num = course.split()
    this_course = db.Course.COURSES.find({'subject_code': subject_code, 'course_num': course_num}).next()
    this_course = db.Course.from_mongo(this_course)
    prereqs = this_course.prereqs
    if prereqs:
        return ', '.join(prereqs)
    else:
        return 'none'


@app.route('/create-user')
def create_user():
    username = request.args.get('user')
    password = request.args.get('pass')
    program = request.args.get('prog').strip()
    courses = request.args.get('crs').strip()

    if username == '':
        return "Username must not be empty."

    try:
        this_user = db.UserAccount(username, password)
    except KeyError:
        return "Username already taken."
    except ValueError:
        return "Password does not meet requirements."

    matching_programs = list(db.Req.REQS.find({'prog_name': program}))
    if not len(matching_programs):
        db.UserAccount.USERS.delete_one({'username': username})
        return "Invalid program."
    this_program = matching_programs[0]

    if courses == '':
        this_courses = []
    else:
        this_courses = [i.strip() for i in courses.split(',')]
        for course in this_courses:
            if not internal_validate_course(course):
                db.UserAccount.USERS.delete_one({'username': username})
                return "Invalid course(s)."

    this_user.degree_programs = [program]
    this_user.courses_taken = this_courses
    this_user.update_database()
    return "Success!"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=443, ssl_context='adhoc')
