import { useArtwork } from "../hooks/useArtwork";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function DiscoverPage() {
  const { artwork, loading, error } = useArtwork();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!artwork) return <p>No artwork found.</p>;

  const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;

  return (
    <div className='min-h-screen bg-[#FAFAFA]'>
      <main>
        <section className='flex flex-col items-center gap-8'>
          <h1 className='text-2xl font-bold text-[#1A1A1A]'>Discover Page</h1>

          <img
            src={imageUrl}
            alt={artwork.title}
          />

          <div className='flex flex-col gap-1'>
            <h2>{artwork.title}</h2>
            <p>{artwork.artist_display}</p>
            <p>{artwork.date_display}</p>
            <p>{artwork.medium_display}</p>
          </div>

          {/* {artwork.description && <div dangerouslySetInnerHTML={{ __html: artwork.description }} />} */}
          {artwork.description && <p>{stripHtml(artwork.description)}</p>}
        </section>
      </main>
    </div>
  );
}

export { DiscoverPage };
