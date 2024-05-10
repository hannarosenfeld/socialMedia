from app.models import db, Room, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_rooms():
    # Fetch the first two users from the database
    user1 = User.query.get(1)
    user2 = User.query.get(2)

    # Create a room and associate users with it
    r1 = Room(
        name="Bad Vibes Only", creator=user1, users=[user1, user2]
    )

    db.session.add(r1)
    db.session.commit()

    return [r1]




# Uses a raw SQL query to TRUNCATE or DELETE the rooms table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_rooms():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.rooms RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM rooms"))
        
    db.session.commit()