import { getPageForToday } from "../lib/artwork-of-the-day";
import type { ArtworkWithImage, ArtworkSearchApiResponse, ArtworkApiResponse } from "../types/artwork";

const BASE_URL = "https://api.artic.edu/api/v1";

const FIELDS = [
  "id",
  "title",
  "image_id",
  "artist_display",
  "artist_title",
  "date_display",
  "medium_display",
  "dimensions",
  "place_of_origin",
  "artwork_type_title",
  "style_title",
  "department_title",
  "description",
  "short_description",
  "is_public_domain",
].join(",");

const MAX_RETRIES = 10;

async function fetchTotalArtworks(): Promise<number> {
  const url = `${BASE_URL}/artworks/search?query[term][is_public_domain]=true&limit=0`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch total artworks: ${response.status}`);
  }

  const data: ArtworkSearchApiResponse = await response.json();

  return data.pagination.total;
}

async function fetchArtworkByPage(page: number): Promise<ArtworkWithImage | null> {
  const url = `${BASE_URL}/artworks/search?query[term][is_public_domain]=true&limit=1&page=${page}&fields=${FIELDS}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch artwork at page ${page}: ${response.status}`);
  }

  const data: ArtworkSearchApiResponse = await response.json();
  const artwork = data.data[0];

  if (!artwork || !artwork.image_id) {
    return null;
  }

  return artwork as ArtworkWithImage;
}

async function fetchArtworkWithRetry(
  getPage: (attempt: number) => number,
  excludeIds: number[] = []
): Promise<ArtworkWithImage> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const page = getPage(attempt);
    const artwork = await fetchArtworkByPage(page);

    if (artwork && !excludeIds.includes(artwork.id)) {
      return artwork;
    }
  }

  throw new Error("Could not find a valid artwork after multiple attempts");
}

async function fetchRandomArtwork(totalPages: number, excludeIds?: number[]): Promise<ArtworkWithImage> {
  const getPage = () => Math.floor(Math.random() * totalPages) + 1;

  return fetchArtworkWithRetry(getPage, excludeIds);
}

async function fetchArtworkOfTheDay(): Promise<ArtworkWithImage> {
  const total = await fetchTotalArtworks();
  const todayPage = getPageForToday(total);
  const getPage = (attempt: number) => ((todayPage - 1 + attempt) % total) + 1;

  return fetchArtworkWithRetry(getPage);
}

async function fetchArtworkById(id: number): Promise<ArtworkWithImage> {
  const url = `${BASE_URL}/artworks/${id}?fields=${FIELDS}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch artwork ${id}: ${response.status}`);
  }

  const data: ArtworkApiResponse = await response.json();

  if (!data.data.image_id) {
    throw new Error(`Artwork ${id} has no image`);
  }

  return data.data as ArtworkWithImage;
}

export { fetchTotalArtworks, fetchArtworkByPage, fetchRandomArtwork, fetchArtworkOfTheDay, fetchArtworkById };
