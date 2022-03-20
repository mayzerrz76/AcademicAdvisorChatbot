import json
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def echo_user_response():
    userText = request.args.get('msg')
    return str(userText) + " echo"

if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=3000)
    app.run()