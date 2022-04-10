// initialize unsplash

import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 10,
  });

  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls['small']);
}

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 8
  ) => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee stores", limit),
    {
      "headers": {
        'Authorization': process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
      }
    }
  );
  const data = await response.json();
  console.log(data);

  return data?.results?.map((venue, idx) => { // <------
    const neighbourhood = venue.location.neighborhood;
    return {
      id: venue.fsq_id, // <------
      address: venue.location.address || "",
      name: venue.name,
      neighbourhood: (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) || venue.location.cross_street || "",
      imgUrl: photos[idx],
    };
  }) || [];
};
