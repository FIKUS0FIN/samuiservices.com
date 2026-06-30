import fsPromises from 'fs/promises';

const API_KEY = 'AIzaSyC1ETrImW9Q_lOxGsHwPqoDCoWfmqJM8SU';

async function findPlaceId(businessName) {
  const query = encodeURIComponent(`${businessName} Koh Samui`);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  }
  return null;
}

async function getPlaceDetails(placeId) {
  const fields = 'name,rating,formatted_phone_number,formatted_address,opening_hours,website,photos,reviews,url,price_level,types,user_ratings_total,editorial_summary';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  
  const response = await fetch(url);
  return await response.json();
}

async function run() {
  const placeId = await findPlaceId("The New French Kiss");
  if (placeId) {
    const details = await getPlaceDetails(placeId);
    await fsPromises.writeFile('legacy_api_response.json', JSON.stringify(details, null, 2));
    console.log('Saved legacy response');
  }
}

run().catch(console.error);
