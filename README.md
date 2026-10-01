# OptiWebP Studio ⚡ (100% Client-Side)

A high-performance, private, client-side web application to convert and optimize images to WebP right inside the browser.

### Key Features
- **100% Client-Side**: Images never leave your device. Zero server uploads, absolute privacy, and instant encoding via hardware acceleration (Canvas / GPU).
- **Zero Server Costs**: Completely static. Deploy for free to **Cloudflare Pages**, GitHub Pages, or any static host.
- **Batch Processing**: Drag & drop multiple PNG, JPG, WebP, or GIF images at once.
- **Full Control**: Adjust quality slider (10%–100%), set custom target Width & Height with locked aspect ratio, or toggle pixel-perfect Lossless mode.
- **Live Re-encoding**: Change settings and re-encode the entire queue on the fly with a single click.
- **Instant ZIP Export**: Built-in zero-dependency ZIP archive generator compiles all converted images in browser memory without waiting.

---

## 🚀 Deployment to Cloudflare Pages (Free & Infinite)

### Option A: Direct Git Integration
1. Push this repository to GitHub or GitLab.
2. In your [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
3. Select your repository.
4. Set build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave empty)*
   - **Build output directory**: `public`
5. Click **Save and Deploy**. Your site will be live on `https://<project-name>.pages.dev` with free SSL and worldwide CDN!

### Option B: Direct Upload (Drag & Drop)
1. In Cloudflare Dashboard, go to **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Upload assets**.
2. Name your project and drag the `public` folder directly into the browser.
3. Click **Deploy Site**.

---

## 💻 Local Development

To run locally:
```bash
npm start
```
Then open your browser at:
👉 **[http://localhost:3333](http://localhost:3333)**

*(Alternatively, you can simply double-click `public/index.html` to open it offline in any modern browser!)*

---

## 📄 License & Copyright

Copyright &copy; 2026 **OptiWebP Studio**. Released under the [MIT License](LICENSE).

