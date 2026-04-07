type Artwork = {
  id: number;
  title: string;
  image_id: string | null;
  artist_display: string | null;
  artist_title: string | null;
  date_display: string | null;
  medium_display: string | null;
  dimensions: string | null;
  place_of_origin: string | null;
  artwork_type_title: string | null;
  style_title: string | null;
  department_title: string | null;
  description: string | null;
  short_description: string | null;
  is_public_domain: boolean;
};

type ArtworkApiConfig = {
  iiif_url: string;
  website_url: string;
};

type ArtworkApiResponse = {
  data: Artwork;
  config: ArtworkApiConfig;
};

type ArtworkSearchApiResponse = {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
  data: Artwork[];
  config: ArtworkApiConfig;
};

type Favorite = {
  id: string;
  user_id: string;
  artwork_id: number;
  title: string;
  artist: string | null;
  image_id: string;
  created_at: string;
};

type FavoriteInsert = Omit<Favorite, "id" | "user_id" | "created_at">;

type ArtworkWithImage = Artwork & {
  image_id: string;
};

export type {
  Artwork,
  ArtworkApiConfig,
  ArtworkApiResponse,
  ArtworkSearchApiResponse,
  ArtworkWithImage,
  Favorite,
  FavoriteInsert,
};
