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

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores(
      "43.65267326999575,-79.39545615725015",
      "coffee stores",
      6
    )
  );
  const data = await response.json();
  console.log(data);

  return data.response.venues.map((venue, idx) => {
    return {
      ...venue,imgUrl: photos[idx]
    }
  });
};
