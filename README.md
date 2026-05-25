# MERN Stack CI/CD Pipeline

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)
![Trivy](https://img.shields.io/badge/Trivy-1904DA?style=flat&logo=aquasecurity&logoColor=white)
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=flat&logo=digitalocean&logoColor=white)

A multi-stage CI/CD pipeline for a full-stack MERN application. Every push runs lint, test, Docker build, Trivy security scan, and deploys to a DigitalOcean droplet via Docker Compose — with zero-downtime using Nginx as a reverse proxy.

---

## Pipeline Stages

```
git push → GitHub Actions
              │
              ├── 1. Lint       (ESLint for JS, flake8 for any Python scripts)
              ├── 2. Test        (Jest unit tests — frontend & backend)
              ├── 3. Build       (Docker build for frontend + backend images)
              ├── 4. Scan        (Trivy image vulnerability scan — CRITICAL/HIGH fail)
              └── 5. Deploy      (SSH into droplet → docker compose pull && up -d)
                                  └── Nginx handles routing + zero-downtime reload
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Security Scan | Trivy |
| Reverse Proxy | Nginx |
| Hosting | DigitalOcean Droplet |

---

## Repository Structure

```
mern-cicd-pipeline/
├── frontend/                   # React app
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend/                    # Express API
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── nginx/                      # Nginx reverse proxy config
│   └── nginx.conf
├── docker-compose.yml          # Local & production compose file
├── .github/
│   └── workflows/
│       └── pipeline.yaml       # Full CI/CD pipeline definition
└── README.md
```

---

## CI/CD Pipeline Details

### Stage 1 — Lint
- ESLint on all `.js` / `.jsx` files in `frontend/` and `backend/`
- Fails fast on any linting error before wasting build time

### Stage 2 — Test
- Jest unit tests for backend API routes
- React Testing Library for frontend components
- Coverage report uploaded as GitHub Actions artifact

### Stage 3 — Build
- Docker multi-stage build to keep image sizes minimal
- Images tagged with the Git commit SHA for traceability
- Pushed to Docker Hub on success

### Stage 4 — Security Scan (Trivy)
- Trivy scans both `frontend` and `backend` images
- Pipeline fails if any `CRITICAL` or `HIGH` CVE is found
- Scan results exported as a GitHub Actions artifact

### Stage 5 — Deploy
- GitHub Actions SSHs into the DigitalOcean droplet
- Pulls latest images and runs `docker compose up -d --no-deps`
- Nginx reloads config without dropping active connections (zero-downtime)

---

## Setup & Usage

> 🚧 **Implementation in progress** — setup instructions will be added as the project is built out.

Prerequisites:
- Docker & Docker Compose on your machine
- DigitalOcean droplet (or any Linux VPS)
- Docker Hub account

```bash
# Clone the repo
git clone https://github.com/Rashed00/mern-cicd-pipeline.git

# Run locally with Docker Compose
docker compose up --build

# App available at:
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
# Via Nginx → http://localhost:80
```

**Required GitHub Secrets:**
```
DOCKER_USERNAME       # Docker Hub username
DOCKER_PASSWORD       # Docker Hub token
DROPLET_HOST          # DigitalOcean droplet IP
DROPLET_SSH_KEY       # Private SSH key for the droplet
```

---

## Roadmap

- [x] Project structure & README
- [ ] Backend Express API (CRUD)
- [ ] Frontend React app
- [ ] Docker & Docker Compose setup
- [ ] Nginx reverse proxy config
- [ ] GitHub Actions pipeline (lint → test → build → scan → deploy)
- [ ] Trivy scan integration
- [ ] Zero-downtime deploy verification

---

## Author

**Rashed Wahdan** — [LinkedIn](https://www.linkedin.com/in/rashed-wahdan-a4b124145/) · [GitHub](https://github.com/Rashed00)
