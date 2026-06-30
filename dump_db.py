import sqlite3

con = sqlite3.connect('dev.db')
with open('seed_data_py.sql', 'w', encoding='utf-8') as f:
    for line in con.iterdump():
        if line.startswith('INSERT INTO "User"') or line.startswith('INSERT INTO "Category"') or line.startswith('INSERT INTO "Island"') or line.startswith('INSERT INTO "Listing"') or line.startswith('INSERT INTO "Review"'):
            f.write(line + '\n')
