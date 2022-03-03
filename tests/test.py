import chatbot.dbobjects as dbobjects

db = dbobjects.DATABASE
users = db['users']

users.drop()

# Basic database object instantiation
userA = dbobjects.UserAccount('Test User A', 'password')
userB = dbobjects.UserAccount('Test User B', 'hunter2')

print(userA.password)
print(userB.username)

user_details = users.find()
for i in user_details:
    print(i)

print("Reconstructing users...")
reconstructed_userA = dbobjects.UserAccount.from_mongo('Test User A')
json_userB = dbobjects.UserAccount.USERS.find({'username': 'Test User A'}).next()
reconstructed_userB = dbobjects.UserAccount.from_mongo(json_userB)

print(reconstructed_userA.username)
print(reconstructed_userB.password)

print("Removing users...")
users.delete_many({'username': 'Test User A'})
users.delete_many({'username': 'Test User B'})

user_details = users.find()
for i in user_details:
    print(i)
