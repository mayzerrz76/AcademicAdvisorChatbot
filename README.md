# Academic Advisor Chatbot
This chat bot will support Syracuse University's website to help students manage their curriculum choices.

BUILD INSTRUCTIONS 
---

Configure python interpreter to Python 3.8 (although other interpreters seem to work in a jiffy)

To gain access to the framework connecting the frontend javascript and backend python code, execute the terminal command: $ pip install Flask

In an IDE of your choice (we suggest PyCharm) run main.py and click the development server url which is printed to the python console. 

Enjoy. 

--- 

FILE NAVIGATION
---

    dir chatbot :

        dbobjects.py : contains database object constructors
            
    dir static :
        
        favicon.ico : icon for tab when opening in browser

        index.js : The main code for front-end 
            logical flow based on user input

        login.js : Front-end login procedures

        newuser.js : Front-end creating account procedures

        normalize.css : Allows for uniform display across 
            browser selection

        style.css : Standard webpage styling

        suCampus.jpeg : Image used on the login page

    dir templates :
        
        index.html : Webpage for the main chat bot 

        login.html : Webpage for the login procedure

        newuser.html : Webpage for new user procedure

    .gitignore : The gitignore we all know and love

    main.py : Backend code which ties it all together, 
        supported by the flask framework

    README.md : The file you're reading (hi there!)

    test.py : reminants of old testing procedures and
        descriptions of what ux/ui tests were ran on 
        the software

---

