# Source Lens: A Curriculum

## Digital Sovereignty Through Primary Sources

### Overview

This is a 6-week curriculum that ends with students building their own AI-powered research tool. But it starts somewhere else entirely — with the question of who thinks for you, and whether you've chosen them.

The tool is not the point. The tool is the proof that they understood.

Two formats are provided:
- **Format A**: 45-minute periods, once per week (6 sessions)
- **Format B**: 90-minute blocks, three times per week (6 weeks, 18 sessions)

Both follow the same arc. Format B has room to breathe, discuss, and go deeper. Format A moves faster and relies more on work between sessions.

---

## The Arc

```
Week 1: Who's talking?
Week 2: What did they actually say?
Week 3: Where does meaning live?
Week 4: Building the machine
Week 5: Testing the machine
Week 6: What did we learn?
```

The first three weeks don't touch a computer. That's deliberate.

---

## Making It Yours: Adapting Source Lens With AI Assistance

### Why this isn't edtech

Edtech builds something for you and sells it back to you. The sales pitch requires you to feel overwhelmed so the product can feel like relief. The business model depends on your dependence.

This is the opposite. Source Lens is a starting point you own completely. The code is yours. The lesson plan is yours. The adaptations you make for your students — their reading levels, their IEPs, their languages, their interests — those are yours too. No vendor will ever understand your classroom the way you do.

The question you should be asking is not "does this tool meet all the guidelines?" The question is: "do I have the power to make it meet the guidelines that matter for *my* students?" The answer is yes, and here's how.

### Using Claude Code (or any AI coding assistant) to adapt Source Lens

You can point an AI coding tool at this repo and have a conversation about what you need. This isn't outsourcing the work. It's the same thing you do when you talk to a colleague about a lesson plan — except this colleague can also write the code.

Here's what that looks like in practice.

**Clone the repo and open it with Claude Code:**

```bash
git clone https://github.com/SuperLeaders-IO/source-lens.git
cd source-lens
claude
```

Then describe what you need in plain language:

**For accessibility:**
- "The side panel text is too small for my low-vision students. Increase the base font size to 16px and add a font size toggle in the UI."
- "Add high-contrast mode that meets WCAG AAA contrast ratios."
- "Make sure all interactive elements are keyboard-navigable and have proper ARIA labels."
- "Add a screen reader announcement when search results appear."
- "My student uses a switch device. Make sure the tab order in the side panel is logical and that every button has a visible focus indicator."

**For language and reading level:**
- "Translate the interface labels into Spanish."
- "My students read at a 6th grade level. Add a toggle that shows a simplified preview of each passage — shorter sentences, common words."
- "Add a word count and estimated reading level to each result card so students can choose passages they're comfortable with."

**For different needs:**
- "One of my students is deaf. When they scan a page, also show the passage as a highlighted overlay on the page itself, not just in the sidebar."
- "Add a 'read aloud' button that uses the browser's built-in text-to-speech to read the selected passage."
- "My students have 504 plans that require extended time. Add a timer to the scan results that shows how long they've been reading each passage."

**For your specific curriculum:**
- "I teach 8th grade US History. Rewrite the lesson plan for that context, focusing on primary sources from the Civil War and Reconstruction."
- "I need this for AP Literature. Modify the compare mode so students can load two novels and see where their themes overlap."
- "Add a 'cite this' button that formats the passage as an MLA citation so students can paste it into their essays."

**For district compliance:**
- "My district requires FERPA compliance documentation. Add a section to the README explaining that no student data leaves the browser."
- "Generate a VPAT (Voluntary Product Accessibility Template) for this tool based on what it currently does and doesn't do."
- "My district's ed tech review board needs a data flow diagram. Create one showing that all processing happens locally."

### The point is not that AI writes perfect code

The AI will get things mostly right and sometimes wrong. You'll test it. You'll adjust. You'll say "that's not quite what I meant" and refine. That process — describing what your students need, evaluating the result, iterating — is the same process your students are doing with Source Lens. You're modeling it.

And when you bring that modified version into your classroom and say "I changed the tool this weekend because I realized the font was too small for some of you" — that's a more powerful lesson about technology than any curriculum unit. You just showed them that tools serve people, not the other way around.

### Accessibility is not a checklist you buy

The edtech industry sells accessibility as a feature. "Our platform is WCAG 2.1 AA compliant." That sounds reassuring. But compliance is a floor, not a ceiling. It means the tool passes automated tests. It doesn't mean it works for *your* student, in *your* classroom, with *their* specific needs.

When you build the tool — or when you modify a tool you own — you can go beyond compliance:

- **You know your students.** A vendor's accessibility team doesn't know that Marcus needs the text to be left-aligned, not justified, because of his dyslexia. You know that. You can change it.
- **You can respond in real time.** A student says "I can't read the results, they're too light." You open the CSS, change a color, reload. Done. A vendor ticket for the same request takes weeks.
- **You can make choices a vendor won't.** Maybe you want the tool to be intentionally simple — fewer features, less distraction — because your students are overwhelmed by complex UIs. No vendor will ship a "less" button. You can build one.

The answer to "how do you ensure accessibility requirements are met?" is: by being the person who meets them, for the specific people who need them met, in the specific way they need it. That can't be purchased. It can only be practiced.

### Building alongside students

The most powerful version of this is when you don't do the adapting alone. You do it with students.

"Our tool doesn't work well for screen readers yet. Who wants to fix that?"

A student who spends an afternoon adding ARIA labels to a search interface has learned more about accessibility than any lecture could teach. They've learned that accessibility is not an abstract requirement — it's a specific act of care for a specific person.

A student who translates the interface into their home language has learned something about themselves and their community's place in technology. That's not a feature request. That's identity.

A student who changes the chunk size because their source works better with shorter passages has learned that every engineering decision is a judgment call, and they're qualified to make it.

This is what building looks like. It's not clean. It's not polished. It won't pass a vendor demo. But it belongs to the people who made it, and that makes all the difference.

### A practical starting point

If you've never used a coding assistant before, here's your version of the terminal courage moment:

1. Install Claude Code or open any AI coding tool
2. Point it at the Source Lens repo
3. Say: "I'm a teacher. I've never modified code before. I need to make the side panel text bigger for a student with low vision. Walk me through it."
4. Follow the steps. Test it. See it change.

That's it. You just modified an AI system to meet a student's needs. No ticket filed. No vendor contacted. No procurement cycle. You did it yourself, and it took five minutes.

Now imagine what else you could do.

---

## Week 1: Who's Talking?

### The question

When you read something online, who decided you would see it? When you ask an AI a question, who's answering?

### Format A (45 min)

**Activity**: The teacher projects a news headline and asks: "What do you know about this topic?" Students share. Then the teacher shows the same story from three different sources — a wire service, an opinion piece, and a social media post. Same event, different framing.

**Discussion**: Where did your first reaction come from? Not which source — which person, which experience, which assumption? Can you trace it?

**Closing provocation**: "When you ask ChatGPT a question, it answers confidently. But it has no experiences, no assumptions it can trace, no reason for its confidence. It's performing knowledge. What's the difference between performing knowledge and having it?"

**Take-home**: Find one thing you believe about the world and try to trace it back to where you first encountered it. Bring it next week.

### Format B (3 x 90 min)

**Session 1 — Who curates your reality?**

Open with: "Take out your phone. Open whatever app you open first in the morning. What's the first thing you see?" Go around the room. Write them on the board.

Now ask: "Who decided that was the first thing you'd see today?" This is not a rhetorical question. Trace it. An algorithm. Based on what? Your past behavior. Meaning your past self is deciding what your present self encounters. Is that freedom?

Activity: Students pair up and swap phones for 10 minutes (voluntary — no pressure). Each person browses the other's feed. Report back: what surprised you? What was completely absent from your world that's all over theirs?

Discussion: The word "curate" used to mean a person in a museum carefully selecting what to display. Now an algorithm does it. Is that the same thing?

**Session 2 — The confidence problem**

Open a chatbot in front of the class. Ask it: "Who wrote the Declaration of Independence?" It answers correctly. Now ask: "What did Thomas Jefferson say about internet privacy?" It will generate a confident, plausible, completely fabricated answer.

Ask students: "How did the tone of the answer change between the real question and the fake one?" It didn't. That's the problem.

Activity: Students each write one true question and one absurd question about a historical topic they know well. They ask both to a chatbot. They compare the confidence level of the answers.

Discussion: What does it mean when a tool is equally confident whether it's right or wrong? Would you trust a friend like that? A teacher? A doctor?

**Session 3 — Performing thinking vs. doing thinking**

Ask: "What's the difference between asking someone what they think and asking them to pretend to think?"

Activity: Half the class asks a chatbot to "analyze the Constitution's stance on executive power." The other half reads Article II of the Constitution directly — just the text, no help — and writes three things they notice.

Compare results. The chatbot's analysis is polished, organized, confident. The students' observations are rougher, more uncertain, more honest. Which group learned more?

Discussion: "The chatbot did the thinking for Group A. Group B did the thinking themselves. Both produced a result. But only one group changed." What does that mean?

---

## Week 2: What Did They Actually Say?

### The question

Before we can think critically about a source, we have to actually read it. Not a summary. Not an analysis. The words someone chose, in the order they chose them.

### Format A (45 min)

**Activity**: Hand out a single page from a primary source relevant to your subject area — a paragraph from the Constitution, a page from a slave narrative, a section of Darwin, a passage from *Silent Spring*, whatever fits your class. No context. No introduction. Just the text.

Students read it silently. Then write three observations: one thing they understood, one thing they didn't, one thing that surprised them.

Go around the room. The observations will vary wildly. That's the point. The text didn't change. The readers brought different things to it.

**Closing**: "A chatbot would give you one interpretation. This room just produced twenty. Which is more useful for understanding?"

**Take-home**: Find the full text of this source online. Read the section before and after the passage we looked at. Write one thing that changes when you see the context.

### Format B (3 x 90 min)

**Session 1 — Reading without guardrails**

Same primary source activity, but longer. Give students 20 minutes with a 2-3 page excerpt. No guiding questions. No vocabulary list. No pre-reading. Just the text.

After reading, ask: "What was that experience like?" Some will say frustrating. Some will say boring. Some will say confusing. Good. Name what happened: you just did something a chatbot cannot do. You sat with difficulty and stayed.

Activity: Now give them a chatbot summary of the same passage. Compare. What did the summary capture? What did it flatten? What disappeared?

**Session 2 — The same text, different lenses**

Give three groups the same primary source passage. Each group gets a different question to read through:
- Group 1: "What does this text assume about human nature?"
- Group 2: "Who is this text written for? Who is excluded?"
- Group 3: "What would someone who disagrees with this text say?"

Same words. Three different readings. All valid. None generated by a machine.

Discussion: "When a chatbot reads this text, it gives one reading. You just produced three. And you can explain *why* you read it that way. The chatbot can't."

**Session 3 — Primary vs. secondary**

Students browse Wikipedia or a textbook entry about the topic of their primary source. Side by side: the source and the summary.

Activity: Mark every claim in the secondary source that you can find direct support for in the primary source. Mark every claim that goes beyond what the primary source says.

Discussion: "The summary tells you what to think. The source makes you figure it out. Which one is education?"

---

## Week 3: Where Does Meaning Live?

### The question

How do you find relevant information without someone (or something) pre-selecting it for you?

### Format A (45 min)

**Activity — The human search engine**: Give students a stack of 20 printed passages from a primary source (cut up, shuffled). Give them a question. They sort the passages by relevance — most relevant on top, least relevant on the bottom.

Then compare their rankings. They won't agree. That's the lesson. Relevance is not a property of the text. It's a relationship between the text and the question you brought to it.

**Explain** (briefly): "What you just did by hand — sorting passages by relevance — is what Source Lens does with math. It turns text into numbers that represent meaning, then finds the closest match. Next week, you're going to build that."

**Take-home**: Pick a primary source for your project. It should be something you care about, something long enough to be interesting (at least 3-4 pages), and something you can get as a text file. Bring it next week.

### Format B (3 x 90 min)

**Session 1 — Search engines and what they hide**

Open with: "When you Google something, you get results. Who decided the order?" Discuss PageRank at a very high level: popularity, links, engagement. Ask: "Is the most popular result the most true? The most relevant to *your* question?"

Activity: Students search the same question on Google, on a library database, and by asking a chatbot. Compare the first three results from each. How are they different? What's missing from each?

Discussion: Every search tool makes choices about what matters. When you use it, you inherit those choices. Digital sovereignty starts with knowing what choices are being made for you.

**Session 2 — Numbers that mean something**

This is the conceptual bridge to embeddings. No code yet. Just the idea.

Activity: Give students five words: "freedom," "liberty," "justice," "prison," "democracy." Ask them to place these words on a piece of paper — close together if they're related, far apart if they're not.

Compare the maps. They'll be different. But there will be patterns — "freedom" and "liberty" will be close on most maps. "Prison" will be far from "freedom" on most maps. But not all. And the disagreements are interesting.

Explain: "What you just did is what an embedding model does. It places every word — every passage — in a space where similar things are near each other. The model was trained on billions of sentences, so its sense of 'similar' is shaped by how humans actually use language. It's not perfect. It's not magic. It's a map. And like all maps, it's useful but not the territory."

**Session 3 — Choosing your source**

Students choose their primary source for the project. This is the most important decision they'll make.

Guide them: "Pick something you actually want to understand. Not something short and easy — something substantial enough that you couldn't memorize it. Something where having a search tool would genuinely help you."

Suggestions by subject:
- History: A speech, a memoir, a founding document, a set of letters
- English: A novel, a play, a long poem, an author's collected essays
- Science: Darwin's *Origin of Species*, Carson's *Silent Spring*, a major research paper
- Government: The Constitution, the Federalist Papers, a Supreme Court ruling
- Philosophy: A Platonic dialogue, Wollstonecraft's *Vindication*, Du Bois's *Souls of Black Folk*

Students find their source as a text file (Project Gutenberg, government websites, copy-paste from a PDF). If they need help, help them. This is part of the skill.

---

## Week 4: Building the Machine

### The question

What happens when you build a tool instead of downloading one?

### Format A (45 min)

Students need Node.js installed and the Source Lens repo cloned before this session. If possible, assign this as the take-home from Week 3 with step-by-step instructions. If your school has a computer lab, do it together.

**Activity — The build**:

Walk through it together, live, on a projector:

```bash
cd source-lens
node build.js sources/my-source.txt --title "My Source" --author "The Author"
```

Everyone runs it at the same time. When the terminal says "Your Source Lens is ready!" — that's the moment. They built it.

Load the extension in Chrome together. Open a website. Open the side panel. Search.

The room will get loud. Let it.

**Closing**: "You just built an AI tool. You chose the training data. You ran the pipeline. You can see every file it created. No company sold this to you. No subscription. No terms of service. It's yours."

### Format B (3 x 90 min)

**Session 1 — Setup and first build**

Do the setup in class. Install Node.js. Clone the repo. This will take time. Students will hit errors. That's fine. Pair them up. The student who gets it working first helps the next one.

Build with the example file first so everyone sees it work before using their own source.

Discussion while waiting: "When an app doesn't work, you contact support. When a tool you built doesn't work, you read the error message. Which skill serves you for the rest of your life?"

**Session 2 — Building with your own source**

Students run the build with their chosen source. Walk the room. Troubleshoot. Common issues:
- File encoding (save as UTF-8)
- File too short (need at least a page or two)
- Path errors (spaces in file names)

Every error is a lesson. Name what happened. "The computer told you exactly what went wrong. That's more honest than most software, which just shows you a spinner and hopes you go away."

After building, students open the extension, search their source, and browse a web page. Have them write down the first three results they see and whether they seem relevant. This is evaluation — they're assessing the tool they built.

**Session 3 — Under the hood**

Open `build.js` in a text editor. On the projector. Read it together. Not every line — the structure.

"Here's where it reads your file. Here's where it splits it into passages. Here's where it turns each passage into numbers. Here's where it saves them."

Ask: "What would you change?" Someone will say the chunk size. Someone will say the overlap. Someone will say the number of results. Good. They're thinking like builders now.

Optional: students modify a parameter (change `CHUNK_SIZE` from 600 to 400), rebuild, and compare results. Same source, different engineering choice, different output. That's what engineering is.

---

## Week 5: Testing the Machine

### The question

How do you know if a tool you built is good? How do you know when it fails?

### Format A (45 min)

**Activity**: Students browse three different web pages with their source loaded. For each page, they record:
- The query or page topic
- The top 3 results from Source Lens
- A rating: "relevant," "somewhat relevant," or "miss"

Then they try to break it. Find a query where it fails. Where it returns something irrelevant. Where it misses something obvious.

**Discussion**: "Every tool has limits. The ones that scare me are the ones that hide their limits. ChatGPT doesn't tell you when it's wrong. Your tool showed you exactly when it missed. Which do you trust more?"

### Format B (3 x 90 min)

**Session 1 — Evaluation**

Students systematically test their Source Lens with 10 queries: 5 they expect to work well, 5 designed to be hard (synonyms, abstract concepts, questions the source doesn't address directly).

They record results in a table. This is data. They're evaluating an AI system — something most adults in their lives have never done.

Discussion: "When a tech company tests their AI, they do exactly this. They call it 'benchmarking.' You just benchmarked your own system. What did you learn about its strengths and weaknesses?"

**Session 2 — Compare mode**

Students pair up. Same web page, different sources loaded. They browse together, comparing what their sidebars show.

This is the session where the curriculum comes alive. Two students reading the same article about democracy — one with the Constitution loaded, one with Plato's *Republic* — will see completely different passages surface. Neither is wrong. Both are illuminating. The disagreement between sources is where insight lives.

Activity: Each pair writes a short comparison. "When we browsed [article], my source said [passage] and their source said [passage]. Here's what that contrast reveals about how these two authors think about [topic]."

**Session 3 — What the tool can't do**

This is the most important session.

Ask: "What can't Source Lens do?" Collect answers. They'll say things like:
- It can't tell you if the source is right
- It can't understand sarcasm or irony
- It misses things when different words mean the same thing
- It can't read between the lines
- It doesn't know what you don't know

Write these on the board. Then ask: "Can ChatGPT do these things?" The honest answer is: also no, but it pretends it can. Source Lens fails visibly. The chatbot fails invisibly.

"Which kind of failure teaches you more?"

---

## Week 6: What Did We Learn?

### The question

What does it mean to think for yourself in a world full of machines that think for you?

### Format A (45 min)

**Final presentations**: Each student presents in 3 minutes:
1. What source they chose and why
2. One moment where Source Lens showed them something they wouldn't have found on their own
3. One moment where it failed and what that taught them
4. One thing they understand about AI now that they didn't before

**Closing**: "You built a tool. You tested it. You found its limits. Most people who use AI every day have never done any of these things. You have. That changes how you move through the world."

### Format B (3 x 90 min)

**Session 1 — Writing**

Students write a reflection (1-2 pages). Prompts:

- "Before this unit, when I heard 'AI,' I thought ___. Now I think ___."
- "The moment I understood what my tool was actually doing was when ___."
- "The biggest difference between asking a chatbot and using Source Lens is ___."
- "One thing I want to build next is ___."

**Session 2 — Presentations**

Each student presents their source, their Source Lens, and their key finding. They demo it live — open a web page, show the sidebar, explain what the source says and what it means.

The class asks questions. Not about the tool — about the source. The tool becomes invisible. The thinking becomes visible. That's how you know it worked.

**Session 3 — What's next**

Open discussion. Where does this go?

Some directions students might raise:
- "Can we load multiple sources at once?"
- "Can we share our Source Lens with other students?"
- "What if we built one for the whole school library?"
- "What if we used this for college research?"
- "What if the search was better?" (This opens the door to ONNX, to semantic embeddings, to the deeper technical path)

Let them dream. Then remind them: "Six weeks ago, you had never opened a terminal. Now you're designing AI systems. That's not because the tool is easy. It's because you're capable of hard things."

---

## Assessment

### What you're grading

Not the tool. Not the code. Not whether their Source Lens "works well."

You're grading:
- **Source selection**: Did they choose something substantial and defend that choice?
- **Evaluation**: Can they articulate where the tool works and where it fails?
- **Interpretation**: When the tool surfaced a passage, did they engage with what it means — or just report that it appeared?
- **Reflection**: Do they understand something about AI, about primary sources, and about their own thinking that they didn't understand before?

### What you're not grading

- Technical skill. Some students will breeze through the setup. Others will struggle. The struggle is learning, not failure.
- Quality of the tool's output. The hash-based search is imperfect. That's a feature. Perfect tools don't teach you anything.

---

## Materials needed

- Computers with Chrome browser
- Node.js installed (free, any platform)
- Internet access (for cloning the repo and finding source texts)
- A projector for demos
- Primary source texts in `.txt` format
- Patience with error messages (yours and theirs)

---

## A note on digital sovereignty

This curriculum uses the phrase "digital sovereignty" without defining it in class. That's intentional. By Week 6, students will have a felt sense of what it means — not because someone explained it to them, but because they experienced it.

They chose their own source instead of accepting a pre-built curriculum.
They built their own tool instead of logging into a vendor platform.
They evaluated their own system instead of trusting a black box.
They did their own thinking instead of outsourcing it to a chatbot.

That's digital sovereignty. It's not a concept to be taught. It's a capacity to be developed.

For students who have grown up inside algorithmic recommendation systems, this may be genuinely disorienting. The absence of a feed, a suggestion, a notification — the silence of a tool that only responds when asked — can feel like deprivation rather than liberation. That's okay. Name it. "This feels different because nothing is trying to capture your attention right now. The tool is waiting for you. Not the other way around."

That reorientation — from consumer to builder, from audience to author, from user to sovereign — is the actual curriculum. The primary sources are the vehicle. The tool is the proof. But the transformation is in the student.
