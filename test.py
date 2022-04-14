import chatbot.dbobjects as db

"""
TESTING PROCEDURES

-- LOGIN PROCEDURES --

Input: Attempt random character to username and password boxes
Output: User prompted with "incorrect username or password" message

Input: Correct username (user guy), incorrect password 
Output: User prompted with "incorrect username or password" message

Input: Correct username (user guy), password from DIFFERENT user account 
Output: User prompted with "incorrect username or password" message

Input: Repeated spamming of enter button
Output: User prompted with "incorrect username or password" message

Input: Correct username and password entry and enter button pressed
Output: Navigates to the chatbot main page

-- NEW ACCOUNT PROCEDURES -- 

(Besides the item listed, assume all other data is appropriate)

Input: Name already in database 
Output: User prompted with "Username already taken" message

Input: Passwords Don't Match
Output: User prompted with "Passwords do not match" message

Input: Invalid Program added 
Output: User prompted with "Invalid program" message

Input: illegitimate courses added 
Output: User prompted with #######

Input: password doesnt match length requirements 
Output: User prompted with "Password does not meet requirements" 

Input: clicking return to login screen with any/all information filled out correctly/incorrectly
Output: User is returned to login screen and no new account is created or attempted to be created

Input: create an account is clicked without any entries filled in 
Output: 

-- MAIN PAGE TESTING -- 

Input: Invalid text input (in any menu or submenu)
Output: (in submenus) Prompts user with "I didn't quite get that --" message and repeats the menu option 
        (in mainmenu) Prompts user with "Please enter a number 1 through 6 to select a menu, or press 0 to logout" message


LAST MINUTE BUG FIXES:

--  new user bugs -- 
- ~anything~ is a course FIXED 
- empty string as a password  FIXED
- add a course required FIXED
- can't toggle back to login  
- returning to the login page without logging out allows for reentry to the main page without login 




"""

## OLD TESTING SOFTWARE USED TO CREATE ACCOUNTS AND COURSES

# db.Course.COURSES.delete_many({'course_id': '12345'})
"""
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
"""

# reconstructed_courseA = db.Course.from_mongo('12345')
# print(reconstructed_courseA.credits)
# print(reconstructed_courseA.time)

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