from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .user import User

class Album(db.Model):
    __tablename__ = 'albums'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(250), nullable=False)
    genre = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


    user = db.relationship("User", back_populates='albums')
    reviews = db.relationship('Review', back_populates='album', cascade="all, delete-orphan")
    likes = db.relationship('Like', back_populates='album', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'genre': self.genre,
            'description': self.description,
            'release_date':self.release_date.strftime("%B %d %Y"),
            'image_url': self.image_url
        }
