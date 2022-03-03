import json
from flask import Flask, render_template, request
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer, ListTrainer
import spacy
from pymongo import MongoClient

# I (Anthony) needed this fix
# https://stackoverflow.com/questions/58569361/attributeerror-module-time-has-no-attribute-clock-in-python-3-8
import time
time.clock = time.time

app = Flask(__name__)

english_bot = ChatBot('Chatterbot')
# trainer = ChatterBotCorpusTrainer(english_bot)
# trainer.train("chatterbot.corpus.english")

trainer = ListTrainer(english_bot)
for _ in range(1000):
    trainer.train([
        "What classes are required for the BS in Computer Science?",
        "CIS 453 and CIS 473.",
    ])

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    return str(english_bot.get_response(userText))

if __name__ == '__main__':
    app.run()
