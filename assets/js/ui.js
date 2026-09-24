/* ==========================================================================
   UI RENDERER — turns data/content.js into the page's HTML.
   You normally don't need to edit this file; edit data/content.js instead.
   ========================================================================== */

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const $ = (id) => document.getElementById(id);
const ext = (url) => (/^https?:\/\//.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "");

/* inline SVG icons (stroke = currentColor) */
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const ICONS = {
  api: svg('<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 5l-3 14"/>'),
  mobile: svg('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
  web: svg('<rect x="2.5" y="4" width="19" height="14" rx="2"/><path d="M2.5 8h19M6 6h.01M8.5 6h.01M8 21h8"/>'),
  next: svg('<circle cx="12" cy="12" r="9.5"/><path d="M9 16V8l7 9M15 8v5"/>'),
  cloud: svg('<path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.2 4.7 4.7 0 0 0 7 18.5z"/><path d="M12 12v4M10 14l2-2 2 2"/>'),
  ai: svg('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 10h4v4h-4zM9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>'),
  iot: svg('<circle cx="12" cy="17" r="1.6"/><path d="M8.5 13.5a5 5 0 0 1 7 0M5.5 10.5a9.2 9.2 0 0 1 13 0M2.8 7.5a13 13 0 0 1 18.4 0"/>'),
  data: svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  mail: svg('<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6.5 9-6.5"/>'),
  linkedin: svg('<rect x="2.5" y="2.5" width="19" height="19" rx="3"/><path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v3.5"/>'),
  github: svg('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
  whatsapp: svg('<path d="M3.5 20.5l1.3-4.4A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 8.5c.2 2.9 3.6 6.3 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2z"/>'),
  globe: svg('<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.8 6 3.8 9.5s-1.2 6.7-3.8 9.5c-2.6-2.8-3.8-6-3.8-9.5S9.4 5.3 12 2.5z"/>'),
  fiverr: svg('<circle cx="12" cy="12" r="9.5"/><path d="M14.5 7.5h-1.2a2 2 0 0 0-2 2v1H9.5M11.3 10.5V17M11.3 10.5h4V17M15.3 7.6v.01"/>'),
  arrow: svg('<path d="M7 17L17 7M8 7h9v9"/>'),
  pin: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
};

/* category → cover colours for generated project covers */
const COVER = {
  AI: ["#1b0f3d", "#3b1670", "#ff4fd8"],
  IoT: ["#04222b", "#073c4d", "#2cffb5"],
  Backend: ["#0a1535", "#10306b", "#3ee6ff"],
  DevOps: ["#0b1a3a", "#12275e", "#6aa8ff"],
  Web: ["#221034", "#3a1648", "#ffb547"],
  Automation: ["#12201a", "#173a2c", "#7dffa1"],
  "Full-Stack": ["#2a1206", "#4a2410", "#ffb547"],
};
const coverFor = (cat) => COVER[cat] || ["#10163a", "#1e0f3a", "#8b5cf6"];

function splitName(name) {
  let i = 0;
  return name
    .split(" ")
    .map((w) => `<span class="word">${[...w].map((c) => `<span class="mask"><span class="ch" style="--i:${i++}">${esc(c)}</span></span>`).join("")}</span>`)
    .join(" ");
}

export function renderAll(C) {
  const P = C.profile, K = C.contact;

  /* ---------- hero ---------- */
  $("navInitials").textContent = P.initials;
  $("heroEyebrow").textContent = `// ${P.roles[0]} · AI · IoT · DevOps`;
  $("heroName").innerHTML = splitName(P.name);
  $("heroName").setAttribute("aria-label", P.name);
  $("heroHeadline").textContent = P.headline;
  $("heroSub").textContent = P.subheadline;
  $("heroMeta").innerHTML = [
    `<span><i class="live"></i>${esc(P.availability)}</span>`,
    `<span>${ICONS.pin.replace("<svg", '<svg width="14" height="14"')}${esc(P.location)}</span>`,
    P.resumeUrl ? `<span><a href="${esc(P.resumeUrl)}"${ext(P.resumeUrl)} class="grad-text">↓ Download CV</a></span>` : "",
  ].join("");

  /* ---------- section headings ---------- */
  document.querySelectorAll("[data-section]").forEach((el) => {
    const s = C.sections[el.dataset.section];
    if (s) el.textContent = s.eyebrow;
  });
  document.querySelectorAll("[data-section-title]").forEach((el) => {
    const s = C.sections[el.dataset.sectionTitle];
    if (s) el.textContent = s.title;
  });

  /* ---------- about ---------- */
  const img = $("aboutPhoto");
  img.src = P.photo;
  img.alt = `Portrait of ${P.name}`;
  $("aboutTitle").textContent = C.sections.about.title || C.about.title;
  $("aboutParas").innerHTML = C.about.paragraphs.map((p, i) => `<p class="reveal" style="--d:${0.08 * i}s">${esc(p)}</p>`).join("");
  $("aboutStats").innerHTML = C.about.stats
    .map((s, i) => `<div class="stat glass reveal" style="--d:${0.08 * i}s"><div class="stat__v grad-text" data-count="${s.value}" data-decimals="${s.decimals || 0}" data-suffix="${esc(s.suffix)}">0</div><div class="stat__l">${esc(s.label)}</div></div>`)
    .join("");
  $("aboutBadges").innerHTML = [
    ...C.certifications.filter((c) => c.featured).map((c) => `<span class="chip chip--hot">◆ ${esc(c.issuer)} Certified</span>`),
    ...C.about.languages.map((l) => `<span class="chip">${esc(l)}</span>`),
    ...C.about.hobbies.map((h) => `<span class="chip">${esc(h)}</span>`),
  ].join("");

  /* ---------- services ---------- */
  $("servicesGrid").innerHTML = C.services
    .map(
      (s, i) => `<article class="card glass tilt reveal" style="--d:${(i % 4) * 0.07}s">
        <div class="service__icon">${ICONS[s.icon] || ICONS.api}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
        <div class="tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </article>`
    )
    .join("");

  /* ---------- marquee ---------- */
  $("marquee").innerHTML = C.stack
    .map((row) => {
      const items = row.map((t) => `<span class="marquee__item">${esc(t)}</span>`).join("");
      return `<div class="marquee__row">${items}${items.replace(/class="marquee__item"/g, 'class="marquee__item" aria-hidden="true"')}</div>`;
    })
    .join("");

  /* ---------- experience ---------- */
  $("timeline").insertAdjacentHTML(
    "beforeend",
    C.experience
      .map(
        (j) => `<article class="job glass reveal">
          <div class="job__head"><h3 class="job__role">${esc(j.role)}</h3><span class="job__period">${esc(j.period)}</span></div>
          <p class="job__company">${j.url ? `<a href="${esc(j.url)}"${ext(j.url)}>${esc(j.company)}</a>` : esc(j.company)} <small>· ${esc(j.location)}</small></p>
          <ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <div class="tags">${j.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </article>`
      )
      .join("")
  );

  /* ---------- projects ---------- */
  const cats = ["All", ...new Set(C.projects.map((p) => p.category))];
  $("filters").innerHTML = cats.map((c, i) => `<button class="filter${i === 0 ? " active" : ""}" data-filter="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join("");
  $("projectsGrid").innerHTML = C.projects
    .map((p, i) => {
      const [c1, c2, orb] = coverFor(p.category);
      const cover = p.image
        ? `<img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy" />`
        : `<div class="project__orb" style="--orb:${orb}"></div><div class="gen"></div><span class="project__num">${String(i + 1).padStart(2, "0")}</span>`;
      const links = (p.links || [])
        .filter((l) => l.url)
        .map((l) => `<a href="${esc(l.url)}"${ext(l.url)}>${/github/i.test(l.url) ? ICONS.github.replace("<svg", '<svg width="14" height="14"') : ICONS.arrow.replace("<svg", '<svg width="14" height="14"')}${esc(l.label)}</a>`)
        .join("");
      return `<article class="project card glass tilt reveal${p.featured ? " featured" : ""}" data-cat="${esc(p.category)}" style="--d:${(i % 3) * 0.07}s">
        <div class="project__cover" style="--cover:linear-gradient(135deg, ${c1}, ${c2})">${cover}<span class="project__glyph">${esc(p.category)}</span></div>
        <div class="project__body">
          <div class="project__meta"><span>${esc(p.year || "")}</span><span>${String(i + 1).padStart(2, "0")} / ${String(C.projects.length).padStart(2, "0")}</span></div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.text)}</p>
          <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          ${links ? `<div class="project__links">${links}</div>` : ""}
        </div>
      </article>`;
    })
    .join("");

  /* ---------- certifications ---------- */
  const feat = C.certifications.find((c) => c.featured);
  const rest = C.certifications.filter((c) => c !== feat);
  if (feat) {
    const isMs = /microsoft/i.test(feat.issuer);
    $("certFeatured").innerHTML = `<a class="cert-hero tilt reveal" href="${esc(feat.url || "#")}"${ext(feat.url || "")}>
      <div class="cert-hero__in">
        <div class="cert-hero__top">
          ${isMs ? '<span class="ms-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' : `<span class="service__icon">${ICONS.ai}</span>`}
          <span class="cert-hero__seal">✦ Verified credential</span>
        </div>
        <h3>${esc(feat.title)}</h3>
        <p>${esc(feat.text)}</p>
        <div class="cert-hero__foot"><span>Issued by <strong>${esc(feat.issuer)}</strong> · ${esc(feat.date)}</span><span>Verify ↗</span></div>
      </div>
    </a>`;
  }
  $("certList").innerHTML = rest
    .map((c) => {
      const big = (c.title.match(/^\d+/) || [""])[0];
      const tag = c.url ? "a" : "div";
      return `<${tag} class="mini glass reveal"${c.url ? ` href="${esc(c.url)}"${ext(c.url)}` : ""}>
        ${big ? `<span class="mini__big grad-text">${big}</span>` : ""}
        <div class="mini__k"><span>Certification · ${esc(c.date)}</span></div>
        <h4>${esc(c.title)}</h4><p class="mono small" style="margin-bottom:6px">${esc(c.issuer)}</p><p>${esc(c.text)}</p>
      </${tag}>`;
    })
    .join("");
  $("eduList").innerHTML = C.education
    .map(
      (e) => `<div class="mini glass reveal">
        <div class="mini__k"><span>Education</span><span>${esc(e.period)}</span></div>
        <h4>${esc(e.degree)}</h4>
        <p>${e.url ? `<a href="${esc(e.url)}"${ext(e.url)}>${esc(e.school)}</a>` : esc(e.school)}</p>
        <p class="mono small" style="margin-top:8px">${esc(e.detail)}</p>
      </div>`
    )
    .join("");
  $("recList").innerHTML = C.recommendations.length
    ? `<div class="recs">${C.recommendations
        .map((r) => {
          const tag = r.url ? "a" : "div";
          return `<${tag} class="mini glass reveal"${r.url ? ` href="${esc(r.url)}"${ext(r.url)}` : ""}>
            <div class="mini__k"><span>Recommendation</span>${r.url ? "<span>↗</span>" : ""}</div>
            <h4>${esc(r.name)}</h4><p>${esc(r.title)}</p></${tag}>`;
        })
        .join("")}</div>`
    : "";

  /* ---------- contact ---------- */
  const email = $("contactEmail");
  email.href = `mailto:${K.email}`;
  email.textContent = K.email;
  const socials = [
    K.linkedin && { icon: "linkedin", name: "LinkedIn", sub: K.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), url: K.linkedin },
    K.github && { icon: "github", name: "GitHub", sub: K.github.replace(/^https?:\/\/(www\.)?/, ""), url: K.github },
    K.fiverr && { icon: "fiverr", name: "Fiverr", sub: "Hire me for a project", url: K.fiverr },
    K.whatsapp && { icon: "whatsapp", name: "WhatsApp", sub: "Chat with me directly", url: `https://wa.me/${K.whatsapp.replace(/\D/g, "")}` },
    K.email && { icon: "mail", name: "Email", sub: K.email, url: `mailto:${K.email}` },
    K.website && { icon: "globe", name: "Links", sub: K.website.replace(/^https?:\/\//, ""), url: K.website },
  ].filter(Boolean);
  $("socials").innerHTML = socials
    .map((s, i) => `<a class="social glass reveal" style="--d:${i * 0.06}s" href="${esc(s.url)}"${ext(s.url)}>
      <span class="social__icon">${ICONS[s.icon]}</span><span><strong>${esc(s.name)}</strong><small>${esc(s.sub)}</small></span><span class="social__arrow">${ICONS.arrow.replace("<svg", '<svg width="18" height="18"')}</span></a>`)
    .join("");

  /* ---------- footer ---------- */
  $("footerCopy").textContent = `© ${new Date().getFullYear()} ${P.name}`;
  $("footerNote").textContent = C.footer.note;
  document.title = `${P.name} — ${P.roles.slice(0, 1).join("")}, AI, IoT & DevOps`;
}
