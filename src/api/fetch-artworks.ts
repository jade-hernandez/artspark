import { getPageForToday } from "../lib/artwork-of-the-day";
import type { Artwork } from "../types/artwork";

const BASE_URL = "https://api.artic.edu/api/v1";
const FIELDS = "id,title,artist_display,date_display,medium_display,description,image_id";

const MAX_PAGES = 1000;

async function fetchArtworkOfTheDay(): Promise<Artwork> {
  const totalResponse = await fetch(
    `${BASE_URL}/artworks/search?query[term][is_public_domain]=true&limit=0`
  );
  const totalData = await totalResponse.json();
  const totalPages = Math.min(totalData.pagination.total, MAX_PAGES);

  const todayPage = getPageForToday(totalPages);

  const url = `${BASE_URL}/artworks/search?query[term][is_public_domain]=true&limit=1&page=${todayPage}&fields=${FIELDS}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch artwork");
  }

  const data = await response.json();
  const artwork = data.data[0];

  if (!artwork) {
    throw new Error("No artwork found");
  }

  return artwork;
}

export { fetchArtworkOfTheDay };
