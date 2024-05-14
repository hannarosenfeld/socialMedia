from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class RoomForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=1, max=30)])
    description = StringField('Description', validators=[Length(max=130)])