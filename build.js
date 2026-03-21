#!/usr/bin/env node
/**
 * Source Lens — Build Tool
 *
 * Takes any text document and turns it into a Chrome extension that lets
 * students browse the web with that document as a research companion.
 *
 * Usage:
 *   node build.js sources/the-republic.txt
 *   node build.js sources/my-essay.md --title "My Essay" --author "Jane Smith"
 *   node build.js sources/                   # Process all files in the folder
 *
 * Supported formats: .txt, .md
 *
 * What it does:
 *   1. Reads your document
 *   2. Splits it into passages (~500 characters each, with overlap)
 *   3. Creates searchable vectors for each passage
 *   4. Saves everything into extension/data/
 *   5. The Chrome extension is ready to load
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CHUNK_SIZE = 600;       // Characters per passage
const CHUNK_OVERLAP = 150;    // Overlap between passages
const MIN_CHUNK_SIZE = 80;    // Ignore passages shorter than this
const DIM = 384;              // Embedding dimensions
const EXT_DIR = path.join(__dirname, 'extension', 'data');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
  Source Lens — Build Tool

  Turn any document into a browsing companion for students.

  Usage:
    node build.js <file-or-folder> [options]

  Examples:
    node build.js sources/the-republic.txt
    node build.js sources/my-notes.md --title "Civil Rights" --author "Class Notes"
    node build.js sources/                   # all .txt and .md files in folder

  Options:
    --title  "Title"     Name of the source (default: filename)
    --author "Author"    Author name (default: "Unknown")
    --help               Show this help

  After building, load the extension in Chrome:
    1. Open chrome://extensions
    2. Turn on "Developer mode" (top right)
    3. Click "Load unpacked"
    4. Select the "extension" folder inside source-lens
    5. Open any website and click the Source Lens icon
  `);
  process.exit(0);
}

// Parse arguments
const inputPath = args[0];
const titleIdx = args.indexOf('--title');
const authorIdx = args.indexOf('--author');
const customTitle = titleIdx !== -1 ? args[titleIdx + 1] : null;
const customAuthor = authorIdx !== -1 ? args[authorIdx + 1] : 'Unknown';

// ---------------------------------------------------------------------------
// File reading
// ---------------------------------------------------------------------------

function getInputFiles(inputPath) {
  const resolved = path.resolve(inputPath);
  const stat = fs.statSync(resolved);

  if (stat.isFile()) {
    return [resolved];
  }

  if (stat.isDirectory()) {
    return fs.readdirSync(resolved)
      .filter(f => f.endsWith('.txt') || f.endsWith('.md'))
      .filter(f => !f.startsWith('.'))
      .sort()
      .map(f => path.join(resolved, f));
  }

  console.error(`Not a file or directory: ${inputPath}`);
  process.exit(1);
}

function readDocument(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath, ext);

  // Clean up the text
  let text = raw
    .replace(/\r\n/g, '\n')        // Normalize line endings
    .replace(/\t/g, '  ')          // Tabs to spaces
    .replace(/ {3,}/g, '  ')       // Collapse extra spaces
    .trim();

  // For markdown, strip some formatting but keep structure
  if (ext === '.md') {
    text = text
      .replace(/^#{1,6}\s+/gm, '')           // Strip heading markers (keep text)
      .replace(/\*\*([^*]+)\*\*/g, '$1')      // Bold → plain
      .replace(/\*([^*]+)\*/g, '$1')          // Italic → plain
      .replace(/!\[.*?\]\(.*?\)/g, '')         // Remove images
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')  // Links → text only
      .replace(/^[-*+]\s/gm, '')              // List markers
      .replace(/^>\s/gm, '')                  // Blockquotes
      .replace(/```[\s\S]*?```/g, '')          // Code blocks
      .replace(/`([^`]+)`/g, '$1');            // Inline code
  }

  return {
    text,
    filename: basename,
    path: filePath,
  };
}

// ---------------------------------------------------------------------------
// Text structure detection
// ---------------------------------------------------------------------------

/**
 * Try to detect sections/chapters in the text.
 * Looks for common patterns: numbered sections, all-caps headings, etc.
 */
function detectSections(text) {
  const lines = text.split('\n');
  const sections = [];
  let currentTitle = '(beginning)';
  let currentLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect section headings
    const isHeading =
      // "Chapter 1: Title" or "CHAPTER ONE"
      /^(chapter|part|section|article|amendment)\s+\w/i.test(trimmed) ||
      // "I. Title" or "1. Title" (but not "1. list item" - must be short)
      (/^[IVXLCDM]+\.\s/.test(trimmed) && trimmed.length < 120) ||
      (/^\d+\.\s/.test(trimmed) && trimmed.length < 120 && /^[A-Z]/.test(trimmed.replace(/^\d+\.\s*/, ''))) ||
      // ALL CAPS lines (likely headings) - at least 4 words
      (/^[A-Z][A-Z\s,':—-]{15,}$/.test(trimmed) && trimmed.length < 150) ||
      // "** Heading" (org-mode / our format)
      /^\*{1,3}\s/.test(trimmed);

    if (isHeading && currentLines.length > 0) {
      const body = currentLines.join('\n').trim();
      if (body.length >= MIN_CHUNK_SIZE) {
        sections.push({ title: currentTitle, text: body });
      }
      currentTitle = trimmed
        .replace(/^\*{1,3}\s*/, '')
        .replace(/^(chapter|part|section)\s+\w+[:.]\s*/i, '')
        .slice(0, 100);
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Last section
  const body = currentLines.join('\n').trim();
  if (body.length >= MIN_CHUNK_SIZE) {
    sections.push({ title: currentTitle, text: body });
  }

  // If no sections detected, treat entire text as one section
  if (sections.length === 0 && text.length >= MIN_CHUNK_SIZE) {
    sections.push({ title: '(full text)', text });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Fragmentation
// ---------------------------------------------------------------------------

function fragmentText(text) {
  const trimmed = text.trim();
  if (trimmed.length < MIN_CHUNK_SIZE) return [];
  if (trimmed.length <= CHUNK_SIZE) return [trimmed];

  const chunks = [];
  let pos = 0;

  while (pos < trimmed.length) {
    const end = Math.min(pos + CHUNK_SIZE, trimmed.length);

    if (end >= trimmed.length) {
      const chunk = trimmed.slice(pos).trim();
      if (chunk.length >= MIN_CHUNK_SIZE) chunks.push(chunk);
      break;
    }

    // Find a good break point
    const window = trimmed.slice(Math.max(pos, end - 200), end);
    const sentEnd = window.search(/[.!?]\s/);
    const paraEnd = window.lastIndexOf('\n\n');
    let breakAt;

    if (sentEnd !== -1) {
      breakAt = (end - 200) + sentEnd + 2;
    } else if (paraEnd !== -1) {
      breakAt = (end - 200) + paraEnd + 2;
    } else {
      breakAt = end;
    }

    if (breakAt <= pos) breakAt = end;

    const chunk = trimmed.slice(pos, breakAt).trim();
    if (chunk.length >= MIN_CHUNK_SIZE) chunks.push(chunk);

    pos = Math.max(pos + 1, breakAt - CHUNK_OVERLAP);
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Embedding
// ---------------------------------------------------------------------------

function embedText(text) {
  const vec = new Float32Array(DIM);
  const words = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);

  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;

  for (const word of Object.keys(freq)) {
    const tf = Math.log(1 + freq[word]);

    let h = 0x811c9dc5 | 0;
    for (let i = 0; i < word.length; i++) {
      h ^= word.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    const idx = (h >>> 0) % DIM;
    const sign = ((h >>> 16) & 1) ? 1 : -1;
    vec[idx] += sign * tf;

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

  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) for (let i = 0; i < DIM; i++) vec[i] /= norm;

  return vec;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const files = getInputFiles(inputPath);
  console.log(`\n  Source Lens — Building from ${files.length} file(s)\n`);

  const allFragments = [];
  const sourceInfo = [];

  for (const filePath of files) {
    const doc = readDocument(filePath);
    const title = customTitle || doc.filename;
    console.log(`  Reading: ${path.basename(filePath)} (${(doc.text.length / 1024).toFixed(0)} KB)`);

    const sections = detectSections(doc.text);
    console.log(`    Sections: ${sections.length}`);

    let docFragCount = 0;
    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      const chunks = fragmentText(section.text);

      for (let fi = 0; fi < chunks.length; fi++) {
        const text = chunks[fi];
        const id = `${doc.filename}-s${String(si).padStart(2, '0')}-f${String(fi).padStart(3, '0')}`;

        allFragments.push({
          id,
          sourceFile: doc.filename,
          sectionTitle: section.title,
          sectionIndex: si,
          fragmentIndex: fi,
          text,
          wordCount: text.split(/\s+/).length,
          preview: text.slice(0, 150).replace(/\n/g, ' '),
        });
        docFragCount++;
      }
    }
    console.log(`    Passages: ${docFragCount}`);

    sourceInfo.push({
      file: path.basename(filePath),
      title,
      sections: sections.length,
      fragments: docFragCount,
    });
  }

  const title = customTitle || (files.length === 1
    ? path.basename(files[0], path.extname(files[0]))
    : `${files.length} sources`);

  console.log(`\n  Total passages: ${allFragments.length}`);
  console.log(`  Embedding...`);

  // Build fragments metadata
  const fragmentsMeta = allFragments.map((f, i) => ({
    i,
    id: f.id,
    ch: f.sectionIndex,
    ct: f.sourceFile,
    st: f.sectionTitle,
    wc: f.wordCount,
    t: f.text,
    p: f.preview,
  }));

  // Build vectors
  const buffer = Buffer.alloc(allFragments.length * DIM * 4);
  for (let i = 0; i < allFragments.length; i++) {
    const vec = embedText(allFragments[i].text);
    for (let d = 0; d < DIM; d++) {
      buffer.writeFloatLE(vec[d], (i * DIM + d) * 4);
    }
  }

  // Write output
  if (!fs.existsSync(EXT_DIR)) fs.mkdirSync(EXT_DIR, { recursive: true });

  fs.writeFileSync(path.join(EXT_DIR, 'fragments.json'), JSON.stringify(fragmentsMeta));
  fs.writeFileSync(path.join(EXT_DIR, 'vectors.bin'), buffer);
  fs.writeFileSync(path.join(EXT_DIR, 'manifest.json'), JSON.stringify({
    title,
    author: customAuthor,
    sources: sourceInfo,
    fragments: allFragments.length,
    dimensions: DIM,
    built: new Date().toISOString(),
  }, null, 2));

  // Update extension name/description
  const manifestPath = path.join(__dirname, 'extension', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const extManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    extManifest.name = `Source Lens: ${title}`;
    extManifest.description = `Browse the web through the lens of "${title}" by ${customAuthor}. ${allFragments.length} searchable passages.`;
    fs.writeFileSync(manifestPath, JSON.stringify(extManifest, null, 2));
  }

  const totalMB = ((buffer.length + JSON.stringify(fragmentsMeta).length) / 1024 / 1024).toFixed(1);

  console.log(`  Done! (${totalMB} MB)\n`);
  console.log(`  ┌──────────────────────────────────────────────┐`);
  console.log(`  │  Your Source Lens is ready!                  │`);
  console.log(`  │                                              │`);
  console.log(`  │  To use it:                                  │`);
  console.log(`  │   1. Open chrome://extensions                │`);
  console.log(`  │   2. Turn on "Developer mode" (top right)    │`);
  console.log(`  │   3. Click "Load unpacked"                   │`);
  console.log(`  │   4. Select the "extension" folder           │`);
  console.log(`  │   5. Go to any website                       │`);
  console.log(`  │   6. Click the Source Lens icon              │`);
  console.log(`  │                                              │`);
  console.log(`  │  "${title}"                                  `);
  console.log(`  │  ${allFragments.length} passages ready to search              │`);
  console.log(`  └──────────────────────────────────────────────┘\n`);
}

main();
