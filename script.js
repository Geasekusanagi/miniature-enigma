// script.js - simple demo behavior
const btn = document.getElementById('analyzeBtn');
const urlInput = document.getElementById('urlInput');
const status = document.getElementById('status');
const result = document.getElementById('result');

const sampleResult = {
  status: 200,
  durationMs: 120,
  contentLength: 23456,
  title: "Example Domain",
  metaDesc: "This is a demo meta description from the sample result.",
  h1: ["Example Domain"],
  canonical: "",
  robots: "",
  imageCount: 1,
  imagesMissingAlt: 1,
  words: 80,
  topKeywords: [{keyword: "example", count: 5, density: "6.25"}]
};

btn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    status.textContent = 'Please enter a full URL (including https://).';
    return;
  }

  status.textContent = 'Running quick check...';
  result.innerHTML = '';

  // Try to call /api/audit (this will work later when you add a backend).
  // For now, this tries and falls back to sampleResult so you can see output.
  try {
    const resp = await fetch(/api/audit?url=${encodeURIComponent(url)}, { method: 'GET' });
    if (!resp.ok) throw new Error('API not available');
    const data = await resp.json();
    showResult(data);
  } catch (err) {
    // Fallback: show demo result
    status.textContent = 'Demo mode (no backend yet). Showing sample output.';
    showResult(sampleResult);
  }
});

function showResult(data) {
  let html = '';
  html += <strong>HTTP Status:</strong> ${data.status} <br/>;
  html += <strong>Response time:</strong> ${data.durationMs} ms <br/>;
  html += <strong>Title:</strong> ${escapeHtml(data.title || '')} <br/>;
  html += <strong>Meta description:</strong> ${escapeHtml(data.metaDesc || '')} <br/>;
  html += <strong>H1s:</strong> ${Array.isArray(data.h1) ? escapeHtml(data.h1.join(' | ')) : ''} <br/>;
  html += <strong>Images:</strong> ${data.imageCount} (missing alt: ${data.imagesMissingAlt}) <br/>;
  html += <strong>Word count:</strong> ${data.words} <br/>;
  html += <h4>Top keywords</h4>;
  if (Array.isArray(data.topKeywords)) {
    html += '<ul>';
    data.topKeywords.forEach(k=>{
      html += <li>${escapeHtml(k.keyword)} — ${k.count} times — ${k.density}%</li>;
    });
    html += '</ul>';
  }
  result.innerHTML = html;
  status.textContent = 'Done.';
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/[&<>"']/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
  });
}