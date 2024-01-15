from flask import Blueprint, jsonify
from app.models import Album

album_routes = Blueprint('albums', __name__)

@album_routes.route('/')
def get_albums():
    albums = Album.query.all()
    return {'albums': [album.to_dict() for album in albums]}

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
