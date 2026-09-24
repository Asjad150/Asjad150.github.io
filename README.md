# Asjad Iftikhar — 3D Portfolio

An interactive Three.js portfolio. It's a GPU particle system that morphs through seven shapes as you scroll (neural core → torus knot → server rack → DNA helix → galaxy → crystal → globe). It uses custom GLSL shaders, bloom, mouse-reactive particles and an in-browser terminal assistant.

**Live:** https://asjad150.github.io

- **Run locally:** `python3 -m http.server 8080` → http://localhost:8080
- **Edit content:** everything is in [`data/content.js`](data/content.js). See [how-to-edit.md](how-to-edit.md)
- **Deploy:** GitHub Pages, a VPS (nginx/Docker) or Hostinger. See [deploy-guide.md](deploy-guide.md)

It's a static site with no build step. Three.js r186 is bundled in `assets/vendor/`.
