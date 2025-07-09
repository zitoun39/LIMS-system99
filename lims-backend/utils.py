import csv
from models import db, Sample
import tempfile

def import_csv(file_storage):
    stream = file_storage.stream.read().decode("utf-8").splitlines()
    reader = csv.DictReader(stream)
    count = 0
    for row in reader:
        sample = Sample(**row)
        db.session.add(sample)
        count += 1
    db.session.commit()
    return count

def export_csv():
    samples = Sample.query.all()
    fd, path = tempfile.mkstemp(suffix=".csv")
    with open(path, "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow([c.name for c in Sample.__table__.columns])
        for s in samples:
            writer.writerow([getattr(s, c.name) for c in Sample.__table__.columns])
    return path