from flask import Blueprint, request, redirect
from app.models import Album, Like, User, Review, db, Review, User
from app.forms import AlbumForm, ReviewForm
from flask_login import current_user, login_required
from datetime import datetime
from sqlalchemy import or_, func, desc, case
from sqlalchemy.sql import func
# from app.api import validation_errors_to_error_messages

album_routes = Blueprint('albums', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@album_routes.route('/')
def get_albums():

    search_term = request.args.get('search')

    #first line of the query builds includes an average aggregate and replaces None values to 0
    query = db.session.query(Album, func.coalesce(func.avg(Review.rating), 0).label('avg_rating')) \
                .outerjoin(Review, Album.id == Review.album_id) \
                .outerjoin(User, Album.user_id == User.id) \
                .add_entity(User)

    if search_term:
        query = query.filter(or_(Album.title.ilike(f'%{search_term}%'),
                                Album.genre.ilike(search_term),
                                User.username.ilike(search_term),
                                Album.description.ilike(f'%{search_term}%')))

    query = query.group_by(Album.id, User.id) \
                .order_by(desc('avg_rating')) \
                .limit(20)

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
@login_required
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
@login_required
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


@album_routes.route('/<int:id>/reviews', methods=['GET'])
def get_album_reviews(id):
    # Exits with status 404 if no album with the ID in the URL exists
    album = Album.query.get(id)
    if not album:
        error = { "error": "No album with the specified ID found"}
        return error, 404

    # Queries for all reviews of a given album
    query = db.session.query(Review, User) \
        .outerjoin(User, Review.user_id == User.id) \
        .filter(Review.album_id == id) \
        .all()

    # Formats the data from the query above
    reviews_with_users = [
        {
            "review": {
                "id": review.id,
                "user_id": review.user_id,
                "album_id": review.album_id,
                "rating": review.rating,
                "review_text": review.review_text,
                "created_at": review.created_at,
                "updated_at": review.updated_at
            },
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        }
        for review, user in query
    ]

    return { "reviews": reviews_with_users }


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
            new_review_rating = request.json.get("rating", None)
            new_review_text = request.json.get("review_text", None)

            # Backend validation
            validation_errors = {}

            if new_review_rating is None:
                validation_errors["rating"] = "Please provide a rating"

            if new_review_text is None:
                validation_errors["review_text"] = "Please provide a review"

            if new_review_rating < 1 or new_review_rating > 5:
                validation_errors["rating"] = "Please provide a rating between 1 and 5"

            if validation_errors:
                return validation_errors, 400

            # Creates a new review and adds it to the database
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

@album_routes.route('/<int:id>')
@album_routes.errorhandler(404)
def album_details(id):

    album = Album.query.get(id)

    if (not album):
        error = {"Error": "Invalid album id"}
        return error, 404

##get avg reviews
    reviews = Review.query.filter(Review.album_id == album.id).all()
    review_details = [
        {
            'id': review.id,
            'user_id': review.user_id,
            'review_text': review.review_text,
            'rating': review.rating
        } for review in reviews]

    merged_dict = {}

    for sub in review_details:
        for key, val in sub.items():
            merged_dict.setdefault(key, []).append(val)

    rating_list = list(merged_dict['rating'])
    rating_sum = sum(rating_list)
    rating_avg = rating_sum / len(rating_list)

    avg_review = rating_avg if rating_avg else ""

##get artist name
    users = User.query.filter(User.id == album.user_id).all()
    user_details = [
        {
            'id' : user.id,
            'username' : user.username,
            'first_name' : user.first_name,
            'last_name' : user.last_name
        } for user in users]
    artist_name = user_details[0]['username']

##get num likes
    likes = Like.query.filter(Like.album_id == album.id).all()
    like_details = [
        {
            'id': like.id,
            'user_id': like.user_id,
            'album_id': like.album_id,
        } for like in likes]

    merged_like_dict = {}

    for sub in like_details:
        for key, val in sub.items():
            merged_like_dict.setdefault(key, []).append(val)

    like_list = list(merged_like_dict['user_id'])
    num_likes = len(like_list)

    avg_review = rating_avg if rating_avg else ""
    total_likes = num_likes if num_likes else ""

    album_details = {
            'id': album.id,
            'title': album.title,
            'artist': artist_name,
            'genre': album.genre,
            'description': album.description,
            'release_date': album.release_date.strftime("%B %d %Y"),
            'image_url': album.image_url,
            'avg_rating': avg_review,
            'total_likes': total_likes
        }


    return {
        f"{album.title} details": album_details
    }

@album_routes.route('/', methods=["POST"])
@login_required
def post_album():
    userId = current_user.id

    form = AlbumForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        title = form.title.data
        genre = form.genre.data
        description = form.description.data
        release_date = form.release_date.data
        image_url = form.image_url.data

        new_album = Album(user_id=userId, title=title, genre=genre, description=description, release_date=release_date, image_url=image_url)

        db.session.add(new_album)
        db.session.commit()
        return redirect('/')
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@album_routes.route('/<int:id>', methods=['PUT','DELETE'])
@album_routes.errorhandler(404)
@login_required
def edit_album(id):
    userId = current_user.id

    album = Album.query.get(id)

    if request.method == "DELETE":
        db.session.delete(album)
        db.session.commit()
        return {"DELETE": "Album deleted"}

    if request.method == "PUT":
        form = AlbumForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            album.title = form.title.data
            album.genre = form.genre.data
            album.description = form.description.data
            album.release_date = form.release_date.data
            album.image_url = form.image_url.data

            db.session.commit()
            # return redirect('/')
            return 'Edited Album'
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
