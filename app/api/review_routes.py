from flask import Blueprint
from flask_login import current_user, login_required
from app.models import Review

review_router = Blueprint('reviews', __name__)

@review_router.route('/current')
@login_required
def get_user_reviews():
    return {
        "user reviewed albums": [review.album.to_dict() for review in current_user.reviews]
    }

@review_router.route('/<int:id>', methods=["PUT"])
@login_required
def edit_review(id):
    review = Review.query.get(id)
    return review.to_dict()

    # Returns a 404 error if the album with the ID in the URL could not be found
    if not review:
        error = "Review with the specified ID could not be found"
        return { error, 404 }

    if not review.user_id == current_user.id:
        error = "You are unauthorized to edit this review"
        return "unauthorized"
        return { error, 403 }

    return "made it through"

    # if it is,
        # if the review's user_id is NOT current_user.id:
            # unauthorized msg and 403
        # else:
    pass
