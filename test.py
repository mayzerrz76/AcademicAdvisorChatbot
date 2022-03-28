import chatbot.dbobjects as db

# Course testing

db.Course.COURSES.delete_many({'course_id': '12345'})

courseA = db.Course(course_id='12345',
                    subject_code='TST',
                    course_num='123',
                    credits=3,
                    section='M001',
                    location='Building 000',
                    instructor='Professor',
                    days='MWF',
                    time='13:00-14:30',
                    semester='Spring 2022',
                    title='Example Course',
                    description='Course content',
                    prereqs=['ECS 101'],
                    coreqs=['TST 321']
                    )
print(courseA.course_id)
print(courseA.course_num)

reconstructed_courseA = db.Course.from_mongo('12345')
print(reconstructed_courseA.credits)
print(reconstructed_courseA.time)

# Old user testing stuff
"""
users.drop()

Basic database object instantiation
userA = dbobjects.UserAccount('Test User A', 'password')
userB = dbobjects.UserAccount('Test User B', 'hunter2')

print(userA.password)
print(userB.username)

user_details = users.find()
for i in user_details:
    print(i)

print("Reconstructing users...")
reconstructed_userA = dbobjects.UserAccount.from_mongo('Test User A')
reconstructed_userB = dbobjects.UserAccount.from_mongo('Test User B')
reconstructed_userC = dbobjects.UserAccount.from_mongo('Test User C')

print(reconstructed_userA.username)
print(reconstructed_userB.password)

print("Removing users...")
users.delete_many({'username': 'Test User A'})
users.delete_many({'username': 'Test User B'})

good_password = reconstructed_userA.authenticate('password')
bad_password = reconstructed_userB.authenticate('password')
print(good_password)
print(bad_password)
print(reconstructed_userA.password)
print(reconstructed_userB.password)
"""