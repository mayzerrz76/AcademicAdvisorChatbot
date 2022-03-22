import json
import pymongo

CONNECTION_STRING = "mongodb+srv://chatSyr:mongoChat%40300@cluster0.4mduz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    #'mongodb+srv://chatSyr:mongoChat%40300@cluster0.4mduz.mongodb.net/test?authSource=admin&replicaSet=atlas-3m5p4x-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
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
        if not self.is_valid_password(password):
            raise ValueError('Password does not meet requirements')
        self.password = password
        self.courses_taken = courses_taken
        self.degree_programs = degree_programs
        self.planner = planner
        self.courses_registered = courses_registered

        if courses_taken is None:
            self.courses_taken = []
        if degree_programs is None:
            self.degree_programs = []
        if planner is None:
            self.planner = []
        if courses_registered is None:
            self.courses_registered = []

        self.update_database()

    def update_database(self):
        UserAccount.USERS.delete_one({'username': self.username})
        UserAccount.USERS.insert_one(self.__dict__)

    @staticmethod
    def from_mongo(document):
        """

        :param document: a string representing a username
        :return:
        """
        if type(document) is dict:
            return (lambda d: UserAccount(**d, from_mongo=True))(document)
        elif type(document) is str:
            full_document = UserAccount.USERS.find({'username': document}).next()
            return UserAccount.from_mongo(full_document)
        else:
            raise TypeError('document must be a dict or a string')

    def authenticate(self, password_attempt: str):
        return password_attempt == self.password

    @staticmethod
    def is_valid_password(password):
        # TODO Add password requirement logic here
        return True
