from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired

class ReviewForm(FlaskForm):
    review_text = StringField(
        'Review', validators=[DataRequired()])
    rating = IntegerField('Rating', validators=[DataRequired()])
