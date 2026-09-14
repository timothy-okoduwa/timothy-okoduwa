/**
 * Now Playing API Route
 * Connects to Last.fm API scrobbled from Spotify & YouTube Music
 */

export const revalidate = 0;

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY || "1d8d106bbe053e66fe1ced6d966ff4fe";
  const username = process.env.LASTFM_USERNAME || "T8m0thy";

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    const tracks = data?.recenttracks?.track;
    if (!tracks || tracks.length === 0) {
      return Response.json({ track: null });
    }

    const latest = Array.isArray(tracks) ? tracks[0] : tracks;
    const isNowPlaying = latest["@attr"]?.nowplaying === "true";

    const images = latest.image || [];
    const getImage = (size) =>
      images.find((img) => img.size === size)?.["#text"];
    const imageUrl =
      getImage("extralarge") ||
      getImage("mega") ||
      getImage("large") ||
      getImage("medium") ||
      null;

    const cleanImage = imageUrl && imageUrl.trim() !== "" ? imageUrl : null;

    const track = {
      title: latest.name || "Unknown Track",
      artist: latest.artist?.["#text"] || "Unknown Artist",
      album: latest.album?.["#text"] || null,
      image: cleanImage,
      source: "Spotify & YouTube Music",
      isPlaying: isNowPlaying,
      playedAt: new Date().toISOString(),
      url: latest.url || null,
    };

    return Response.json({ track });
  } catch (err) {
    console.error("Now playing fetch error:", err);
    return Response.json({ track: null });
  }
}
