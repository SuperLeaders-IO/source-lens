# Source Lens

**Browse the web through the lens of any primary source document.**

Source Lens is a Chrome extension that lets students carry a book, speech, legal document, or any text as a research companion while they browse the internet. As you read any web page, the source document responds — surfacing the most relevant passages in real time.

This is not AI generating opinions. It retrieves **real passages from real documents** based on the similarity of ideas. The source speaks for itself. The student does the thinking.

---

## Why not just use ChatGPT?

You could ask a chatbot to "act like Thomas Jefferson" or "analyze this article from the perspective of the Constitution." Students do this. Teachers assign this. It feels like critical thinking. But it isn't.

Here's the difference:

| | ChatGPT / Gemini | Source Lens |
|---|---|---|
| **What it does** | Generates new text that sounds like it could be from a source | Retrieves the actual text from the actual source |
| **Who's speaking** | The AI, performing a persona | The author, in their own words |
| **Can you verify it?** | Not easily — the AI may paraphrase incorrectly, merge ideas from different sources, or invent plausible-sounding passages that don't exist | Every result is a real passage you can read in full, check against the original, and cite |
| **What the student does** | Reads AI-generated analysis and accepts or rejects it | Reads the primary source and decides for themselves what it means |
| **The failure mode** | The student outsources their thinking to a confident-sounding machine | The student has to do the interpretive work — the tool only finds relevant passages, it doesn't tell them what to think |

### The deeper problem with AI personas

When a student asks ChatGPT to "respond as Frederick Douglass," the AI generates a fluent, confident answer that *sounds* authoritative. The student reads it, nods, and moves on. They never encountered Douglass's actual prose — his specific word choices, his rhetorical structure, his silences and omissions. They encountered a machine's statistical guess at what Douglass might have sounded like.

This is **performative thinking**. It has the shape of engagement with a primary source without the substance.

Source Lens works differently. When a student browses a news article about prison reform with Douglass's *Narrative* loaded in the sidebar, the tool surfaces the passages from the *Narrative* that are most topically related to what they're reading. The student sees Douglass's actual words. They have to decide: is this relevant? Does this passage speak to what I'm reading? What does the gap between 1845 and today reveal?

That's **critical thinking** — the student is doing the interpretive work, not consuming a machine's interpretation.

### What AI personas get wrong

- **They hallucinate.** A chatbot told to speak as the Constitution will confidently cite amendments that don't exist or merge clauses from different articles. Source Lens can't hallucinate — it only returns text that's actually in the document.
- **They flatten.** A persona prompt produces a single "voice" when real thinkers contradict themselves, evolve over time, and contain multitudes. Source Lens shows you multiple passages that may be in tension with each other. That tension is where learning happens.
- **They skip the hard part.** The hard part of working with primary sources is sitting with difficult, unfamiliar language and figuring out what it means. AI personas do that work for the student. Source Lens refuses to.

---

## Classroom Examples

### US Government: The Constitution vs. the news

Load the full text of the US Constitution. Students browse current news coverage — executive orders, Supreme Court decisions, congressional debates — with the constitutional text responding in the sidebar.

**The assignment:** For three news articles this week, identify which constitutional passages Source Lens surfaces. Do the articles reference these passages? Do they frame the issue differently than the Constitution does? Write about one case where the gap between the news framing and the constitutional text surprised you.

**What students discover:** News coverage often invokes broad concepts ("freedom of speech," "executive power") without engaging the specific constitutional language. When students see the actual text alongside the coverage, they notice what's being simplified, omitted, or reframed.

### History: The Narrative of Frederick Douglass vs. modern commentary

Load Douglass's *Narrative of the Life of Frederick Douglass* (1845, public domain). Students browse Wikipedia articles, museum websites, or modern essays about slavery, abolition, or civil rights.

**The assignment:** Browse three different sources about slavery or abolition. For each, record which passages from the *Narrative* appear in the sidebar. Then answer: what does Douglass's firsthand account add that the secondary source leaves out? What does the secondary source explain that Douglass's account assumes you already know?

**What students discover:** The difference between a primary and secondary source isn't abstract — it's visceral. Douglass's language is more precise, more uncomfortable, and more human than any summary.

### Philosophy: Plato's Republic vs. contemporary politics

Load *The Republic* (public domain, many translations available as .txt). Students browse news about democracy, justice, education policy, or inequality.

**The assignment:** Search Source Lens for "justice," "democracy," and "education" while browsing related news articles. Identify one idea from Plato that is still alive in current debate and one idea that modern discourse has abandoned entirely. Why?

**What students discover:** That philosophical arguments from 2,400 years ago are not museum pieces. Some are startlingly relevant. Others reveal how much our assumptions have shifted — which is itself a discovery.

### Media Literacy: Any trusted source vs. its coverage

Load any primary source — a scientific report, a court ruling, a policy document, a speech transcript. Students browse news coverage of that source.

**The assignment:** Compare what the primary source actually says with how three different news outlets cover it. Use Source Lens to find the specific passages being referenced (or misrepresented). Where does the coverage accurately reflect the source? Where does it simplify, editorialize, or omit?

**What students discover:** That "reporting on a document" and "the document itself" are different things. That framing choices are choices. That they can check.

### Literature: The novel vs. the critics

Load a novel or long poem the class is studying (use any .txt version). Students browse book reviews, SparkNotes, literary criticism, or other analysis.

**The assignment:** For one piece of literary criticism, identify which passages from the original novel Source Lens surfaces as most relevant. Does the critic engage with these passages directly? Are there passages the critic ignores that seem important? Write about what the critic sees that you might have missed — and what the critic misses that the text reveals.

**What students discover:** That literary criticism is a conversation with the text, not a replacement for it. And that they can join that conversation.

---

## What Students Learn

- **Primary source fluency.** They work with the actual document repeatedly, across different contexts, until its language becomes familiar.
- **The difference between a source and a summary.** They see it side by side, on every page they visit.
- **That ideas have histories.** Today's headlines echo arguments made centuries ago. The tool makes this visible.
- **How to question framing.** Every news article, every Wikipedia page, every textbook carries assumptions. A primary source in the sidebar surfaces those assumptions by contrast.
- **That "what does the document actually say?" is always the right question.** Before interpretation, before analysis, before opinion — read the source.

---

## Quick Start

You need [Node.js](https://nodejs.org/) installed (any recent version). If you haven't used a terminal before, this is a good reason to start. You can do this.

### Step 1: Get the code

```bash
git clone https://github.com/SuperLeaders-IO/source-lens.git
cd source-lens
```

Or download and unzip from the green "Code" button on GitHub.

### Step 2: Add your document

Put a `.txt` or `.md` file in the `sources/` folder. You can copy-paste text from a PDF, a website, or any digital text.

```
sources/
  us-constitution.txt
  narrative-of-frederick-douglass.txt
  letter-from-birmingham-jail.txt
```

### Step 3: Build

Open a terminal in the `source-lens` folder and run:

```bash
node build.js sources/your-document.txt --title "The Title" --author "The Author"
```

You'll see it count the passages and confirm it's ready. That's it.

### Step 4: Load in Chrome

1. Open `chrome://extensions` in your browser
2. Turn on **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `extension` folder inside `source-lens`
5. The Source Lens icon appears in your toolbar

### Step 5: Browse

1. Go to any website
2. Click the Source Lens icon and open the side panel
3. **Search** the source document by typing any question
4. **Page Scan** — click the scan button to see what the source says about the page you're reading
5. **Click any result** to read the full passage

---

## More build examples

```bash
# A single document
node build.js sources/us-constitution.txt --title "US Constitution" --author "1787"

# A book
node build.js sources/walden.txt --title "Walden" --author "Henry David Thoreau"

# Multiple documents at once
node build.js sources/ --title "Civil Rights Primary Sources" --author "Various"

# See all options
node build.js --help
```

---

## How it works

1. **Reads** your document and detects its structure (chapters, sections, headings)
2. **Splits** it into overlapping passages (~600 characters each) so nothing falls between the cracks
3. **Creates vectors** — each passage becomes a list of 384 numbers that represent its meaning
4. **Saves** everything into the `extension/data/` folder
5. When you search or scan a page, the extension compares the page's meaning against every passage and shows the closest matches

Retrieval takes 3-5 milliseconds. Everything runs locally in your browser. No data is sent anywhere. No internet connection needed after the initial setup.

---

## Supported formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Plain text | `.txt` | Any text file works |
| Markdown | `.md` | Headings become sections, formatting is stripped |

For PDFs: open the PDF, select all text (Ctrl+A / Cmd+A), copy, and paste into a `.txt` file. This works for most documents.

---

## Limitations

- The search finds **topically related** passages, not perfect semantic matches. It's good at "this passage is about the same subject" but it doesn't understand nuance the way a human reader does. This is a feature, not a bug — the student supplies the nuance.
- Very short documents (under 1 page) produce few passages and limited results. This tool works best with substantial texts.
- Works in Chrome and Chromium browsers (Edge, Brave, Arc). Firefox does not support the Side Panel API yet.

---

## File structure

```
source-lens/
  build.js              ← The one command you run
  sources/              ← Drop your documents here
    example.txt
  extension/            ← Load this folder in Chrome
    manifest.json
    sidepanel.html/js   ← The side panel UI
    content.js          ← Extracts text from web pages
    background.js       ← Extension lifecycle
    lib/search-engine.js ← Vector search engine
    data/               ← Generated by build.js
      fragments.json
      vectors.bin
      manifest.json
    styles.css
    popup.html
    icons/
```

---

## License

MIT. Use it, share it, modify it, teach with it.

Built with [ruvector](https://github.com/ruvnet/ruvector).
