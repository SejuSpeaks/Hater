from app.models import db, Album, environment, SCHEMA
import datetime
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_albums():
    album1 = Album(
        user_id=2, title='New Blue Sun', genre='Ambient', description='A fantastic album about my experiences with meditation.', release_date=datetime.datetime(2022,1,15), image_url='https://media.pitchfork.com/photos/65537cbc3cc93f9b90ee453e/1:1/w_320,c_limit/Andre-3000-New-Blue-Sun.jpg')
    album2 = Album(
        user_id=3, title='IHY', genre='Rock', description='A catchy pop music album.', release_date=datetime.datetime(2022,7,17), image_url="https://f4.bcbits.com/img/a0729148462_65")
    album3 = Album(
        user_id=1, title='High-loops and higher loops', genre='Lofi', description='Beats and sounds for your ears', release_date=datetime.datetime(2020,3,10), image_url='https://f4.bcbits.com/img/a0444128326_9.jpg')
    album4 = Album(
        user_id=3, title='Black Focus', genre='Jazz', description='Jazz album', release_date=datetime.datetime(2020,3,10), image_url='https://f4.bcbits.com/img/a2077159990_9.jpg')
    album5 = Album(
        user_id=2, title='extended songs from NBS', genre='Jazz', description='extended cuts from the album', release_date=datetime.datetime(2022,10,10), image_url='https://jambands.com/wp-content/uploads/2023/11/Screenshot-2023-11-14-at-9.55.33%E2%80%AFAM-700x507.png')
    album6 = Album(
        user_id=1, title='Kickinit Alone', genre='Jazz', description='KickinitAlone', release_date=datetime.datetime(2022,10,10), image_url='https://f4.bcbits.com/img/a0188364745_9.jpg')
    album7 = Album(
        user_id=2, title='1991', genre='Jazz', description='album from 1991 i made it while in my moms room', release_date=datetime.datetime(2010,10,10), image_url='https://f4.bcbits.com/img/a2422439400_16.jpg')
    album8 = Album(
        user_id=2, title='Survive', genre='Alt Rock', description='Another rock album by the famous not famous band showmethebody', release_date=datetime.datetime(2023,3,10), image_url='https://f4.bcbits.com/img/a1500312026_2.jpg')
    album9 = Album(
        user_id=1, title="Nico's Red Truck ", genre='indie', description='Nico was my father he had a truck. i Loved that truck wow man', release_date=datetime.datetime(2018,9,20), image_url='https://f4.bcbits.com/img/a1912551467_16.jpg')
    album10 = Album(
        user_id=3, title=" Devonwho", genre='electronic', description='another beat tape i made inspired by pizza', release_date=datetime.datetime(2017,4,10), image_url='https://f4.bcbits.com/img/a1251011248_16.jpg')
    album11 = Album(
        user_id=1, title=" VGM.31", genre='electronic', description='This is an album that was very importnat to my life in Idaho', release_date=datetime.datetime(2017,4,10), image_url='https://f4.bcbits.com/img/a3773615654_16.jpg')
    album12 = Album(
        user_id=3, title=" Livin in Japan.V2", genre='electronic', description='This is an album that was very importnat to my life in Japan', release_date=datetime.datetime(2024,1,10), image_url='https://f4.bcbits.com/img/a1556519735_16.jpg')
    album13 = Album(
        user_id=3, title="Minewest Emo", genre='Rock', description='A lot of effort went into making this album we did the best we could on this', release_date=datetime.datetime(2024,1,10), image_url='https://f4.bcbits.com/img/a1591339836_16.jpg')
    album14 = Album(
        user_id=1, title="Girl with Fish", genre='Shoegaze', description='Not lot of effort went into making this album we did Not do the best we could on this', release_date=datetime.datetime(2024,1,10), image_url='https://f4.bcbits.com/img/a3047907263_16.jpg')


    db.session.add(album1)
    db.session.add(album2)
    db.session.add(album3)
    db.session.add(album4)
    db.session.add(album5)
    db.session.add(album6)
    db.session.add(album7)
    db.session.add(album8)
    db.session.add(album9)
    db.session.add(album10)
    db.session.add(album11)
    db.session.add(album12)
    db.session.add(album13)
    db.session.add(album14)
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
