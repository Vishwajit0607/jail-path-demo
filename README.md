# jail-path Live Evaluation Demo

> Interactive security evaluation application demonstrating real-world path traversal mitigation using the published npm package [`jail-path`](https://www.npmjs.com/package/jail-path).

---

## Live Deployed Demo
- **Live Demo URL:** `[YOUR_DEPLOYED_URL_HERE]` *(e.g., https://jail-path-demo.vercel.app or https://jail-path-demo.onrender.com)*
- **NPM Package:** [https://www.npmjs.com/package/jail-path](https://www.npmjs.com/package/jail-path)
- **GitHub Repository:** [https://github.com/Vishwajit0607/jail-path](https://github.com/Vishwajit0607/jail-path)

---

## Features
- **Real-World Attack Simulation:** Test path traversal attempts (`../../etc/passwd`, `..\windows\win.ini`, `../uploads_backup/secrets.json`), null byte poison injection (`file.pdf\0.png`), and Windows DOS device exploits (`CON`, `PRN`).
- **Interactive UI:** Preset attack & valid buttons for one-click testing during college/technical evaluation.
- **Powered by `jail-path@1.0.0`:** Installs and imports directly from the official npm registry.
- **REST API:** Provides `/api/resolve` for programmatic path verification and automated integration tests.

---

## Quick Start (Run Locally)

### 1. Prerequisites
- Node.js 20+ installed.

### 2. Install & Start
```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment Instructions

### Deploy to Vercel (Recommended)
This repository includes a preconfigured `vercel.json` at root.

1. In the [Vercel Dashboard](https://vercel.com/new), select your repository `Vishwajit0607/jail-path-demo`.
2. Leave the Root Directory as default (`./`).
3. Click **Deploy**. Vercel will automatically build and deploy the Node.js server.

### Deploy to Render
This repository includes a `render.yaml` blueprint at root.

1. Connect your repository to [Render](https://dashboard.render.com/).
2. Select **Web Service** with:
   - **Root Directory:** (leave blank or `./`)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Click **Create Web Service**.

---

## API Reference

### `POST /api/resolve`

#### Request Body
```json
{
  "rootDir": "/var/app/uploads",
  "userPath": "../../etc/passwd",
  "allowRootAccess": false,
  "windowsDeviceCheck": true
}
```

#### Safe Response (`200 OK`)
```json
{
  "safe": true,
  "status": "allowed",
  "result": {
    "resolvedPath": "/var/app/uploads/invoices/2026/report.pdf",
    "relativePath": "invoices/2026/report.pdf"
  },
  "message": "Path safely resolved and confined within root boundary."
}
```

#### Blocked Response (`403 Forbidden`)
```json
{
  "safe": false,
  "status": "blocked",
  "errorType": "PathTraversalError",
  "code": "ERR_PATH_TRAVERSAL",
  "userPath": "../../etc/passwd",
  "rootDir": "/var/app/uploads",
  "message": "Path escapes allowed root directory: \"../../etc/passwd\""
}
```
