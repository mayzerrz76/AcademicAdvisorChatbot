import pymongo
import json
import mongo, dbobjects

# db = get_database()
my_user = UserAccount('test_user')
json_user = json.dumps(my_user.__dict__)
reconstructed_user = json.loads(json_user, object_hook=lambda d: dbobjects.UserAccount(**d))

print(json_user)
print(reconstructed_user.get_username())