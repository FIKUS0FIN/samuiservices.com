import sqlite3

conn = sqlite3.connect('dev.db')
cursor = conn.cursor()

cursor.execute("SELECT id, reviewCount FROM Listing WHERE reviewCount > 0")
rows = cursor.fetchall()

with open('live_updates.sql', 'w') as f:
    for row_id, count in rows:
        f.write(f"UPDATE Listing SET reviewCount = {count} WHERE id = '{row_id}';\n")

conn.close()
