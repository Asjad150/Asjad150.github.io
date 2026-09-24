/* ==========================================================================
   MAIN — boots the page: renders content, starts the 3D scene, loader,
   cursor, scroll effects, counters, tilt cards, terminal and contact form.
   ========================================================================== */
import { content } from "../../data/content.js";
import { renderAll } from "./ui.js";
import { initTerminal } from "./terminal.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

renderAll(content);

/* ------------------------------------------------------------------ loader */
const loader = { el: $("#loader"), count: $("#loaderCount"), bar: $("#loaderBar"), log: $("#loaderLog") };
let progress = 0, targetProgress = 8;
const bootLines = [
  "▸ mounting <b>data/content.js</b>",
  "▸ compiling GLSL shaders",
  "▸ generating 7 particle morph targets",
  "▸ connecting IoT hub… <b>ok</b>",
  "▸ warming up neural core… <b>ok</b>",
  "▸ ready.",
];
let logged = 0;
function loaderTick() {
  progress += (targetProgress - progress) * 0.12 + 0.2;
  progress = Math.min(progress, targetProgress);
  const p = Math.floor(progress);
  loader.count.textContent = p;
  loader.bar.style.width = p + "%";
  const want = Math.min(bootLines.length, Math.floor((p / 100) * bootLines.length) + 1);
  while (logged < want) loader.log.innerHTML += bootLines[logged++] + "\n";
  if (p >= 100) return finishLoading();
  requestAnimationFrame(loaderTick);
}
function finishLoading() {
  setTimeout(() => {
    loader.el.classList.add("done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("ready");
    startTyping();
  }, reduced ? 0 : 350);
}
requestAnimationFrame(loaderTick);
document.fonts?.ready.then(() => (targetProgress = Math.max(targetProgress, 35)));

/* ------------------------------------------------------------------- scene */
let scene = null;
(async () => {
  try {
    const test = document.createElement("canvas");
    if (!(test.getContext("webgl2") || test.getContext("webgl"))) throw new Error("no webgl");
    targetProgress = Math.max(targetProgress, 55);
    const { createScene } = await import("./scene.js");
    scene = createScene($("#webgl"));
  } catch (err) {
    console.warn("3D scene disabled:", err);
    document.body.classList.add("no-webgl");
    $("#webgl").remove();
  }
  targetProgress = 100;
})();
// never let the loader hang
setTimeout(() => (targetProgress = 100), 6000);

/* ------------------------------------------------------------ hero typing */
function startTyping() {
  const el = $("#heroRole");
  const roles = content.profile.roles;
  if (reduced) { el.textContent = roles[0]; return; }
  let r = 0, i = 0, del = false;
  (function step() {
    const word = roles[r];
    i += del ? -1 : 1;
    el.textContent = word.slice(0, i);
    let wait = del ? 28 : 55 + Math.random() * 40;
    if (!del && i === word.length) { del = true; wait = 1900; }
    else if (del && i === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
    setTimeout(step, wait);
  })();
}

/* ---------------------------------------------------------- scramble text */
const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
function scramble(el) {
  const final = (el.dataset.final ||= el.textContent);
  if (reduced || !final) return;
  let frame = 0;
  const total = 26;
  (function run() {
    el.textContent = [...final].map((ch, idx) => (ch === " " ? " " : frame / total > idx / final.length ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    if (++frame <= total) requestAnimationFrame(run); else el.textContent = final;
  })();
}

/* -------------------------------------------------------- counters */
function countUp(el) {
  const to = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || "";
  if (reduced) { el.textContent = to.toFixed(dec) + suf; return; }
  const start = performance.now(), dur = 1600;
  (function f(now) {
    const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 4);
    el.textContent = (to * e).toFixed(dec) + suf;
    if (k < 1) requestAnimationFrame(f);
  })(start);
}

/* ------------------------------------------------------------- reveals */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    el.classList.add("in");
    if (el.classList.contains("scramble")) scramble(el);
    $$("[data-count]", el).forEach(countUp);
    io.unobserve(el);
  }
}, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
$$(".reveal, .scramble").forEach((el) => io.observe(el));
// hero eyebrow scrambles once the loader is gone
setTimeout(() => scramble($("#heroEyebrow")), 900);

/* ------------------------------------------- nav, dots, progress, timeline */
const nav = $("#nav"), burger = $("#burger"), progressBar = $("#progressBar"), fill = $("#timelineFill");
const sectionIds = ["top", "about", "services", "experience", "projects", "certs", "contact"];
const labels = ["Home", "About", "Services", "Experience", "Work", "Credentials", "Contact"];
$("#dots").innerHTML = sectionIds.map((id, i) => `<a href="#${id}" data-id="${id}">${labels[i]}</a>`).join("");
let lastY = 0;
function onScroll() {
  const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  nav.classList.toggle("hidden", y > lastY && y > 400 && !nav.classList.contains("open"));
  lastY = y;

  // active section
  let active = sectionIds[0];
  for (const id of sectionIds) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) active = id; }
  $$("#dots a").forEach((a) => a.classList.toggle("active", a.dataset.id === active));
  $$("#navLinks a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + active));

  // timeline fill
  const tl = $("#timeline");
  if (tl && fill) {
    const r = tl.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    fill.style.transform = `scaleY(${k})`;
  }
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

burger.addEventListener("click", () => {
  const open = !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
});
$$("#navLinks a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

/* ------------------------------------------------------------ cursor */
if (finePointer && !reduced) {
  document.body.classList.add("has-cursor");
  const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; }, { passive: true });
  (function loop() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("pointerover", (e) => cur.classList.toggle("hover", !!e.target.closest("a, button, .tilt, input, textarea")));
} else {
  $(".cursor")?.remove();
}

/* ---------------------------------------------------- tilt + magnetic */
if (finePointer && !reduced) {
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".tilt");
    if (card) {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      const max = card.classList.contains("holo-frame") || card.classList.contains("cert-hero") ? 10 : 6;
      card.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
      card.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    }
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    const card = e.target.closest(".tilt");
    if (card && !card.contains(e.relatedTarget)) { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); }
  });
  $$(".magnetic").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--bx", `${(e.clientX - r.left - r.width / 2) * 0.25}px`);
      b.style.setProperty("--by", `${(e.clientY - r.top - r.height / 2) * 0.35}px`);
    });
    b.addEventListener("pointerleave", () => { b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); });
  });
}

/* ------------------------------------------------------ project filters */
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  const f = btn.dataset.filter;
  $$(".filter").forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
  $$(".project").forEach((p) => p.classList.toggle("is-hidden", f !== "All" && p.dataset.cat !== f));
  scene?.remeasure();
  scene?.pulse();
});

/* ---------------------------------------------------------- contact */
$("#copyEmail").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText(content.contact.email); btn.textContent = "Copied ✓"; }
  catch { btn.textContent = "Press Ctrl+C"; }
  setTimeout(() => (btn.textContent = "Copy"), 1800);
});
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(e.currentTarget);
  const subject = encodeURIComponent(`Portfolio enquiry from ${d.get("name")}`);
  const body = encodeURIComponent(`${d.get("message")}\n\n— ${d.get("name")} (${d.get("email")})`);
  location.href = `mailto:${content.contact.email}?subject=${subject}&body=${body}`;
});

/* ---------------------------------------------------------- terminal */
initTerminal(content, { onCommand: () => scene?.pulse() });

/* ------------------------------------------------ console easter egg */
console.log("%c👋 Hey developer!", "font-size:16px;color:#3ee6ff;font-weight:bold");
console.log(`%cLike what you see? → ${content.contact.email}`, "color:#8b5cf6");
