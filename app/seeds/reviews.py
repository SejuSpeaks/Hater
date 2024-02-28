from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_reviews():
    review1 = Review(
        user_id=1, album_id=2, review_text='This album is amazing! I love the diversity of songs and the artist\'s unique style.', rating=5)
    review2 = Review(
        user_id=2, album_id=2, review_text='Incredible work! Every song is a masterpiece. I can\'t stop listening.', rating=4)
    review3 = Review(
        user_id=1, album_id=1, review_text='Not bad, but some tracks could be better. Overall, a decent album.', rating=3)
    review4 = Review(
        user_id=3, album_id=1, review_text='I think this album couldve really used some work on the overall structure still loved it was an amazing album.', rating=5)
    review5 = Review(
        user_id=2, album_id=9, review_text='I really enjoyed still think that it was too short i wished i had this for more than 14 minutes .', rating=4)
    review6 = Review(
        user_id=3, album_id=3, review_text='Not bad, but some tracks could be better. Overall, a decent album.', rating=3.5)
    review7 = Review(
        user_id=2, album_id=14, review_text='Honestly Trash ... Next!', rating=2)
    review8 = Review(
        user_id=1, album_id=5, review_text='Honestly Trash ... Next!', rating=2)
    review9 = Review(
        user_id=1, album_id=4, review_text='I really did try to like this album.. i mean i really did try.. and i DID!', rating=5)
    review10 = Review(
        user_id=1, album_id=7, review_text='I think the sudden change in song structure during the middle of the project really examplifies how sudden an huge the impact is', rating=3.5)
    review11 = Review(
        user_id=1, album_id=10, review_text='If i could give it a 10 i wouldnt', rating=1)
    review12 = Review(
        user_id=2, album_id=11, review_text='I think i could make a better album without listening to any music', rating=2)
    review13 = Review(
        user_id=2, album_id=6, review_text='Bozo next!!', rating=2)
    review14 = Review(
        user_id=3, album_id=8, review_text='We love farmers and people who make good albums woohooo', rating=5)
    review15 = Review(
        user_id=3, album_id=7, review_text='Time to wake up america... This guy stinks! hahahah', rating=2)

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.add(review4)
    db.session.add(review5)
    db.session.add(review6)
    db.session.add(review7)
    db.session.add(review8)
    db.session.add(review9)
    db.session.add(review10)
    db.session.add(review11)
    db.session.add(review12)
    db.session.add(review13)
    db.session.add(review14)
    db.session.add(review15)

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
