from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    skill = db.Column(db.String(200))
    rate = db.Column(db.String(50))

@app.route("/add", methods=["POST"])
def add_client():
    data = request.json

    client = Client(
        name=data["name"],
        budget=data["budget"],
        currentAmount=data["currentAmount"]
    )

    db.session.add(client)
    db.session.commit()

    return jsonify({"message": "Worker added"})


@app.route("/clients", methods=["GET"])
def get_workers():
    clients = Client.query.all()

    result = []
    for w in clients:
        result.append({
            "name": w.name,
            "skill": w.skill,
            "rate": w.rate
        })

    return jsonify(result)



@app.route("/")
def home():
    return "Backend is running!"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
