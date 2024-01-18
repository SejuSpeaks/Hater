from flask import Blueprint, request, redirect
from app.models import Album, Like, User, Review, db, Review, User
from app.forms import AlbumForm
from flask_login import current_user, login_required
from datetime import datetime
from sqlalchemy import or_, func, desc, case
from sqlalchemy.sql import func

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
def like_album(id):
    album = Album.query.get(id)

    if request.method == "DELETE":
        album.delete()
        db.session.commit()
        return {"DELETE": "Album deleted"}

    if request.method == "PUT":
        form = AlbumForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            title = form.title.data
            genre = form.genre.data
            description = form.description.data
            release_date = form.release_date.data
            image_url = form.image_url.data

            updated_album = Album(title=title, genre=genre, description=description, release_date=release_date, image_url=image_url)

            db.session.add(updated_album)
            db.session.commit()
        return redirect('/')
