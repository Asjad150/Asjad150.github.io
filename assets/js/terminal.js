/* ==========================================================================
   INTERACTIVE TERMINAL — answers commands and simple questions using only
   the data in data/content.js (runs entirely in the browser, no server).
   ========================================================================== */
import { esc } from "./ui.js";

export function initTerminal(C, { onCommand } = {}) {
  const fab = document.getElementById("termFab");
  const box = document.getElementById("terminal");
  const out = document.getElementById("termOut");
  const form = document.getElementById("termForm");
  const input = document.getElementById("termInput");
  const close = document.getElementById("termClose");
  const history = [];
  let hIdx = 0, booted = false;

  const P = C.profile, K = C.contact;
  const print = (html, cls = "") => {
    const el = document.createElement("p");
    el.className = "line " + cls;
    el.innerHTML = html;
    out.appendChild(el);
    out.scrollTop = out.scrollHeight;
  };
  const list = (arr) => arr.map((x) => `  <span class="v">•</span> ${x}`).join("\n");
  const link = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label || url)}</a>`;
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const cmds = {
    help: {
      d: "list available commands",
      run: () => print(
        Object.entries(cmds).filter(([, v]) => !v.hidden).map(([k, v]) => `  <span class="c">${k.padEnd(11)}</span><span class="m">${v.d}</span>`).join("\n") +
        `\n\n<span class="m">Or just ask, e.g. "do you know django?" or "how can I contact you?"</span>`
      ),
    },
    whoami: {
      d: "who is Asjad?",
      run: () => print(`<span class="c">${esc(P.fullName)}</span>\n${esc(P.roles.join(" · "))}\n<span class="m">${esc(P.location)}</span>\n\n${esc(C.about.paragraphs[0])}`),
    },
    services: {
      d: "what I can build for you",
      run: () => { print(list(C.services.map((s) => `<span class="c">${esc(s.title)}</span> <span class="m">— ${esc(s.tags.slice(0, 4).join(", "))}</span>`))); go("services"); },
    },
    skills: {
      d: "my tech stack",
      run: () => print(C.stack.flat().map((t) => `<span class="g">${esc(t)}</span>`).join("  ")),
    },
    experience: {
      d: "where I've worked",
      run: () => { print(C.experience.map((j) => `<span class="a">${esc(j.period)}</span>  <span class="c">${esc(j.role)}</span>\n  @ ${esc(j.company)}`).join("\n\n")); go("experience"); },
    },
    projects: {
      d: "selected work",
      run: () => {
        print(list(C.projects.map((p) => `<span class="c">${esc(p.title)}</span> <span class="m">[${esc(p.category)}]</span>${p.links?.[0]?.url ? " " + link(p.links[0].url, p.links[0].label) : ""}`)));
        go("projects");
      },
    },
    certs: {
      d: "certifications & education",
      run: () => {
        print(list([
          ...C.certifications.map((c) => `<span class="a">${esc(c.title)}</span> <span class="m">(${esc(c.issuer)}, ${esc(c.date)})</span>${c.url ? " " + link(c.url, "verify") : ""}`),
          ...C.education.map((e) => `<span class="c">${esc(e.degree)}</span> <span class="m">— ${esc(e.school)}, ${esc(e.period)}</span>`),
        ]));
        go("certs");
      },
    },
    contact: {
      d: "how to reach me",
      run: () => {
        print([
          `  email     ${link("mailto:" + K.email, K.email)}`,
          K.linkedin && `  linkedin  ${link(K.linkedin, "asjad-iftikhar-ai1")}`,
          K.github && `  github    ${link(K.github, K.github.replace(/^https?:\/\//, ""))}`,
          K.whatsapp && `  whatsapp  ${link("https://wa.me/" + K.whatsapp.replace(/\D/g, ""), "chat now")}`,
        ].filter(Boolean).join("\n"));
      },
    },
    hire: {
      d: "the fast track",
      run: () => { print(`<span class="g">✔ Great choice.</span> Opening the contact section…\n<span class="m">Tip: the form pre-fills an email to ${esc(K.email)}</span>`); go("contact"); },
    },
    clear: { d: "clear the screen", run: () => (out.innerHTML = "") },
    sudo: { hidden: true, d: "", run: () => print(`<span class="p">Permission granted.</span> Deploying Asjad to your team… <span class="g">100%</span> ✔`) },
    ls: { hidden: true, d: "", run: () => print(`<span class="c">about/</span>  <span class="c">services/</span>  <span class="c">experience/</span>  <span class="c">projects/</span>  <span class="c">certs/</span>  <span class="c">contact/</span>`) },
    exit: { hidden: true, d: "", run: () => toggle(false) },
  };

  /* keyword Q&A fallback */
  function answer(q) {
    const s = q.toLowerCase();
    const STOP = new Set("you your do does did can could have has the and with for are what which how about know use using work works make build any some that this there from into like want need does also".split(" "));
    const words = s.split(/[^a-z0-9.+#]+/).filter((w) => w.length > 1 && !STOP.has(w));
    if (/contact|email|reach|hire|phone|whatsapp|call/.test(s)) return cmds.contact.run();
    if (/cert|microsoft|coursera|degree|educat|universit|nutech|study/.test(s)) return cmds.certs.run();
    if (/experience|worked|career|\bjobs?\b|compan|devomech|hypernym/.test(s)) return cmds.experience.run();
    if (/\bwho\b|yourself|introduce/.test(s)) return cmds.whoami.run();

    // tech lookup across services / projects / stack
    const tech = C.stack.flat();
    const hitTech = tech.filter((t) => words.some((w) => t.toLowerCase().replace(/\s/g, "").includes(w.replace(/\s/g, "")) && w.length > 2));
    const hitServices = C.services.filter((sv) => words.some((w) => w.length > 2 && (sv.title + " " + sv.tags.join(" ") + " " + sv.text).toLowerCase().includes(w)));
    const hitProjects = C.projects.filter((p) => words.some((w) => w.length > 3 && (p.title + " " + p.tags.join(" ") + " " + p.text).toLowerCase().includes(w)));
    if (hitTech.length || hitServices.length || hitProjects.length) {
      if (hitTech.length) print(`<span class="g">Yes!</span> ${esc(P.name.split(" ")[0])} works with ${hitTech.slice(0, 6).map((t) => `<span class="c">${esc(t)}</span>`).join(", ")}.`);
      if (hitServices.length) print(`Related services:\n` + list(hitServices.slice(0, 3).map((x) => `<span class="c">${esc(x.title)}</span> <span class="m">— ${esc(x.text)}</span>`)));
      if (hitProjects.length) print(`Related projects:\n` + list(hitProjects.slice(0, 4).map((x) => `<span class="v">${esc(x.title)}</span>`)));
      return;
    }
    print(`<span class="m">I don't have an answer for that one. Try</span> <span class="c">help</span><span class="m">, or email</span> ${link("mailto:" + K.email, K.email)}`);
  }

  function run(raw) {
    const q = raw.trim();
    if (!q) return;
    history.push(q); hIdx = history.length;
    print(esc(q), "cmd");
    const key = q.toLowerCase().split(/\s+/)[0];
    if (cmds[key]) cmds[key].run(q);
    else answer(q);
    onCommand && onCommand(q);
  }

  function boot() {
    booted = true;
    print(`<span class="g">asjad-os</span> v2.0 — connected <span class="m">(${new Date().toLocaleDateString()})</span>`);
    print(`Hi, I'm ${esc(P.name)}'s portfolio terminal. Type <span class="c">help</span> or tap a command:`);
    const chips = document.createElement("div");
    chips.className = "term-chips";
    ["whoami", "services", "projects", "certs", "contact", "hire"].forEach((c) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = c;
      b.addEventListener("click", () => { run(c); input.focus(); });
      chips.appendChild(b);
    });
    out.appendChild(chips);
  }

  function toggle(open) {
    box.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) { if (!booted) boot(); setTimeout(() => input.focus(), 50); }
    else fab.focus();
  }

  fab.addEventListener("click", () => toggle(true));
  close.addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !box.hidden) toggle(false);
    if (e.key === "`" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") { e.preventDefault(); toggle(box.hidden); }
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); run(input.value); input.value = ""; });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hIdx > 0) { hIdx--; input.value = history[hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; e.preventDefault(); }
    if (e.key === "Tab") {
      const m = Object.keys(cmds).filter((k) => !cmds[k].hidden && k.startsWith(input.value.toLowerCase()));
      if (m.length === 1) { input.value = m[0]; e.preventDefault(); }
    }
  });
}
