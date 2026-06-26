🎯 **What:** The testing gap addressed
The `toggleFavorite` server action in `src/app/actions/favorites.ts` lacked tests, which meant we could not be completely sure that the favorite toggle logic works as expected. This action handles the logic to favorite and unfavorite a listing for the logged in user.

📊 **Coverage:** What scenarios are now tested
Added `src/app/actions/favorites.test.ts` to test the following scenarios:
- Returns an error if the user is not logged in.
- Creates a new favorite if it does not exist, and triggers revalidation.
- Deletes an existing favorite if it exists, and triggers revalidation.
- Returns a generic error if the database operation fails.

✨ **Result:** The improvement in test coverage
The server action `toggleFavorite` is now covered by unit tests ensuring regression-free changes moving forward.
