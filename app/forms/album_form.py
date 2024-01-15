from flask_wtf import FlaskForm
from wtforms import StringField, DateField
from wtforms.validators import DataRequired

class AlbumForm(FlaskForm):
    title = StringField("Title", validators=[DataRequired()])
    genre = StringField("Genre", validators=[DataRequired()])
    description = StringField("Description", validators=[DataRequired()])
    release_date = DateField("Release Date", validators=[DataRequired()])
    image_url = StringField("Album Image", validators=[DataRequired()])
