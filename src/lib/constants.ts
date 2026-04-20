/**
 * Base URL for the Art Institute of Chicago IIIF image server.
 * Source: config.iiif_url returned by the API.
 * Centralized here for components that don't have direct API response access (e.g. favorites).
 */
export const IIIF_BASE_URL = "https://www.artic.edu/iiif/2";

export const IIIF_SIZES = {
  thumbnail: "400,",
  standard: "843,",
  highRes: "1686,",
} as const;
