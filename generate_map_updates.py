import sqlite3

conn = sqlite3.connect('dev.db')
cursor = conn.cursor()

cursor.execute("SELECT id, lat, lng FROM Listing WHERE lat IS NOT NULL AND lng IS NOT NULL")
rows = cursor.fetchall()

with open('live_map_updates.sql', 'w') as f:
    for row_id, lat, lng in rows:
        f.write(f"UPDATE Listing SET lat = {lat}, lng = {lng} WHERE id = '{row_id}';\n")

conn.close()
