import chatbot.dbobjects as dbobjects

db = dbobjects.DATABASE
users = db['users']

# users.drop()
#
# Basic database object instantiation
# userA = dbobjects.UserAccount('Test User A', 'password')
# userB = dbobjects.UserAccount('Test User B', 'hunter2')
#
# print(userA.password)
# print(userB.username)

user_details = users.find()
for i in user_details:
    print(i)

print("Reconstructing users...")
reconstructed_userA = dbobjects.UserAccount.from_mongo('Test User A')
reconstructed_userB = dbobjects.UserAccount.from_mongo('Test User B')
reconstructed_userC = dbobjects.UserAccount.from_mongo('Test User C')

print(reconstructed_userA.username)
print(reconstructed_userB.password)

# print("Removing users...")
# users.delete_many({'username': 'Test User A'})
# users.delete_many({'username': 'Test User B'})

good_password = reconstructed_userA.authenticate('password')
bad_password = reconstructed_userB.authenticate('password')
print(good_password)
print(bad_password)
print(reconstructed_userA.password)
print(reconstructed_userB.password)
