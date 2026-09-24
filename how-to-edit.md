# How to Edit Your Portfolio

**Almost everything a visitor reads lives in one file: [`data/content.js`](data/content.js).**
You don't need to touch HTML or the 3D code to change your name, text, projects, certificates or links.

The workflow is always the same:

1. Start the local preview: `python3 -m http.server 8080`, then open http://localhost:8080
2. Edit `data/content.js` and save
3. Refresh the browser (`Ctrl+Shift+R` if it looks cached)
4. When you're happy, publish it (see `deploy-guide.md`): `git add -A && git commit -m "…" && git push`

> **Golden rule for `content.js`:** it's JavaScript, so every item in a list needs a **comma** after it, and text goes inside `"double quotes"` or `` `backticks` ``. If the page goes blank after an edit, press **F12 → Console**. It shows the line with the missing comma or quote.
> If your text contains a double quote, either use backticks around it, e.g. `` `He said "hi"` ``, or write `\"`.

---

## 1. Add a project (with links)

Open `data/content.js`, find `projects: [`, and copy-paste this block **inside the square brackets**. Put it first if you want it to appear first.

```js
{
  title: "My New App",
  category: "Mobile",            // filter button name; new names create new buttons automatically
  featured: false,               // true = double-width card
  year: "2026",
  text: "One or two sentences on what it does, who it's for and what you built.",
  tags: ["React Native", "Expo", "FastAPI", "PostgreSQL"],
  image: "assets/img/projects/my-new-app.jpg",   // optional, "" = animated generated cover
  links: [
    { label: "Live",       url: "https://my-new-app.com" },
    { label: "GitHub",     url: "https://github.com/Asjad150/my-new-app" },
    { label: "Play Store", url: "https://play.google.com/store/apps/details?id=..." },
    { label: "App Store",  url: "https://apps.apple.com/app/..." },
  ],
},
```

- **Links:** add as many `{ label, url }` pairs as you like. Any link containing `github` automatically gets the GitHub icon; the rest get an arrow. Use `links: []` to show no buttons.
- **Screenshot:** put an image (ideally 1200×700, `.jpg` or `.webp`, under 300 KB) in `assets/img/projects/` and set `image` to its path. File names are case-sensitive on the live server.
- **Remove a project:** delete its whole `{ ... },` block.
- **Reorder:** cut and paste the blocks. The number on each card (01, 02…) updates itself.
- **Colors of generated covers:** these are set per category in `assets/js/ui.js` → `COVER`. Unknown categories fall back to violet. To add a colour for a new category, add a line such as `Mobile: ["#0f1a33", "#1d2f5c", "#3ee6ff"],` (start colour, end colour, glow colour).

> ✏️ **To-do for you:** `My Virtual Clock` has a short placeholder description because its repo has no README. Please replace it with real details.

---

## 2. Change the profile picture

**Easiest:** replace the file `assets/img/profile.jpg` with your new photo, keeping the same name.

**Or** drop in any file and point to it:

```js
profile: {
  ...
  photo: "assets/img/asjad-2026.jpg",
```

Tips:
- Use a **square** image (e.g. 800×800). Non-square photos are centre-cropped.
- Keep it under ~300 KB. Compress for free at https://squoosh.app
- A photo with a dark or transparent background looks great against the neon frame.

The same photo is used for link previews on WhatsApp and LinkedIn (`og:image` in `index.html`). If you rename the file, update that line in `index.html` too.

---

## 3. Edit any text

Everything below is in `data/content.js`:

| What you see | Where to edit |
| --- | --- |
| Name (hero), logo letters | `profile.name`, `profile.initials` |
| Typing lines under your name | `profile.roles` (list; add or remove lines freely) |
| Big hero sentence and sub-text | `profile.headline`, `profile.subheadline` |
| "Open to…" and location in the hero | `profile.availability`, `profile.location` |
| About heading, paragraphs | `about.title`, `about.paragraphs` |
| Animated number cards | `about.stats`: `{ value: 35, suffix: "+", label: "…" }` (use `decimals: 2` for e.g. 3.31) |
| Chips under the photo | `about.languages`, `about.hobbies` |
| Service cards | `services`: title, text, tags, `icon` = `mobile · web · next · api · cloud · ai · iot · data` |
| Scrolling tech names | `stack` (two rows, which scroll in opposite directions) |
| Jobs / timeline | `experience`: newest first |
| Certificates | `certifications`: the one with `featured: true` gets the big holographic card |
| Education, recommendation letters | `education`, `recommendations` |
| Section labels and headings ("02 — What I build", …) | `sections` |
| Footer sentence | `footer.note` |
| Page title in the browser tab / Google | `<title>` and `<meta name="description">` in `index.html` |
| Top menu labels | the `<nav class="nav__links">` block in `index.html` |

### Add a job

```js
experience: [
  {
    company: "New Company Ltd",
    url: "https://newcompany.com",
    role: "Senior Backend Engineer",
    period: "Jan 2027 — Present",
    location: "Remote",
    points: ["Built X.", "Led Y.", "Reduced Z by 40%."],
    tags: ["Django", "AWS", "Kubernetes"],
  },
  // ...existing jobs below
],
```

### Add a certification

```js
certifications: [
  {
    featured: false,
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "Mar 2027",
    text: "Designing resilient, cost-efficient architectures on AWS.",
    url: "https://www.credly.com/badges/…",   // verification link
  },
  // ...
],
```

Only one card should have `featured: true`. That one becomes the big holographic card; the rest are listed beside it. A title that starts with a number (e.g. "35 Coursera Certificates") shows that number large.

### Contact details

```js
contact: {
  email: "asjadiftikhar150@gmail.com",
  whatsapp: "+923341541899",   // set to "" to hide the WhatsApp card
  linkedin: "https://www.linkedin.com/in/asjad-iftikhar-ai1/",
  github: "https://github.com/Asjad150",
  fiverr: "https://www.fiverr.com/asjadiftikhar75",   // "" to hide
  website: "https://bio.link/asjadiftikhar",   // "" to hide
},
```

The contact form doesn't need a server. It opens the visitor's email app with the message pre-filled and addressed to `contact.email`.

### Add a CV download button

1. Export a **public** CV (without passport number, date of birth or home address) as `assets/Asjad-Iftikhar-CV-public.pdf`.
2. Set `profile.resumeUrl: "assets/Asjad-Iftikhar-CV-public.pdf"`.
3. `.gitignore` blocks PDFs to protect your private CV, so force-add this one file:
   `git add -f assets/Asjad-Iftikhar-CV-public.pdf`

A "↓ Download CV" link then appears in the hero.

---

## 4. Change the look (optional)

### Site colours
At the top of [`assets/css/style.css`](assets/css/style.css):

```css
:root {
  --cyan:   #3ee6ff;
  --violet: #8b5cf6;
  --pink:   #ff4fd8;
  --amber:  #ffb547;
  ...
}
```

### 3D shapes: colour, position, visibility
In [`assets/js/scene.js`](assets/js/scene.js), the `LOOKS` table has one row per section:

```js
{ name: "core", x: 2.5, y: 0.0, z: 0.0, s: 1.00, o: 1.00, a: "#3ee6ff", b: "#8b5cf6" }, // hero
```

- `a`, `b`: the two particle colours
- `x`: left/right position (negative = left). `z`: depth (negative = further away)
- `s`: size. `o`: brightness (0–1). Lower it if text over the shape is hard to read.

The shapes in order are: **neural core** (hero) → **torus knot** (about) → **server rack** (services) → **DNA helix** (experience) → **galaxy** (projects) → **crystal medal** (credentials) → **globe** (contact).
Each `<section>` in `index.html` chooses its shape with `data-shape="0…6"`.

### Performance
Also in `scene.js`: `const N = isMobile ? 7000 : 16000;` is the particle count. Lower it if an older laptop struggles. Bloom (the glow) is turned off automatically on phones.

---

## 5. The terminal widget

The "›_ Ask my terminal" button in the bottom-right runs entirely in the browser. It answers from your `content.js`, so **it updates itself whenever you edit your content**. Visitors can type commands (`help`, `whoami`, `services`, `projects`, `certs`, `contact`, `hire`) or questions like *"do you know django?"*. The backtick key <kbd>`</kbd> toggles it.

To add a custom command, open [`assets/js/terminal.js`](assets/js/terminal.js) and add an entry to `cmds`:

```js
blog: {
  d: "read my articles",
  run: () => print(`My blog: ${link("https://medium.com/@you", "medium.com/@you")}`),
},
```

---

## 6. File map

```
index.html              page structure (sections, nav, terminal shell)
data/content.js         ← ALL your text, links, projects, certs
assets/css/style.css    colours, fonts, layout
assets/js/main.js       loader, cursor, scroll effects, counters, form
assets/js/ui.js         builds the HTML from content.js (+ icons, cover colours)
assets/js/scene.js      Three.js particle world + GLSL shaders
assets/js/terminal.js   interactive terminal widget
assets/img/             profile photo, favicon, project screenshots
assets/vendor/          bundled Three.js (r186); don't edit
deploy/                 nginx.conf, Dockerfile, .htaccess (for VPS / Hostinger)
```
