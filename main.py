import chatbot.dbobjects as db
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    # allows for interacting with login page
    # return render_template("login.html")
    # allow for interacting with chatbot page
    return render_template("index.html")


@app.route("/test")
def echo_user_response():
    userText = request.args.get('msg')
    userDate = request.args.get('date')
    return str(userText) + " echo"


@app.route("/login")
def validate_login():
    username = request.args.get('user')
    password = request.args.get('pass')
    try:
        currentUser = db.UserAccount.from_mongo(username)
    except KeyError:
        return "incorrect username and password"
    if currentUser.authenticate(password):
        return "correct login!"
    else:
        return "incorrect username and password"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
