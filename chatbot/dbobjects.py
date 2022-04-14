from enum import Enum
import json
import pymongo
import certifi

CONNECTION_STRING = "mongodb+srv://chatSyr:mongoChat%40300@cluster0.4mduz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
DATABASE = pymongo.MongoClient(CONNECTION_STRING, tlsCAFile=certifi.where())['chatbot']


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
        # TODO Add more password requirement logic here
        return len(password) >= 8


class Course:
    COURSES = DATABASE['courses']

    def __init__(self, course_id: str, subject_code: str, course_num: str, credits: int, section: str, location: str, instructor: str,
                 days: str, time: str, semester: str, title: str, description: str, prereqs=None, coreqs=None, from_mongo=False, _id=None):

        # If this is a new database entry, validate the course id
        if not from_mongo:
            identical_users = self.COURSES.find({'course_id': course_id})
            if len(list(identical_users)):
                raise KeyError('A course with that course id already exists')

        self.course_id = course_id
        self.subject_code = subject_code
        self.course_num = course_num
        self.credits = credits
        self.section = section
        self.title = title
        self.location = location
        self.instructor = instructor
        self.days = days
        self.time = time
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


class ReqType(Enum):
    BASE = 1
    AND = 2
    OR = 3


class Req:
    REQS = DATABASE['progReqs']

    def __init__(self, prog_name: str, core_reqs=None, _id=None):
        self.prog_name = prog_name
        self.core_reqs = core_reqs
        if self.core_reqs is None:
            self.core_reqs = []

        self.update_database()

    def update_database(self):
        Req.REQS.delete_one({'prog_name': self.prog_name})
        Req.REQS.insert_one(self.__dict__)


    @staticmethod
    def from_mongo(document):
        if type(document) is dict:
            return (lambda d: Req(**d))(document)
        elif type(document) is str:
            try:
                full_document = Req.REQS.find({'prog_name': document}).next()
            except StopIteration:
                raise KeyError('Program does not exist')
            return Req.from_mongo(full_document)
        else:
            raise TypeError('document must be a dict or a string')

    # Implement something here for checking if the requirement is fulfilled
    # (or if not, how many credits remain)
    def credits_remaining(self):
        pass
