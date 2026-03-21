/**
 * Source Lens — Side Panel Controller
 *
 * Generic version: reads source title/author from the data manifest
 * and adapts the UI accordingly.
 */

import { init, search, searchPage, getChapters, getStats } from './lib/search-engine.js';

let currentMode = 'search';
let searchDebounceTimer = null;
let sourceTitle = 'Source';
let sourceAuthor = '';

const statusEl = document.getElementById('status');
const lensTitle = document.getElementById('lens-title');
const lensSubtitle = document.getElementById('lens-subtitle');
const searchInput = document.getElementById('search-input');
const scanBtn = document.getElementById('scan-btn');
const searchMeta = document.getElementById('search-meta');
const resultsList = document.getElementById('results-list');
const emptyState = document.getElementById('empty-state');
const detailPanel = document.getElementById('detail-panel');
const detailContent = document.getElementById('detail-content');
const detailClose = document.getElementById('detail-close');
const statsEl = document.getElementById('stats');
const modeBtns = document.querySelectorAll('.mode-btn');

async function startup() {
  statusEl.textContent = 'loading...';

  try {
    // Load manifest to get source info
    const manifestResp = await fetch(chrome.runtime.getURL('data/manifest.json'));
    const manifest = await manifestResp.json();
    sourceTitle = manifest.title || 'Source';
    sourceAuthor = manifest.author || '';

    lensTitle.textContent = `Source Lens`;
    lensSubtitle.textContent = sourceAuthor
      ? `${sourceTitle} · ${sourceAuthor}`
      : sourceTitle;

    await init();
    const stats = getStats();
    statusEl.textContent = `${stats.fragments} passages`;
    statusEl.classList.add('ready');
    statsEl.textContent = `${stats.fragments} passages · ${(stats.vectorsSize / 1024 / 1024).toFixed(1)} MB`;
  } catch (err) {
    statusEl.textContent = 'load failed';
    console.error('[Source Lens] Init failed:', err);
    emptyState.querySelector('p').textContent = 'Failed to load source data. Run "node build.js" first.';
    return;
  }

  searchInput.addEventListener('input', onSearchInput);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runSearch(searchInput.value.trim());
  });
  scanBtn.addEventListener('click', onScanPage);
  detailClose.addEventListener('click', () => detailPanel.classList.add('hidden'));
  modeBtns.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
}

function setMode(mode) {
  currentMode = mode;
  modeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  resultsList.innerHTML = '';
  emptyState.style.display = 'block';
  searchMeta.textContent = '';

  if (mode === 'search') {
    searchInput.placeholder = `Search ${sourceTitle}...`;
    searchInput.value = '';
    searchInput.focus();
  } else if (mode === 'scan') {
    searchInput.placeholder = 'Scanning page...';
    onScanPage();
  } else if (mode === 'browse') {
    searchInput.placeholder = 'Filter sections...';
    searchInput.value = '';
    showBrowseView();
  }
}

function onSearchInput() {
  clearTimeout(searchDebounceTimer);
  const query = searchInput.value.trim();
  if (query.length < 3) {
    resultsList.innerHTML = '';
    emptyState.style.display = 'block';
    searchMeta.textContent = '';
    return;
  }
  searchDebounceTimer = setTimeout(() => runSearch(query), 300);
}

function runSearch(query) {
  if (!query) return;
  const t0 = performance.now();
  const results = search(query, { k: 15, minScore: 0.01 });
  const ms = (performance.now() - t0).toFixed(0);
  searchMeta.textContent = `${results.length} results in ${ms}ms`;
  renderResults(results);
}

async function onScanPage() {
  scanBtn.classList.add('scanning');
  searchMeta.textContent = 'reading page...';
  resultsList.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  emptyState.style.display = 'none';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) { searchMeta.textContent = 'no active tab'; scanBtn.classList.remove('scanning'); return; }

    const pageData = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, { type: 'extract-text' }, (resp) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(resp);
      });
    });

    if (!pageData || !pageData.chunks || pageData.chunks.length === 0) {
      searchMeta.textContent = 'no readable text on this page';
      resultsList.innerHTML = '';
      emptyState.style.display = 'block';
      scanBtn.classList.remove('scanning');
      return;
    }

    const t0 = performance.now();
    const results = searchPage(pageData.chunks, { k: 15, minScore: 0.01 });
    const ms = (performance.now() - t0).toFixed(0);

    searchMeta.textContent = `${results.length} passages · ${pageData.wordCount} words scanned · ${ms}ms`;

    const header = document.createElement('div');
    header.className = 'scan-header';
    header.innerHTML = `What the source says about: <span class="page-title">${esc(pageData.title)}</span>`;

    resultsList.innerHTML = '';
    resultsList.appendChild(header);
    renderResults(results, true);
  } catch (err) {
    console.error('[Source Lens] Scan failed:', err);
    searchMeta.textContent = 'scan failed — try refreshing the page';
    resultsList.innerHTML = '';
    emptyState.style.display = 'block';
  }
  scanBtn.classList.remove('scanning');
}

function showBrowseView() {
  emptyState.style.display = 'none';
  const chapters = getChapters();

  resultsList.innerHTML = chapters
    .map(ch => {
      const label = ch.title.length > 60 ? ch.title.slice(0, 58) + '...' : ch.title;
      return `<div class="result-card" data-chapter="${ch.num}">
        <div class="result-header"><span class="result-chapter">Section ${ch.num}</span></div>
        <div class="result-text">${esc(label)}</div>
      </div>`;
    }).join('');

  resultsList.querySelectorAll('.result-card').forEach(card => {
    card.addEventListener('click', () => {
      const ch = parseInt(card.dataset.chapter, 10);
      setMode('search');
      searchInput.placeholder = `Search section ${ch}...`;
      searchInput.focus();
      searchInput.addEventListener('input', function handler() {
        clearTimeout(searchDebounceTimer);
        const q = searchInput.value.trim();
        if (q.length < 3) return;
        searchDebounceTimer = setTimeout(() => {
          const t0 = performance.now();
          const results = search(q, { k: 15, chapter: ch });
          searchMeta.textContent = `${results.length} results in section ${ch} · ${(performance.now()-t0).toFixed(0)}ms`;
          renderResults(results);
        }, 300);
      });
    });
  });
}

function renderResults(results, showChunk = false) {
  if (results.length === 0) {
    if (!resultsList.querySelector('.scan-header')) resultsList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  const html = results.map((r, idx) => {
    const f = r.fragment;
    const pct = (r.score * 100).toFixed(0);
    const cls = r.score > 0.3 ? 'high' : r.score > 0.15 ? 'mid' : 'low';
    const section = f.st !== '(beginning)' && f.st !== '(full text)' && f.st !== '(body)'
      ? `<div class="result-section">${esc(f.st)}</div>` : '';
    const chunk = showChunk && r.matchedChunk
      ? `<div class="result-matched"><span class="label">page:</span> ${esc(r.matchedChunk.slice(0,150))}...</div>` : '';
    return `<div class="result-card" data-index="${idx}">
      <div class="result-header">
        <span class="result-chapter">${esc(f.ct)}</span>
        <span class="result-score ${cls}">${pct}%</span>
      </div>${section}
      <div class="result-text">${esc(f.p)}</div>${chunk}
    </div>`;
  }).join('');

  const header = resultsList.querySelector('.scan-header');
  if (header) {
    resultsList.querySelectorAll('.result-card').forEach(c => c.remove());
    resultsList.insertAdjacentHTML('beforeend', html);
  } else {
    resultsList.innerHTML = html;
  }

  resultsList.querySelectorAll('.result-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      showDetail(results[idx]);
    });
  });
}

function showDetail(result) {
  const f = result.fragment;
  detailContent.innerHTML = `
    <div class="detail-meta">
      <span><span class="label">Relevance:</span> ${(result.score*100).toFixed(1)}%</span>
      <span><span class="label">Source:</span> ${esc(f.ct)}</span>
      <span><span class="label">Section:</span> ${esc(f.st)}</span>
      <span><span class="label">Words:</span> ${f.wc}</span>
      <span><span class="label">ID:</span> ${esc(f.id)}</span>
    </div>
    <div class="detail-text">${esc(f.t)}</div>`;
  detailPanel.classList.remove('hidden');
}

function esc(t) {
  const d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

startup();
