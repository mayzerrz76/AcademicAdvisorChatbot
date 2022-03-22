import json
import pymongo

CONNECTION_STRING = 'mongodb+srv://chatSyr:mongoChat%40300@cluster0.4mduz.mongodb.net/test?authSource=admin&replicaSet=atlas-3m5p4x-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
DATABASE = pymongo.MongoClient(CONNECTION_STRING)['chatbot']


class UserAccount:
    USERS = DATABASE['users']

    def __init__(self, username: str, password: str, courses_taken=None, degree_programs=None,
                 planner=None, courses_registered=None, from_mongo=False, _id=None):

        # If this is a new database entry, validate the username
        if not from_mongo:
            identical_users = self.USERS.find({'username': username})
            if len(list(identical_users)):
                raise KeyError('A user with that username already exists')

        self.username = username

        # For validating password requirements - e.g. at least 8 characters, number, upper + lower case
        # Currently unused
        if not self.is_valid_password(password):
            raise ValueError('Password does not meet requirements')
        self.password = password

        self.courses_taken = courses_taken
        self.degree_programs = degree_programs
        self.planner = planner
        self.courses_registered = courses_registered

        # These are like this because Python doesn't like mutable default values for arguments
        if self.courses_taken is None:
            self.courses_taken = []
        if self.degree_programs is None:
            self.degree_programs = []
        if self.planner is None:
            self.planner = []
        if self.courses_registered is None:
            self.courses_registered = []

        # Add the entry to the database
        self.update_database()

    def update_database(self):
        UserAccount.USERS.delete_one({'username': self.username})
        UserAccount.USERS.insert_one(self.__dict__)

    @staticmethod
    def from_mongo(document):
        if type(document) is dict:
            return (lambda d: UserAccount(**d, from_mongo=True))(document)
        elif type(document) is str:
            try:
                full_document = UserAccount.USERS.find({'username': document}).next()
            except StopIteration:
                raise KeyError('User does not exist')
            return UserAccount.from_mongo(full_document)
        else:
            raise TypeError('document must be a dict or a string')

    def authenticate(self, password_attempt: str):
        return password_attempt == self.password

    @staticmethod
    def is_valid_password(password):
        # TODO Add password requirement logic here
        return True


class Course:
    COURSES = DATABASE['courses']

    def __init__(self, course_id: str, course_num: str, subject_code: str, section: str, location: str, instructor: str,
                 days: str, times: str, semester: str, description: str, prereqs=None, coreqs=None, from_mongo=False, _id=None):

        # If this is a new database entry, validate the username
        if not from_mongo:
            identical_users = self.COURSES.find({'course_id': course_id})
            if len(list(identical_users)):
                raise KeyError('A user with that username already exists')

        self.course_id = course_id
        self.course_num = course_num
        self.subject_code = subject_code
        self.section = section
        self.location = location
        self.instructor = instructor
        self.days = days
        self.times = times
        self.semester = semester
        self.description = description
        self.prereqs = prereqs
        self.coreqs = coreqs

        if self.prereqs is None:
            self.prereqs = []
        if self.coreqs is None:
            self.coreqs = []

        self.update_database()

    def update_database(self):
        Course.COURSES.delete_one({'course_id': self.course_id})
        Course.COURSES.insert_one(self.__dict__)

    @staticmethod
    def from_mongo(document):
        if type(document) is dict:
            return (lambda d: Course(**d, from_mongo=True))(document)
        elif type(document) is str:
            try:
                full_document = Course.COURSES.find({'course_id': document}).next()
            except StopIteration:
                raise KeyError('Course does not exist')
            return Course.from_mongo(full_document)
        else:
            raise TypeError('document must be a dict or a string')
