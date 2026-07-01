import sqlite3
import re

def main():
    conn = sqlite3.connect('dev.db')
    cursor = conn.cursor()

    # Get new category slugs to IDs
    cursor.execute("SELECT slug, id FROM Category")
    new_categories = {row[0]: row[1] for row in cursor.fetchall()}

    # Get listings with old categories
    cursor.execute("""
        SELECT l.id, l.name, l.description, c.slug, l.categoryId 
        FROM Listing l
        JOIN Category c ON l.categoryId = c.id
    """)
    listings = cursor.fetchall()

    updates = []
    
    for l_id, name, desc, old_slug, old_cat_id in listings:
        text = f"{name} {desc}".lower()
        new_slug = None

        if old_slug == 'food-beverage-879':
            if 'cafe' in text or 'coffee' in text: new_slug = 'cafes'
            elif 'bar ' in text or 'pub ' in text or 'nightclub' in text: new_slug = 'bars--nightlife'
            elif 'street' in text or 'market' in text: new_slug = 'street-food'
            else: new_slug = 'restaurants'
        elif old_slug == 'accommodation-533':
            if 'villa' in text: new_slug = 'villas'
            elif 'resort' in text: new_slug = 'resorts'
            elif 'hostel' in text: new_slug = 'hostels'
            else: new_slug = 'hotels'
        elif old_slug == 'retail-convenience-474':
            if 'supermarket' in text or 'mart' in text or '7-eleven' in text or 'tesco' in text or 'big c' in text: new_slug = 'supermarkets'
            elif 'souvenir' in text or 'gift' in text: new_slug = 'souvenirs'
            elif 'electronic' in text or 'phone' in text or 'computer' in text: new_slug = 'electronics'
            else: new_slug = 'boutiques'
        elif old_slug == 'beauty-wellness-162':
            if 'spa ' in text or 'massage' in text: new_slug = 'spas--massage'
            elif 'gym' in text or 'fitness' in text: new_slug = 'gyms'
            elif 'dentist' in text or 'dental' in text: new_slug = 'dentists'
            else: new_slug = 'clinics'
        elif old_slug == 'local-services-530' or old_slug == 'property-services-943' or old_slug == 'property-real-estate-62' or old_slug == 'legal-financial-services-652':
            if 'plumb' in text: new_slug = 'plumbers'
            elif 'electric' in text: new_slug = 'electricians'
            elif 'clean' in text or 'laundry' in text: new_slug = 'cleaning-services'
            else: new_slug = 'contractors'
        elif old_slug == 'activities-440' or old_slug == 'for-kids-892' or old_slug == 'travel-agencies-516':
            if 'dive' in text or 'diving' in text: new_slug = 'diving'
            elif 'boat' in text or 'surf' in text or 'water' in text: new_slug = 'water-sports'
            elif 'yoga' in text or 'retreat' in text: new_slug = 'yoga--retreats'
            else: new_slug = 'tours'
        elif old_slug == 'nightlife-968':
            new_slug = 'bars--nightlife'
        elif old_slug == 'transport-131':
            if 'scooter' in text or 'bike' in text or 'motor' in text: new_slug = 'scooter-rental'
            elif 'taxi' in text or 'cab' in text: new_slug = 'taxis'
            elif 'ferry' in text or 'boat' in text: new_slug = 'ferry-services'
            else: new_slug = 'car-rental'
        elif old_slug == 'sports-fitness-560':
            new_slug = 'gyms'
        elif old_slug == 'health-medical-837':
            if 'dentist' in text or 'dental' in text: new_slug = 'dentists'
            else: new_slug = 'clinics'

        # Default fallback if old category doesn't match known mappings (maybe it's already a new category)
        if new_slug and new_slug in new_categories:
            new_cat_id = new_categories[new_slug]
            if new_cat_id != old_cat_id:
                updates.append((new_cat_id, l_id))

    with open('migration.sql', 'w') as f:
        for new_cat_id, l_id in updates:
            f.write(f"UPDATE Listing SET categoryId = '{new_cat_id}' WHERE id = '{l_id}';\n")
            cursor.execute("UPDATE Listing SET categoryId = ? WHERE id = ?", (new_cat_id, l_id))

    conn.commit()
    print(f"Mapped {len(updates)} listings to new categories.")
    conn.close()

if __name__ == '__main__':
    main()
