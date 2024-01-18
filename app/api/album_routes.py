from flask import Blueprint, request, jsonify
from app.models import Album, Like, User, Review, db
from flask_login import current_user, login_required
from datetime import datetime
from sqlalchemy import or_, func
from app.forms import ReviewForm
# from app.api import validation_errors_to_error_messages

album_routes = Blueprint('albums', __name__)

@album_routes.route('/')
def get_albums():

    search_term = request.args.get('search')

    query = db.session.query(Album, func.avg(Review.rating).label('avg_rating')) \
             .outerjoin(Review, Album.id == Review.album_id) \
             .outerjoin(User, Album.user_id == User.id) \
             .add_entity(User)

    if search_term:
        query = query.filter(or_(Album.title.ilike(f'%{search_term}%'),
                                Album.genre.ilike(search_term),
                                User.username.ilike(search_term),
                                Album.description.ilike(f'%{search_term}%')))

    query = query.group_by(Album.id, User.id).limit(20)

    albums = query.all()

    albums_with_users = [
        {
            'id': album.id,
            'title': album.title,
            'artist': user.username,
            'genre': album.genre,
            'description': album.description,
            'release_date': album.release_date.strftime("%B %d %Y"),
            'image_url': album.image_url,
            'avg_rating': float(avg_rating) if avg_rating else ""

        } for album, avg_rating, user in albums]

    return {'albums': albums_with_users}

@album_routes.route('/current')
@login_required
def get_user_albums():
    return {
        "user albums": [album.to_dict() for album in current_user.albums]
    }

@album_routes.route('/<int:id>/likes')
@album_routes.errorhandler(404)
def album_likes(id):
    album = Album.query.get(id)

    if (not album):
        error = {"Error": "Invalid album id"}
        return error, 404

    album_likes = album.likes

    return {
        f"{album.title} likes": [{"user_id" : like.user.id} for like in album_likes]
    }


@album_routes.route('/<int:id>/likes', methods=['POST','DELETE'])
@album_routes.errorhandler(404)
def like_album(id):
    album = Album.query.get(id)

    query_for_like = Like.query.filter((Like.user_id == current_user.id) & (Like.album_id == id)).all()

    #LIKE IS ALREADY PRESENT SO WE DELETE IT
    if (query_for_like):
        delete_like = Like.query.filter((Like.user_id == current_user.id) & (Like.album_id == id)).delete()
        db.session.commit()
        return {"DELETE": "Album like removed"}

    #IF ALBUM IS NOT FOUND
    if(not album):
        error = {"Error": "Invalid album id"}
        return error, 404

    #ADDING LIKE
    like = Like(
        album_id=album.id,
        user_id=current_user.id
        )

    db.session.add(like)
    db.session.commit()

    return {"Success":"Album added to Likes"}


@album_routes.route('/<int:id>/reviews', methods=['POST'])
@login_required
def add_album_review(id):
    current_user_id = current_user.id
    album_id = id

    # Exits with status 404 if no album with the ID in the URL exists
    album = Album.query.get(id)
    if not album:
        error = { "error": "Album with the specified id does not exist" }
        return error, 404

    # Searches to see whether there is already a review of the album by the user
    existing_review = db.session.query(Review) \
        .filter(Review.user_id == current_user_id, Review.album_id == album_id) \
        .first()

    # If it exists, exits with status 403
    if existing_review:
        error = {"Error": "You have already reviewed this album."}
        return error, 403

    else:
            # Creates a new review and adds it to the database
            new_review_rating = request.json.get("rating", None)
            new_review_text = request.json.get("review_text", None)

            validation_errors = {}

            if new_review_rating is None:
                validation_errors["rating"] = "Please provide a rating"

            if new_review_text is None:
                validation_errors["review_text"] = "Please provide a review"

            if new_review_rating < 1 or new_review_rating > 5:
                validation_errors["rating"] = "Please provide a rating between 1 and 5"

            if validation_errors:
                return validation_errors, 400

            new_review = Review(
                user_id = current_user_id,
                album_id = album_id,
                review_text = new_review_text,
                rating = new_review_rating
            )

            db.session.add(new_review)
            db.session.commit()

            # Finds the newly created review to confirm sucess of operation
            created_review = db.session.query(Review) \
                .filter(Review.user_id == current_user_id, Review.album_id == album_id) \
                .first()

            return created_review.to_dict()


@album_routes.route('/<int:id>/reviews', methods=['GET'])
# Exits with status 404 if no album with the ID in the URL exists
@album_routes.errorhandler(404)
def get_album_reviews(id):
    # Queries the reviews by joining the Users table and Albums table
    reviews_users_query = db.session.query(Review, User) \
        .outerjoin(User, Review.user_id == User.id) \
        .filter(Review.album_id == id).all()

    return { "Reviews": reviews_users_query }
