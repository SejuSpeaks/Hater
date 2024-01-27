from app.models import db, Album, environment, SCHEMA
import datetime
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_albums():
    album1 = Album(
        user_id=2, title='Album 1', genre='Rock', description='A fantastic rock album.', release_date=datetime.datetime(2022,1,15), image_url='https://i.imgur.com/Zp3KkyV.jpg')
    album2 = Album(
        user_id=3, title='Album 2', genre='Pop', description='A catchy pop music album.', release_date=datetime.datetime(2022,7,17), image_url='https://i.imgur.com/PmCzSw3.jpg')
    album3 = Album(
        user_id=1, title='Album 3', genre='Country', description='Love my truck', release_date=datetime.datetime(2020,3,10), image_url='https://i.imgur.com/7ElD1Qz.jpg')

    db.session.add(album1)
    db.session.add(album2)
    db.session.add(album3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_albums():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
