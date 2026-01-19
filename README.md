# Me-API Playground 🎯

A full-stack portfolio management application that stores your profile, projects, skills, and education in a database and exposes it via a REST API. Features profile management, project search by skill, general search, and a minimal React frontend for queries.

**Live:**

- 🌐 Frontend: https://my-api-playground-sigma.vercel.app
- 🔗 Backend API: https://my-api-playground-lzxf.onrender.com
- 💚 Health: https://my-api-playground-lzxf.onrender.com/health

---

## 📋 Architecture

```
┌──────────────────────┐
│   React Frontend     │  (Port 5173 / Vercel)
│   - Search UI        │  → axios/fetch
│   - Profile View     │
└─────────┬────────────┘
          │ CORS enabled
          ▼
┌──────────────────────┐
│  Express Backend     │  (Port 3000 / Render)
│  - REST API routes   │  → Prisma ORM
│  - JWT Auth          │
│  - Logging           │
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│   SQLite / Postgres  │  (Local dev / Render prod)
│   - Profile data     │
│   - Projects         │
│   - Skills           │
└──────────────────────┘
```

### API Endpoints at a Glance

| Method | Endpoint            | Description                             | Auth |
| ------ | ------------------- | --------------------------------------- | ---- |
| GET    | `/health`           | Liveness probe                          | ❌   |
| GET    | `/profile`          | Get full profile                        | ❌   |
| POST   | `/profile`          | Update profile                          | ✅   |
| GET    | `/projects`         | List projects (filterable by `?skill=`) | ❌   |
| POST   | `/projects`         | Create project                          | ✅   |
| GET    | `/skills`           | List all skills                         | ❌   |
| GET    | `/skills/top`       | Top 10 skills by usage                  | ❌   |
| GET    | `/search?q=<query>` | Search projects & skills                | ❌   |
| POST   | `/auth/signup`      | Register user                           | ❌   |
| POST   | `/auth/signin`      | Login & get token                       | ❌   |

---

## 📊 Database Schema

All models are defined in [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

### Key Models

**Profile**

- `id`, `name`, `email` (unique), `password` (hashed)
- Relations: `education[]`, `projects[]`, `skills[]`, `links[]`

**Project**

- `id`, `title`, `description`, `work`, `createdAt`
- Relations: `skills[]` (M2M), `links[]`, `profile`

**Skill**

- `id`, `name` (unique per profile)
- Relations: `projects[]` (M2M)

**Education**

- `degree`, `institution`, `startYear`, `endYear`

**Link** (for Profile GitHub/LinkedIn/Portfolio)

- `type` ("github", "linkedin", "portfolio"), `url`

---

## 🚀 Setup (Local Development)

### Prerequisites

```bash
- Node.js 18+
- npm or bun
- SQLite (bundled with Prisma)
```

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (if running locally)
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-dev-secret"
PORT=3000
NODE_ENV=development
```

**Frontend** (`frontend/src/config.ts`):

```typescript
export const API_BASE_URL = "http://localhost:3000";
```

### 3. Initialize Database

```bash
cd backend

# Create and migrate database
npx prisma migrate deploy

# Seed with sample data
npx prisma db seed
```

### 4. Start Servers

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend** (optional):

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 📡 API Examples

### **1. Health Check**

```bash
curl https://my-api-playground-lzxf.onrender.com/health
```

### **2. Get Profile**

```bash
curl https://my-api-playground-lzxf.onrender.com/profile
```

### **3. List Projects**

```bash
curl https://my-api-playground-lzxf.onrender.com/projects
```

### **4. Filter Projects by Skill** ⭐

```bash
curl "https://my-api-playground-lzxf.onrender.com/projects?skill=react"
```

### **5. Search (NEW)** ⭐

```bash
curl "https://my-api-playground-lzxf.onrender.com/search?q=node"
# Returns: { query, results: { projects[], skills[] }, count }
```

### **6. Get Top Skills**

```bash
curl https://my-api-playground-lzxf.onrender.com/skills/top
```

### **7. Sign Up**

```bash
curl -X POST https://my-api-playground-lzxf.onrender.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### **8. Sign In & Get Token**

```bash
curl -X POST https://my-api-playground-lzxf.onrender.com/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
# Returns: { token, user }
```

### **9. Create Project (Protected)**

```bash
curl -X POST https://my-api-playground-lzxf.onrender.com/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My App",
    "description": "Cool project",
    "work": "Personal Project",
    "profileId": "YOUR_PROFILE_ID"
  }'
```

---

## 🎯 Acceptance Criteria

| ✅ Requirement                          | Status |
| --------------------------------------- | ------ |
| `GET /health` returns 200               | ✅     |
| Queries return correct filtered results | ✅     |
| Seed data visible via UI                | ✅     |
| README complete & reproducible          | ✅     |
| URLs load without console errors        | ✅     |
| CORS properly configured                | ✅     |
| Working search endpoint                 | ✅     |
| Schema with migrations                  | ✅     |
| Logging for debugging                   | ✅     |

---

## 📦 Seed Data

The database comes pre-seeded with:

- **Profile:** Vineet (full-stack engineer)
- **Skills:** 26 technologies (React, Node, Python, Docker, Kubernetes, etc.)
- **Projects:** 5 demo projects with skill associations
  - AI Interviewer
  - Sentry (Real-Time Monitoring)
  - URL Shortener
  - VibeNet (Social Network)
  - Bird Game
- **Education:** B.Tech Computer Science, NIT Delhi (2023–2027)

To reseed: `npm run seed` (from backend)

---

## 🌐 Production Deployment

### Backend (Render)

1. Push to GitHub
2. Create Render service, set env vars:
   ```
   DATABASE_URL=postgresql://user:pass@host/db
   JWT_SECRET=your-production-secret
   ```
3. Deploy

### Frontend (Vercel)

1. Push to GitHub
2. Import frontend folder in Vercel
3. Set `API_BASE_URL` environment variable
4. Deploy

---

## 🛡️ Security & Best Practices

| Feature                   | Status        |
| ------------------------- | ------------- |
| Password hashing (bcrypt) | ✅            |
| JWT authentication        | ✅            |
| CORS whitelist            | ✅            |
| Error handling            | ✅            |
| Logging                   | ✅            |
| Rate limiting             | ⚠️ (Optional) |
| Input validation          | ✅            |
| HTTPS (production)        | ✅            |

---

## 🚧 Known Limitations

1. **SQLite in dev** – Use PostgreSQL for production
2. **No refresh tokens** – Tokens expire in 7 days
3. **Basic search** – Substring matching only (no full-text)
4. **No pagination** – Returns all results (use `take` in Prisma for limits)
5. **Minimal frontend** – Focus on API, not UI polish

---

## 📝 Next Steps / Improvements

- [ ] Add pagination & sorting
- [ ] Implement rate limiting
- [ ] Add refresh token flow
- [ ] Email verification on signup
- [ ] Profile picture upload
- [ ] Full-text search with Elasticsearch
- [ ] API documentation (Swagger)
- [ ] Unit & integration tests
- [ ] CI/CD pipeline (GitHub Actions)

---

## 👤 Resume & Links

- 📄 **Resume:** [Add your resume URL here]
- 🐙 **GitHub:** [Your GitHub profile]
- 💼 **LinkedIn:** [Your LinkedIn profile]
- 🌐 **Portfolio:** [Your portfolio website]

---

## 📁 Project Structure

```
my_api_playground/
├── backend/
│   ├── src/
│   │   ├── index.ts             # Main server
│   │   ├── middleware.ts        # JWT auth middleware
│   │   ├── prisma.ts            # Prisma client
│   │   └── routes/
│   │       ├── auth.ts          # Signup/Signin
│   │       ├── profile.ts       # Profile GET/POST
│   │       ├── project.ts       # Projects CRUD
│   │       ├── skill.ts         # Skills GET/top
│   │       └── search.ts        # Search endpoint
│   ├── prisma/
│   │   ├── schema.prisma        # Data models
│   │   ├── seed.ts              # Sample data
│   │   └── migrations/          # DB migrations
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page views
│   │   ├── lib/api.ts           # API helpers
│   │   ├── config.ts            # API base URL
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml           # Docker setup (optional)
└── README.md                    # This file
```

---

## 🧪 Testing Endpoints Locally

Use **Postman** or **Insomnia** and import:

```json
{
  "client": "insomnia",
  "info": { "name": "Me-API Playground", "version": 1 },
  "item": [
    { "method": "GET", "url": "{{baseUrl}}/health" },
    { "method": "GET", "url": "{{baseUrl}}/profile" },
    { "method": "GET", "url": "{{baseUrl}}/projects?skill=react" },
    { "method": "GET", "url": "{{baseUrl}}/search?q=node" },
    { "method": "GET", "url": "{{baseUrl}}/skills/top" }
  ]
}
```

Set `{{baseUrl}}` to:

- Local: `http://localhost:3000`
- Production: `https://my-api-playground-lzxf.onrender.com`

---

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev/)
- [JWT Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

---

**Built as a portfolio project demonstrating full-stack development.**

---
