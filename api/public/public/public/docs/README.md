# 🔐 JWT API

Full-stack JWT Authentication API with Login UI.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## 📡 Endpoints

| Method | Route      | Description          |
|--------|-----------|----------------------|
| POST   | `/token`   | Generate JWT token   |
| POST   | `/verify`  | Verify JWT token     |
| GET    | `/profile` | Protected route      |

## 🧪 Test Credentials

- **UID:** `4372714908`
- **Password:** `08CF817C0BCEBB3B4D168E06D5CD4F63B9844DA8E807FC5CEB945BAF2E36AED9`

## 🌐 Deploy

```bash
vercel --prod
```

Env vars set karo: `JWT_SECRET`, `JWT_EXPIRES`

## 📖 Docs

Design doc: [`docs/DESIGN.md`](docs/DESIGN.md)
