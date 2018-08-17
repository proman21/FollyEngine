from folly_api import db

class Project(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text())
    created_at = db.Column(db.DateTime())
    last_modified = db.Column(db.DateTime())
    owner_id = db.Column(db.Integer(), db.ForeignKey('user.id'). nullable=False)
