from flask import Blueprint
from ..models import User
from flask_login import current_user

likes_router = Blueprint('likes', __name__)

@likes_router.route('/current')
def get_user_likes():
    print(current_user.likes)
    return {
        "user likes": [like.album.to_dict() for like in current_user.likes]
    }
