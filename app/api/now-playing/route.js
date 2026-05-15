/**
 * Now Playing API Route
 * Place this file at: app/api/now-playing/route.js
 *
 * .env.local variables needed:
 *   LASTFM_API_KEY=1d8d106bbe053e66fe1ced6d966ff4fe
 *   LASTFM_USERNAME=T8m0thy
 */

export const revalidate = 0;

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return Response.json({ track: null });
  }

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

    // Only show if actively playing right now
    // (remove the if-block below to always show last played track)
    if (!isNowPlaying) {
      return Response.json({ track: null });
    }

    // Get the best quality album art — Last.fm returns sizes: small, medium, large, extralarge, mega
    const images = latest.image || [];
    const getImage = (size) =>
      images.find((img) => img.size === size)?.["#text"];
    const imageUrl =
      getImage("extralarge") ||
      getImage("mega") ||
      getImage("large") ||
      getImage("medium") ||
      null;

    // Last.fm sometimes returns empty string instead of null for missing images
    const cleanImage = imageUrl && imageUrl.trim() !== "" ? imageUrl : null;

    const track = {
      title: latest.name || "Unknown Track",
      artist: latest.artist?.["#text"] || "Unknown Artist",
      album: latest.album?.["#text"] || null,
      image: cleanImage,
      source: "Last.fm",
      playedAt: new Date().toISOString(),
      url: latest.url || null,
    };

    return Response.json({ track });
  } catch (err) {
    console.error("Now playing fetch error:", err);
    return Response.json({ track: null });
  }
}
