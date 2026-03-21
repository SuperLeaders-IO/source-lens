/**
 * Dawn Lens — Content Script
 *
 * Extracts meaningful text from any web page and sends it to the side panel.
 * Uses a smart extraction strategy that prioritizes article content over
 * navigation, ads, and boilerplate.
 */

(function() {
  'use strict';

  /**
   * Extract the main readable text from the current page.
   * Tries <article>, <main>, then falls back to <body>.
   * Strips scripts, styles, nav, footer, ads.
   */
  function extractPageText() {
    // Priority containers
    const candidates = [
      document.querySelector('article'),
      document.querySelector('[role="main"]'),
      document.querySelector('main'),
      document.querySelector('.post-content'),
      document.querySelector('.article-body'),
      document.querySelector('.entry-content'),
      document.querySelector('#content'),
      document.body,
    ].filter(Boolean);

    const container = candidates[0];
    if (!container) return { title: document.title, text: '', url: location.href };

    // Clone to avoid modifying the page
    const clone = container.cloneNode(true);

    // Remove noise elements
    const noiseSelectors = [
      'script', 'style', 'noscript', 'svg', 'iframe',
      'nav', 'footer', 'header',
      '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
      '.sidebar', '.comments', '.advertisement', '.ad', '.social-share',
      '.cookie-banner', '.popup', '.modal',
    ];
    for (const sel of noiseSelectors) {
      clone.querySelectorAll(sel).forEach(el => el.remove());
    }

    // Extract text, preserving paragraph structure
    const text = clone.innerText || clone.textContent || '';

    // Clean up: collapse whitespace runs, trim
    const cleaned = text
      .replace(/\t/g, ' ')
      .replace(/ {2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      title: document.title,
      url: location.href,
      text: cleaned,
      charCount: cleaned.length,
      wordCount: cleaned.split(/\s+/).length,
    };
  }

  /**
   * Chunk text into segments suitable for embedding (~500 chars each).
   */
  function chunkText(text, chunkSize = 500, overlap = 100) {
    if (text.length <= chunkSize) return [text];

    const chunks = [];
    let pos = 0;
    while (pos < text.length) {
      const end = Math.min(pos + chunkSize, text.length);
      const chunk = text.slice(pos, end).trim();
      if (chunk.length > 50) chunks.push(chunk);
      if (end >= text.length) break;

      // Try to break at sentence boundary
      const window = text.slice(Math.max(pos, end - 150), end);
      const sentEnd = window.lastIndexOf('. ');
      const breakAt = sentEnd !== -1 ? (end - 150 + sentEnd + 2) : end;

      pos = breakAt - overlap;
      if (pos <= chunks.length > 0 ? pos : 0) pos = breakAt;
    }
    return chunks;
  }

  // Listen for extraction requests from the side panel
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'extract-text') {
      const pageData = extractPageText();
      pageData.chunks = chunkText(pageData.text);
      sendResponse(pageData);
    }
    return true;
  });

  // Notify that content script is ready
  chrome.runtime.sendMessage({ type: 'content-ready', url: location.href }).catch(() => {});
})();
