from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Sample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sample_id = db.Column(db.String(100))
    status = db.Column(db.String(50))
    category = db.Column(db.String(50))
    parent_id = db.Column(db.String(100))
    barcode = db.Column(db.String(100))
    custodian = db.Column(db.String(100))
    subject_id = db.Column(db.String(100))
    storage = db.Column(db.String(100))
    quantity = db.Column(db.Float)
    unit = db.Column(db.String(20))
    type = db.Column(db.String(50))

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}