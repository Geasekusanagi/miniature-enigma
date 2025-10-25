// audit.js - Netlify function
import fetch from "node-fetch";

export async function handler(event, context) {
  const url = new URLSearchParams(event.queryStringParameters).get("url");
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: "URL required" }) };
  }

  try {
    const resp = await fetch(url, { timeout: 8000 });
    const html = await resp.text();

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const h1Match = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)].map(m => m[1].trim());

    const data = {
      status: resp.status,
      contentLength: resp.headers.get("content-length") || html.length,
      title: titleMatch ? titleMatch[1] : "",
      metaDesc: descMatch ? descMatch[1] : "",
      h1: h1Match,
      wordCount: html.split(/\s+/).length
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}