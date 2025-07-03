import { NextRequest, NextResponse } from "next/server";

// In-memory cache: query -> { images, timestamp }
const CACHE_DURATION_MS = 60_000; // 1 minute
const cache = new Map<string, { images: any[]; timestamp: number }>();

const RAPID_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
const RAPID_ENDPOINT = "https://real-time-image-search.p.rapidapi.com/search";

export async function POST(req: NextRequest) {
  if (!RAPID_KEY) {
    return NextResponse.json({ error: "RapidAPI key missing" }, { status: 500 });
  }
  const { query } = await req.json() as { query?: string };
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // If we fetched this query recently, return cached results
  const cached = cache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json({ images: cached.images, cached: true });
  }

  const safeQuery = query.trim().slice(0, 100);
  const rapidUrl = `${RAPID_ENDPOINT}?query=${encodeURIComponent(safeQuery)}&limit=3&size=any&color=any&type=any&time=any&usage_rights=any&file_type=any&aspect_ratio=any&safe_search=off&region=us`;

  const res = await fetch(rapidUrl, {
    headers: {
      "X-RapidAPI-Key": RAPID_KEY,
      "X-RapidAPI-Host": "real-time-image-search.p.rapidapi.com",
    },
  });

  if (!res.ok) {
    console.error("Real-Time Image Search failed", await res.text());
    return NextResponse.json({ images: [] });
  }

  const data = await res.json();

  if (!data.data) {
    return NextResponse.json({ images: [] });
  }

  const images = data.data.map((item: any) => ({
    link: item.thumbnail_url || item.url, // high-res image
    thumbnail: item.url,
    title: item.title,
  }));

  // Store in cache
  cache.set(query, { images, timestamp: Date.now() });

  return NextResponse.json({ images, cached: false });
}