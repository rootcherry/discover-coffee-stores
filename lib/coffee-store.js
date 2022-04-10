const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v2/venues/search?ll=${latLong}&
  query=${query}&
  client_id=${process.env.FOURSQUARE_CLIENT_ID}&
  client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&
  v=20220410&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
  const response = await fetch(
    getUrlForCoffeeStores(
      "43.65267326999575,-79.39545615725015",
      "coffe stores",
      6
    )
  );
  const data = await JSON.stringify(response);
  console.log(data);

  return data.response.venues;
};
