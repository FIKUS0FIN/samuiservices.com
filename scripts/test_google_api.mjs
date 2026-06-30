import fsPromises from 'fs/promises';

const API_KEY = 'AIzaSyAIWcFaVi1Ry-B6r10z9zPxw0mzLgv_YLw';

async function searchPlaceNewAPI(businessName) {
  const url = `https://places.googleapis.com/v1/places:searchText`;
  
  // Requesting all useful fields
  const fieldMask = 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.reviews,places.regularOpeningHours,places.websiteUri,places.photos,places.types,places.userRatingCount,places.googleMapsUri,places.priceLevel';
  
  const requestBody = {
    textQuery: `${businessName} Koh Samui`
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': fieldMask
    },
    body: JSON.stringify(requestBody)
  });
  
  const data = await response.json();
  return data;
}

async function run() {
  const businessName = "The New French Kiss"; 
  console.log(`Searching for: ${businessName} using Places API (New)`);
  
  const responseData = await searchPlaceNewAPI(businessName);
  
  if (responseData.error) {
    console.error(`API Error: ${responseData.error.message}`);
    return;
  }
  
  if (responseData.places && responseData.places.length > 0) {
    console.log(`Found ${responseData.places.length} places!`);
    
    // Save the raw JSON to an artifact file so the user can see it
    await fsPromises.writeFile('google_api_example_response.md', 
      '# Example Google Places API Response\n\n```json\n' + JSON.stringify(responseData.places[0], null, 2) + '\n```\n'
    );
    console.log('Saved raw response to google_api_example_response.md');
  } else {
    console.log("No places found.");
  }
}

run().catch(console.error);
