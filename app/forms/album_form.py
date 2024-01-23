from flask_wtf import FlaskForm
from wtforms import StringField, DateField
from wtforms.validators import InputRequired, Length, URL

class AlbumForm(FlaskForm):
    title = StringField("Title", validators=[InputRequired(message="Title is required"), Length(min=5, max=30, message="Title must be 5-30 characters.")])
    genre = StringField("Genre", validators=[InputRequired(message="Genre is required")])
    description = StringField("Description", validators=[InputRequired(message="Description is required"), Length(min=5, max=30, message="Description must be 10-200 characters.")])
    release_date = DateField("Release Date", validators=[InputRequired(message="Release Date is required")])
    image_url = StringField("Album Image", validators=[InputRequired(message="Album Image is required"), URL(message="Must be valid URL")])
