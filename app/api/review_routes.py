from flask import Blueprint
from flask_login import current_user, login_required

review_router = Blueprint('reviews', __name__)

@review_router.route('/current')
@login_required
def get_user_reviews():
    return {
        "user reviewed albums": [review.album.to_dict() for review in current_user.reviews]
    }
