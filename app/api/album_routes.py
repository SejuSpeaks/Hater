from flask import Blueprint, request
from app.models import Album, Like, User, Review, db
from flask_login import current_user, login_required
from datetime import datetime
from sqlalchemy import or_, func

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
