import json
import pymongo
import certifi


class CisReqs:

    @staticmethod
    def get_database():
        CONNECTION_STRING = "mongodb+srv://chatSyr:mongoChat%40300@cluster0.4mduz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
        DATABASEREQS = pymongo.MongoClient(CONNECTION_STRING, tlsCAFile=certifi.where())['SU_Program_Req']
        return DATABASEREQS['CIS_Reqs']

class MatReqs:
    @staticmethod
    def get_database():
        CONNECTION_STRING = "mongodb+srv://chatSyr:mongoChat%40300@cluster0.4mduz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
        DATABASEREQS = pymongo.MongoClient(CONNECTION_STRING, tlsCAFile=certifi.where())['SU_Program_Req']
        return DATABASEREQS['MAT_Reqs']

