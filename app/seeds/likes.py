from app.models import db, Like, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_likes():
    like1 = Like(
        user_id=1, album_id=2)
    like2 = Like(
        user_id=3, album_id=1)
    like3 = Like(
        user_id=2, album_id=3)
    like4 = Like(
        user_id=3, album_id=5)
    like5 = Like(
        user_id=1, album_id=7)
    like6 = Like(
        user_id=2, album_id=10)
    like7 = Like(
        user_id=1, album_id=4)
    like8 = Like(
        user_id=3, album_id=3)
    like9 = Like(
        user_id=3, album_id=6)
    like10 = Like(
        user_id=2, album_id=9)

    db.session.add(like1)
    db.session.add(like2)
    db.session.add(like3)
    db.session.add(like4)
    db.session.add(like5)
    db.session.add(like6)
    db.session.add(like7)
    db.session.add(like8)
    db.session.add(like9)
    db.session.add(like10)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM likes"))

    db.session.commit()
