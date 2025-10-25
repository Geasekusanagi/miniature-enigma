// functions/audit.js
export async function handler(event) {
  const url = new URL(event.rawUrl).searchParams.get("url");

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing URL parameter" }),
    };
  }

  try {
    const res = await fetch(url);
    const html = await res.text();

    // Quick SEO analysis
    const title = (html.match(/<title>(.*?)<\/title>/i)  [])[1]  "No title found";
    const h1 = (html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || []).map(tag =>
      tag.replace(/<\/?h1[^>]*>/gi, "")
    );
    const wordCount = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

    return {
      statusCode: 200,
      body: JSON.stringify({ title, h1, wordCount }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to analyze site", details: err.message }),
    };
  }
}
