from flask import Blueprint, jsonify, redirect
from app.models import Album, User, db
from app.forms import AlbumForm
from flask_login import login_required

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

@album_routes.route('/', methods=["POST"])
@login_required
def post_album():
    userId = User.get(id)
    form = AlbumForm()
    if form.validate_on_submit():
        title = form.title.data
        genre = form.genre.data
        description = form.description.data
        release_date = form.release_date.data
        image_url = form.image_url.data

        new_album = AlbumForm(userId=userId, title=title, genre=genre, description=description, release_date=release_date, image_url=image_url)

        db.session.add(new_album)
        db.session.commit()
        return redirect('/')
    return "Bad data", 401
