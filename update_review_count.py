import sqlite3
import re

conn = sqlite3.connect('dev.db')
cursor = conn.cursor()

cursor.execute("SELECT id, description FROM Listing")
rows = cursor.fetchall()

updates = []
for row_id, description in rows:
    if not description:
        continue
    
    parts = description.split('## Top Reviews')
    if len(parts) > 1:
        reviews_text = parts[1]
        count = len(re.findall(r'>\s*\*\*\s*-', reviews_text))
        
        if count > 0:
            updates.append((count, row_id))

with open('migration.sql', 'a') as f:
    for count, row_id in updates:
        cursor.execute("UPDATE Listing SET reviewCount = ? WHERE id = ?", (count, row_id))
        f.write(f"UPDATE Listing SET reviewCount = {count} WHERE id = '{row_id}';\n")

conn.commit()
print(f"Updated {len(updates)} listings with their review counts.")
conn.close()
