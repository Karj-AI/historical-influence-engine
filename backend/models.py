from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Country(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(100), nullable=False)
    continent = db.Column(db.String(50), nullable=False)
    # Rough center point, kept for potential future use
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    people = db.relationship("Person", backref="country", lazy=True)


# Self-referential many-to-many: "who influenced whom"
influence_link = db.Table(
    "influence_link",
    db.Column("influencer_id", db.Integer, db.ForeignKey("person.id"), primary_key=True),
    db.Column("influenced_id", db.Integer, db.ForeignKey("person.id"), primary_key=True),
)


class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey("country.id"), nullable=False)

    era_start = db.Column(db.Integer, nullable=False)  # negative = BC
    era_end = db.Column(db.Integer, nullable=True)      # null = still influential/unknown death

    description = db.Column(db.Text, nullable=False)

    # Influence score breakdown - simple placeholder weighting system.
    # Each is 0-100; total influence_score is a weighted combination.
    global_impact = db.Column(db.Integer, nullable=False)
    longevity = db.Column(db.Integer, nullable=False)
    cross_region_impact = db.Column(db.Integer, nullable=False)

    @property
    def influence_score(self):
        return round(
            self.global_impact * 0.5
            + self.longevity * 0.3
            + self.cross_region_impact * 0.2
        )

    influenced = db.relationship(
        "Person",
        secondary=influence_link,
        primaryjoin=(id == influence_link.c.influencer_id),
        secondaryjoin=(id == influence_link.c.influenced_id),
        backref="influenced_by",
    )

    def to_summary_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "country_name": self.country.name,
            "era_start": self.era_start,
            "era_end": self.era_end,
            "description": self.description,
            "influence_score": self.influence_score,
        }

    def to_detail_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "country_id": self.country_id,
            "country_name": self.country.name,
            "era_start": self.era_start,
            "era_end": self.era_end,
            "description": self.description,
            "influence_score": self.influence_score,
            "breakdown": {
                "global_impact": self.global_impact,
                "longevity": self.longevity,
                "cross_region_impact": self.cross_region_impact,
            },
            "influenced": [p.name for p in self.influenced],
            "influenced_by": [p.name for p in self.influenced_by],
        }