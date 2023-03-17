import axios from 'axios';

export async function getPlaces(query, lat, long, limit = 3, radius = 10000) {

    let baseUrl = 'https://api.tomtom.com/search/2/search';

    let queryString = `limit=${limit}&radius=${radius}&key=${process.env.REACT_APP_TOMTOMAPIKEY}`;

    let sanitizedQuery = query.replace(
        /[^a-zA-Z\s]/g,
        ""
      )

    let response = await axios.get(`${baseUrl}/${sanitizedQuery}.json?${queryString}`);

    return response.data.results;
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color)
    return color;
}