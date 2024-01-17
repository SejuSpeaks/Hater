from flask import Blueprint, jsonify
from app.models import Album, Like, db, Review, User
from flask_login import current_user, login_required
from sqlalchemy.sql import func
from sqlalchemy import inspect

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

    query = db.session.query(Album, func.avg(Review.rating).label('avg_rating')) \
                    .outerjoin(Review, Album.id == Review.album_id) \
                    .outerjoin(User, Album.user_id == User.id) \
                    # .add_entity(User)
    #num_likes = Like.query(func.count(Like)).filter(Like.album_id == id).all()
    #num_likes = db.session.query.filter(Like.album_id == id).count()

    query = query.group_by(Album.id)
    avg_rating = query.all()
    print(avg_rating)
    avg_review = avg_rating if avg_rating else ""
    # artist = User.query.filter(Album.user_id == User.id).all()
    # artist_name = [user.username for user in artist]

    album_details = {
            'id': album.id,
            'title': album.title,
            # 'artist': artist_name,
            'genre': album.genre,
            'description': album.description,
            'release_date': album.release_date.strftime("%B %d %Y"),
            'image_url': album.image_url,
            'avg_rating': avg_review
            # 'num_likes': float(num_likes) if num_likes else ""
        }


    return {
        f"{album.title} details": album_details
    }
        #f"{album.title} details": album.to_dict()
