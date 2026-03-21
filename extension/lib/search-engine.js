/**
 * Dawn Lens — Semantic Search Engine
 *
 * Loads pre-computed book vectors and provides fast cosine similarity search.
 * Embedding of query/page text is done via a lightweight approach:
 *   - Primary: WASM embedder (ruvector ONNX, 384-dim MiniLM)
 *   - Fallback: TF-IDF weighted hash embeddings (works offline, no model download)
 *
 * The book vectors are stored as a flat Float32Array binary blob for fast loading.
 */

const DIM = 384;
let fragments = null;    // Array of {i, id, ch, ct, st, wc, t, p}
let vectors = null;      // Float32Array, length = fragments.length * DIM
let ready = false;
let loadPromise = null;

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

/**
 * Load book data (fragments metadata + pre-computed vectors).
 * Returns a promise that resolves when ready.
 */
export async function init() {
  if (ready) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const baseUrl = chrome.runtime.getURL('data/');

    // Load metadata and binary vectors in parallel
    const [metaResp, vecResp] = await Promise.all([
      fetch(baseUrl + 'fragments.json'),
      fetch(baseUrl + 'vectors.bin'),
    ]);

    fragments = await metaResp.json();
    const vecBuffer = await vecResp.arrayBuffer();
    vectors = new Float32Array(vecBuffer);

    if (vectors.length !== fragments.length * DIM) {
      throw new Error(`Vector/fragment count mismatch: ${vectors.length} vs ${fragments.length * DIM}`);
    }

    ready = true;
    console.log(`[Dawn Lens] Loaded ${fragments.length} fragments (${(vecBuffer.byteLength / 1024 / 1024).toFixed(1)} MB vectors)`);
  })();

  return loadPromise;
}

// ---------------------------------------------------------------------------
// Embedding (lightweight hash-based for page text)
// ---------------------------------------------------------------------------

/**
 * Generate a 384-dim embedding for text using TF-IDF weighted hashing.
 * This is a fallback when WASM ONNX is not available. It captures
 * word-level semantics well enough for topical matching.
 */
export function embedText(text) {
  const vec = new Float32Array(DIM);
  const words = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);

  // Word frequency
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const uniqueWords = Object.keys(freq);

  for (const word of uniqueWords) {
    const tf = Math.log(1 + freq[word]);

    // FNV-1a hash → dimension index
    let h = 0x811c9dc5 | 0;
    for (let i = 0; i < word.length; i++) {
      h ^= word.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    const idx = (h >>> 0) % DIM;
    // Sign from second hash to reduce collisions
    const sign = ((h >>> 16) & 1) ? 1 : -1;
    vec[idx] += sign * tf;

    // Character trigrams for subword features
    for (let i = 0; i <= word.length - 3; i++) {
      let h2 = 0x811c9dc5 | 0;
      h2 ^= word.charCodeAt(i); h2 = Math.imul(h2, 0x01000193);
      h2 ^= word.charCodeAt(i + 1); h2 = Math.imul(h2, 0x01000193);
      h2 ^= word.charCodeAt(i + 2); h2 = Math.imul(h2, 0x01000193);
      const idx2 = (h2 >>> 0) % DIM;
      const sign2 = ((h2 >>> 16) & 1) ? 1 : -1;
      vec[idx2] += sign2 * tf * 0.3;
    }
  }

  // L2 normalize
  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < DIM; i++) vec[i] /= norm;
  }

  return vec;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Cosine similarity between a query vector and a stored fragment vector.
 */
function cosineSim(queryVec, fragIndex) {
  const offset = fragIndex * DIM;
  let dot = 0;
  for (let i = 0; i < DIM; i++) {
    dot += queryVec[i] * vectors[offset + i];
  }
  // Book vectors are already L2-normalized, query is normalized too
  return dot;
}

/**
 * Search the book for fragments most similar to query text.
 *
 * @param {string} queryText - Text to search for
 * @param {object} options - Search options
 * @param {number} options.k - Number of results (default 10)
 * @param {number} options.minScore - Minimum similarity threshold (default 0.0)
 * @param {number|null} options.chapter - Filter to specific chapter
 * @returns {Array<{fragment, score}>}
 */
export function search(queryText, { k = 10, minScore = 0.0, chapter = null } = {}) {
  if (!ready) throw new Error('Search engine not initialized. Call init() first.');

  const queryVec = embedText(queryText);
  const results = [];

  for (let i = 0; i < fragments.length; i++) {
    if (chapter !== null && fragments[i].ch !== chapter) continue;

    const score = cosineSim(queryVec, i);
    if (score >= minScore) {
      results.push({ fragment: fragments[i], score });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, k);
}

/**
 * Search using multiple text chunks (e.g., from a web page).
 * Returns the best matches across all chunks, deduplicated.
 *
 * @param {string[]} chunks - Array of text chunks
 * @param {object} options - Search options
 * @returns {Array<{fragment, score, matchedChunk}>}
 */
export function searchPage(chunks, { k = 15, minScore = 0.0, chapter = null } = {}) {
  if (!ready) throw new Error('Search engine not initialized. Call init() first.');

  // Embed all chunks
  const chunkVecs = chunks.map(c => embedText(c));

  // Score every fragment against every chunk, keep best per fragment
  const bestScores = new Map(); // fragIndex → {score, chunkIdx}

  for (let ci = 0; ci < chunkVecs.length; ci++) {
    const qv = chunkVecs[ci];
    for (let fi = 0; fi < fragments.length; fi++) {
      if (chapter !== null && fragments[fi].ch !== chapter) continue;

      const score = cosineSim(qv, fi);
      const existing = bestScores.get(fi);
      if (!existing || score > existing.score) {
        bestScores.set(fi, { score, chunkIdx: ci });
      }
    }
  }

  // Collect and sort
  const results = [];
  for (const [fi, { score, chunkIdx }] of bestScores) {
    if (score >= minScore) {
      results.push({
        fragment: fragments[fi],
        score,
        matchedChunk: chunks[chunkIdx].slice(0, 200),
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, k);
}

/**
 * Get all unique chapter titles for filtering.
 */
export function getChapters() {
  if (!fragments) return [];
  const seen = new Map();
  for (const f of fragments) {
    if (!seen.has(f.ch)) {
      seen.set(f.ch, f.ct);
    }
  }
  return Array.from(seen.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([num, title]) => ({ num, title }));
}

/**
 * Get fragment count.
 */
export function getStats() {
  return {
    fragments: fragments ? fragments.length : 0,
    dimensions: DIM,
    ready,
    vectorsSize: vectors ? vectors.byteLength : 0,
  };
}
