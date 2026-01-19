# Professional Portfolio Hub

A full-stack professional portfolio application showcasing projects, skills, and experience.

## Quick Start

### Using Docker (Recommended)

```sh
docker compose up
```

Access the application at http://localhost:8080

### Local Development

**Prerequisites**: Node.js & npm installed

```sh
# Backend
cd backend
npm install
npm run dev

# Frontend (in a new terminal)
cd my-professional-hub-main
npm install
npm run dev
```

## Technologies Used

This project is built with:

- **Frontend**: React, TypeScript, Vite, shadcn-ui, Tailwind CSS
- **Backend**: Node.js, Express.js, Prisma, SQLite
- **DevOps**: Docker, Docker Compose

## Project Structure

```
my_api_playground/
├── backend/                 # Express.js API server
│   ├── src/
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── my-professional-hub-main/  # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── docker-compose.yml      # Service orchestration
```

## Features

- 📋 Professional Profile Display
- 🎓 Education Section
- 📁 Project Showcase with Links
- 🛠 Technical Skills Library
- 🔗 Social Media Links
- 📱 Responsive Design
- ⚡ Real-time API Integration
