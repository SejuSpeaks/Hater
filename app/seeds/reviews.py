from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_reviews():
    review1 = Review(
        id=1, user_id=1, album_id=2, review_text='This album is amazing! I love the diversity of songs and the artist\'s unique style.', rating=5)
    review2 = Review(
        id=2, user_id=2, album_id=3, review_text='Not bad, but some tracks could be better. Overall, a decent album.', rating=3)
    review3 = Review(
        id=3, user_id=3, album_id=2, review_text='Incredible work! Every song is a masterpiece. I can\'t stop listening.', rating=4)

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
