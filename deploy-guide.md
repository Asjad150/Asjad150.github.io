# Deploy Guide

This portfolio is a **static website**: plain HTML, CSS and JavaScript, with Three.js bundled in `assets/vendor/`. There is no build step, no Node server and no database. You can host it anywhere that serves files.

The files that make up the site:

```
index.html
.nojekyll          (GitHub Pages only; harmless elsewhere)
assets/            (css, js, images, three.js bundle)
data/content.js    (all your text, projects and links)
```

Everything else in the folder (`*.md`, `deploy/`, your CV PDF) is for you, not for visitors.

> ⚠️ **Never upload your Europass CV PDF.** It contains your passport number, date of birth and home address. `.gitignore` already blocks every `*.pdf` from git. If you want a downloadable CV on the site, export a **public version** without those details and follow "Add a CV download button" in `how-to-edit.md`.

---

## 0. Test locally first

The site uses JavaScript modules, which browsers block when you open a page with `file://`. So **don't double-click `index.html`**. Serve the folder instead:

```bash
cd ~/Desktop/PersonalPortfolio

# Option A: Python (already installed on Ubuntu)
python3 -m http.server 8080

# Option B: Node
npx serve -l 8080 .
```

Open **http://localhost:8080**. After you edit a file, refresh the page. If the change doesn't show, hard-refresh with `Ctrl+Shift+R`.

To test on your phone, connect it to the same Wi-Fi and open `http://<your-laptop-ip>:8080`. Get the IP with `hostname -I`.

---

## 1. GitHub Pages (free): https://asjad150.github.io

Your repository `Asjad150/Asjad150.github.io` is already set up as a GitHub Pages **user site**, so anything pushed to `main` goes live at `https://asjad150.github.io` within about a minute.

### 1.1 One-time: sign in as **Asjad150**

On this laptop the GitHub CLI is signed in as **asjad-devomech**, which can't push to `Asjad150/...`. Pick one of these fixes:

**Option A: add the Asjad150 account to the GitHub CLI (recommended)**
```bash
gh auth login                 # choose GitHub.com → HTTPS → "Login with a web browser", sign in as Asjad150
gh auth switch --user Asjad150   # only needed if both accounts are logged in
gh auth setup-git             # lets git use the gh login for pushes
gh auth status                # the active account should be Asjad150
```
To switch back for work later: `gh auth switch --user asjad-devomech`.

**Option B: add your work account as a collaborator**
Sign in to github.com as **Asjad150** → repo **Asjad150.github.io** → *Settings → Collaborators → Add people* → `asjad-devomech` → accept the invite from the work account. After that, pushing from this laptop works without changing accounts.

### 1.2 Push

The project folder is already a git repository. It is connected to `https://github.com/Asjad150/Asjad150.github.io.git` and has a commit on top of the existing history, so no force-push is needed.

```bash
cd ~/Desktop/PersonalPortfolio
git status                # should be clean, or show only your new edits
git push -u origin main
```

### 1.3 Check the Pages settings (once)

On GitHub: repo → **Settings → Pages**
- *Source*: **Deploy from a branch**
- *Branch*: **main**, folder **/ (root)** → Save

Watch the deploy under the **Actions** tab ("pages build and deployment"). When it turns green, open **https://asjad150.github.io**.

### 1.4 Updating later

```bash
# edit data/content.js (or anything else), test locally, then:
git add -A
git commit -m "Update projects"
git push
```

### 1.5 Optional: custom domain on GitHub Pages
1. Settings → Pages → *Custom domain* → e.g. `asjadiftikhar.com` → Save. GitHub creates a `CNAME` file in the repo; run `git pull` afterwards.
2. At your domain registrar, add DNS records:
   - Apex (`@`): four **A** records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`: **CNAME** → `asjad150.github.io`
3. Once DNS resolves, tick **Enforce HTTPS**.

---

## 2. VPS server (Ubuntu + nginx)

### Option A: plain nginx

```bash
# on the VPS
sudo apt update && sudo apt install -y nginx
sudo mkdir -p /var/www/portfolio
sudo chown -R $USER:$USER /var/www/portfolio
```

Copy the site from your laptop. Only the public files are sent:

```bash
# on your laptop, from the project folder
rsync -avz --delete \
  --exclude '.git' --exclude '*.md' --exclude '*.pdf' --exclude 'deploy' \
  ./ user@YOUR_VPS_IP:/var/www/portfolio/
```

Configure nginx:

```bash
# on the VPS
sudo nano /etc/nginx/sites-available/portfolio
```

Paste the contents of [`deploy/nginx.conf`](deploy/nginx.conf), then change two lines:
- `server_name` → your domain (or the server IP)
- `root` → `/var/www/portfolio`

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Add free HTTPS once your domain's **A record** points at the VPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

To update the site, run the same `rsync` command again. You don't need to restart anything.

### Option B: Docker

A ready-made `deploy/Dockerfile` (nginx:alpine) is included:

```bash
# from the project root
docker build -f deploy/Dockerfile -t asjad-portfolio .
docker run -d --name portfolio --restart unless-stopped -p 80:80 asjad-portfolio
```

To ship it through a registry, as you would at work:

```bash
docker tag asjad-portfolio ghcr.io/asjad150/portfolio:latest
echo $GHCR_TOKEN | docker login ghcr.io -u Asjad150 --password-stdin
docker push ghcr.io/asjad150/portfolio:latest
# on the VPS:
docker pull ghcr.io/asjad150/portfolio:latest
docker rm -f portfolio; docker run -d --name portfolio --restart unless-stopped -p 80:80 ghcr.io/asjad150/portfolio:latest
```

If other apps on the VPS already use a reverse proxy (nginx, Traefik or Caddy), map the container to another port, e.g. `-p 8081:80`, and proxy your domain to it.

---

## 3. Hostinger (hPanel → File Manager → `public_html`)

1. **Make a zip of just the public files.** From the project folder on your laptop:
   ```bash
   zip -r portfolio.zip index.html .nojekyll assets data
   ```
   *(Optional: add the included `.htaccess` for compression and caching: `cp deploy/.htaccess . && zip -r portfolio.zip .htaccess && rm .htaccess`.)*
2. Log in to **hPanel** → *Websites* → **Manage** → **File Manager**.
3. Open **`public_html`**. If it contains Hostinger's default `default.php` / `index.php`, delete them. They take priority over `index.html`.
4. Click **Upload** → select `portfolio.zip`.
5. Right-click the zip → **Extract** → extract into `public_html` itself, not a subfolder. Then delete the zip.
6. Check the structure. `index.html` must sit **directly** inside `public_html`:
   ```
   public_html/
     index.html
     assets/...
     data/content.js
   ```
7. Visit your domain. For HTTPS, go to hPanel → *Security* → **SSL** → install the free SSL and enable "Force HTTPS".

**To update:** in File Manager, open `public_html/data/content.js`, click **Edit**, change the text and **Save**. It goes live immediately. For bigger changes, re-upload the files you changed.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Blank page / loader stuck, console says *"Failed to load module script"* or CORS error | You opened `index.html` directly (`file://`). Use a local server (section 0). |
| Old text still shows after editing | Hard refresh with `Ctrl+Shift+R`. On GitHub Pages, wait about a minute for the deploy to finish. |
| Page loads but no 3D background | The browser or device has WebGL disabled. The site still works with a gradient background. In Chrome, check `chrome://gpu`. |
| Photo not showing | The path in `data/content.js → profile.photo` must match the file name exactly. It's case-sensitive on GitHub Pages, VPS and Hostinger. |
| Hostinger still shows its placeholder page | Delete `default.php` / `index.php` in `public_html`. |
| `git push` → *Permission denied / 403* | You're pushing as `asjad-devomech`. See section 1.1. |
| Site is broken after an edit | Usually a missing comma or quote in `content.js`. Press F12 → *Console*; the error shows the line number. |
