# 📘 JWT API — Design Document

## 1. Overview
Ek full-stack **JWT Authentication API** with login UI. User UID + password bhejta hai, server verify karke JWT token deta hai. Token ko protected routes pe use kar sakte hain.

---

## 2. Architecture

```
┌─────────────┐      POST /token        ┌──────────────┐
│   Client    │ ──────────────────────► │   Express    │
│ (Browser)   │ ◄────────────────────── │   Server     │
└─────────────┘      { token }          └──────┬───────┘
                                               │
                                               │ bcrypt.compare()
                                               │ jwt.sign()
                                               ▼
                                        ┌──────────────┐
                                        │  Users (DB)  │
                                        └──────────────┘
```

---

## 3. Tech Stack

| Layer      | Technology          | Reason                       |
|------------|---------------------|------------------------------|
| Backend    | Node.js + Express   | Simple, fast, Vercel ready   |
| Auth       | jsonwebtoken (JWT)  | Stateless, scalable          |
| Hashing    | bcryptjs            | Secure password storage      |
| Frontend   | Vanilla HTML/CSS/JS | No build step, lightweight   |
| Deploy     | Vercel              | Free, serverless, fast CDN   |

---

## 4. API Endpoints

| Method | Route      | Auth  | Body / Header              | Response                |
|--------|-----------|-------|----------------------------|-------------------------|
| GET    | `/api`     | ❌    | —                          | API info                |
| POST   | `/token`   | ❌    | `{ uid, password }`        | `{ token, expiresIn }`  |
| POST   | `/verify`  | ❌    | `{ token }`                | `{ data: decoded }`     |
| GET    | `/profile` | ✅    | `Authorization: Bearer x`  | `{ user }`              |

---

## 5. Authentication Flow

1. **Login:** User UID + password bhejta hai → `/token`
2. **Verify:** Server user ko dhundta hai → bcrypt se password compare
3. **Sign:** Match hone par JWT sign hota hai `{ uid, name }` payload ke saath
4. **Store:** Client token `localStorage` me rakhta hai
5. **Access:** Har protected request me `Authorization: Bearer <token>`
6. **Middleware:** Token verify → valid hone par hi access

---

## 6. JWT Structure

**Header:**
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload:**
```json
{ "uid": "4372714908", "name": "Kundan", "iat": 1726..., "exp": 1727... }
```

**Signature:** `HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)`

---

## 7. Security Measures

| Threat              | Mitigation                              |
|---------------------|-----------------------------------------|
| Password leak       | bcrypt hashing (10 rounds)              |
| Token tampering     | HMAC-SHA256 signature                   |
| Token expiry        | `expiresIn: 7d`                         |
| CORS                | `cors()` middleware enabled             |
| Missing auth header | 401 response from middleware            |
| Weak secret         | `.env` me strong random 32+ char secret |

**Future:**
- Rate limiting (`express-rate-limit`)
- Refresh tokens
- HTTPS-only cookies
- CSRF protection

---

## 8. Data Model

```js
User {
  uid:          string  (unique)
  name:         string
  passwordHash: string  (bcrypt)
}
```

**Demo user:**
```js
{
  uid: '4372714908',
  name: 'Kundan',
  passwordHash: bcrypt.hashSync('08CF...AED9', 10)
}
```

---

## 9. File Structure

```
jwt-api/
├── api/index.js         # Express server + routes
├── public/
│   ├── index.html       # Login UI
│   ├── style.css        # Design
│   └── app.js           # Fetch logic
├── docs/DESIGN.md       # This file
├── .env                 # Secrets
├── vercel.json          # Deploy config
└── package.json
```

---

## 10. Deployment (Vercel)

1. GitHub pe push karo
2. Vercel → Import project
3. **Environment Variables** add karo:
   - `JWT_SECRET`
   - `JWT_EXPIRES`
4. Deploy → URL mil jayega

---

## 11. Testing

**cURL:**
```bash
# Token
curl -X POST https://your-app.vercel.app/token \
  -H "Content-Type: application/json" \
  -d '{"uid":"4372714908","password":"08CF...AED9"}'

# Profile
curl https://your-app.vercel.app/profile \
  -H "Authorization: Bearer <TOKEN>"
```

**Browser:** `https://your-app.vercel.app/` → UI se login

---

## 12. Roadmap

- [x] JWT sign & verify
- [x] bcrypt password hashing
- [x] Login UI
- [x] Protected route
- [ ] MongoDB integration
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Register endpoint
- [ ] Password reset flow

---

## 13. Author

**Kundan** — Full Stack Developer
