# 🚀 Deploying to Cloudflare Pages (2026 Edition)

Based on the latest Cloudflare & Astro standards (Jan 2026), here is the optimal deployment strategy.

## 1. Configuration (Already Applied)

We have configured the project for **Edge-First** execution using `adapter: cloudflare()`.

### `astro.config.mjs`

```javascript
import cloudflare from "@astrojs/cloudflare";
export default defineConfig({
  output: "server",
  adapter: cloudflare(), // Auto-detects best mode (Platform Proxy enabled)
  // ...
});
```

### `wrangler.toml`

Crucial for Node.js compatibility (Buffer, process, etc.) at the Edge.

```toml
name = "vfdashboard"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"
```

## 2. Deployment (CLI Method - Recommended)

We use **Direct Upload** via the Wrangler CLI. This is faster and gives you more control than the automatic Git integration.

### Prerequisites (One-time setup)
1.  **Login to Cloudflare:**
    ```bash
    npx wrangler login
    ```
2.  **Create the Project** (Required only once):
    ```bash
    npx wrangler pages project create vfdashboard --production-branch main
    ```

### How to Deploy
Run this single command whenever you want to publish changes:

```bash
npm run deploy
```

This command will:
1.  **Build** the project (`npm run build`).
2.  **Upload** local files to Cloudflare Pages.

### Option B: Cloudflare Git Integration (Alternative)
*Not recommended for this setup as it requires manual dashboard configuration.*
If you prefer this, connect your Git repo in the Cloudflare Dashboard and set the build command to `npm run build` and output directory to `/dist`.

## 3. Local Development (Platform Proxy)

The new adapter supports **Platform Proxy**, meaning `npm run dev` locally will simulate the Cloudflare Worker environment (KV, Headers, etc.) accurately.

```bash
npm run dev
```

---

## 4. Verification

After deployment, your app will be hosted at `https://vfdashboard.pages.dev`.

- **Performance**: Assets served globally via CDN.
- **API**: `/api/*` requests handled by Edge Workers (Serverless) with rotating IPs.
