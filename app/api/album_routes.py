from flask import Blueprint, jsonify
from app.models import Album, Like, db, Review, User
from flask_login import current_user, login_required
from sqlalchemy.sql import func
from collections import ChainMap

album_routes = Blueprint('albums', __name__)

@album_routes.route('/')
def get_albums():
    albums = Album.query.all()
    return {'albums': [album.to_dict() for album in albums]}

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
