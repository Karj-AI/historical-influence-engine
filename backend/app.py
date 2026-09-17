import os
from flask import Flask, jsonify, request
from flask_cors import CORS

from models import db, Country, Person

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)  # frontend runs on a different port during development

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'historical.db')}"
db.init_app(app)


@app.route("/countries")
def get_countries():
    countries = Country.query.all()
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "region": c.region,
            "continent": c.continent,
            "latitude": c.latitude,
            "longitude": c.longitude,
        }
        for c in countries
    ])


@app.route("/people")
def get_people():
    country_id = request.args.get("country_id", type=int)
    year = request.args.get("year", type=int, default=2025)

    if not country_id:
        return jsonify({"error": "country_id is required"}), 400

    # A person "counts" toward a given year if their influence had already
    # started by that point (era_start <= year). Historical influence is
    # treated as persisting after death, so era_end doesn't exclude them.
    people = (
        Person.query
        .filter(Person.country_id == country_id, Person.era_start <= year)
        .all()
    )

    ranked = sorted(people, key=lambda p: p.influence_score, reverse=True)[:10]

    return jsonify([p.to_summary_dict() for p in ranked])


@app.route("/search")
def search_people():
    query = request.args.get("q", "").strip()
    if not query or len(query) < 2:
        return jsonify([])

    matches = (
        Person.query
        .filter(Person.name.ilike(f"%{query}%"))
        .limit(10)
        .all()
    )

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "country_id": p.country_id,
            "country_name": p.country.name,
            "continent": p.country.continent,
            "latitude": p.country.latitude,
            "longitude": p.country.longitude,
            "era_start": p.era_start,
        }
        for p in matches
    ])


@app.route("/person/<int:person_id>")
def get_person(person_id):
    person = Person.query.get_or_404(person_id)
    return jsonify(person.to_detail_dict())


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5050)