from flask import Blueprint
from flask_login import current_user, login_required
from app.models import Review, db

review_router = Blueprint('reviews', __name__)

@review_router.route('/current')
@login_required
def get_user_reviews():
    return {
        "user reviewed albums": [review.album.to_dict() for review in current_user.reviews]
    }


@review_router.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    # Selects the review to be deleted
    doomed_review = Review.query.get(id)

    # Exits with status 404 if no review with the ID in the URL exists
    if not doomed_review:
        error = { "error": "No album with the specified ID exists" }
        return error, 404

    # Sends an error response if the review was not created by the current user:
    if not doomed_review.user_id == current_user.id:
        error = {"Error": "You are not authorized to delete this review."}
        return error, 401

    # Deletes the review and sends a success message upon completion
    else:
        db.session.delete(doomed_review)
        db.session.commit()
        success_msg = { "Success": "Review has been removed" }
        return success_msg, 200

@review_router.route('/<int:id>', methods=['PUT'])
# Exits with status 404 if no review with the ID in the URL exists
@review_router.errorhandler(404)
@login_required
def edit_review(id):
    # Selects the review to be edited
    review = Review.query.get(id)

    # Returns an error if the review was not created by the current user
    if not review.user_id == current_user.id:
        error = {"Error": "You are not authorized to edit this review."}
        return error, 401

    # Create a form to edit the review
        # this should be pre-populated with the info of the review found above

    # If the form passes validation:
        # Edit the selected review to contain the newly submitted info + new updated_at date
        # Also add it to the session
        # Return updated review with id, userId, albumId, reviewtext, rating, createdAt, and updatedAt

    # If it does not pass validation:
        # Return all errors generated with status 400, but don't clear error-free form fields
