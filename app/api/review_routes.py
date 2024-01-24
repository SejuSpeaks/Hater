from flask import Blueprint, request
from datetime import datetime
from flask_login import current_user, login_required
from app.models import Review, db

review_router = Blueprint('reviews', __name__)

@review_router.route('/current')
@login_required
def get_user_reviews():
    return {
        "user reviewed albums": [{
            "artist": review.album.user.username,
            "title": review.album.title,
            "rating": review.rating,
            "image_url": review.album.image_url,
         } for review in current_user.reviews]
    }

@review_router.route('/<int:id>', methods=["PUT"])
@login_required
def edit_review(id):
    review = Review.query.get(id)

    # Returns a 404 error if the album with the ID in the URL could not be found
    if not review:
        error = "Review with the specified ID could not be found"
        return error, 404

    # Returns a 403 unauthorized error if the review does not belong to the current user
    if not review.user_id == current_user.id:
        error = "You are unauthorized to edit this review"
        return error, 403

    # Collects the user's updates to the review and changes the review attributes accordingly
    new_review_text = request.json.get("review_text", None)
    new_rating = request.json.get("rating", None)

    if new_rating > 5 or new_rating < 1:
        error = "Please submit a rating between 1 and 5"
        return error, 400

    if not new_review_text == None:
        review.review_text = new_review_text

    if not new_rating == None:
        review.rating = new_rating

    # Updates the review's updated_at if any changes have been applied
    if new_rating or new_review_text:
        review.updated_at = datetime.utcnow()

    # Adds the review changes to the database
    db.session.commit()

    # Retrieves and returns the updated review
    updated_review = Review.query.get(id)
    return updated_review.to_dict()

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
