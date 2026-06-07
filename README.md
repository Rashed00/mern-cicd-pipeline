# MERN Stack CI/CD Pipeline

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-0F1689?style=flat&logo=helm&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=flat&logo=terraform&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)
![Trivy](https://img.shields.io/badge/Trivy-1904DA?style=flat&logo=aquasecurity&logoColor=white)

A production-grade CI/CD pipeline for a full-stack MERN Todo application. Every push to `main` automatically lints, tests, builds Docker images, runs a Trivy security scan, pushes to AWS ECR, and deploys to an EKS cluster via Helm — with zero manual steps.

---

## Architecture

```
Internet
   │
   ▼
AWS NLB (LoadBalancer Service)
   │
   ▼
Nginx Ingress Controller
   │
   ├── /api/*  ──► backend Service (ClusterIP) ──► backend Pod
   │                                                     │
   │                                               MongoDB Service
   │                                               (ClusterIP only)
   │                                                     │
   │                                               MongoDB Pod + EBS PVC
   │
   └── /*      ──► frontend Service (ClusterIP) ──► frontend Pod
```

---

## CI/CD Workflow

```
Developer push to main
        │
        ▼
GitHub Actions
        │
        ├── 1. Lint         (ESLint — frontend & backend)
        ├── 2. Test         (Vitest — frontend | Jest — backend)
        ├── 3. Build        (Docker multi-stage build, tagged with commit SHA)
        ├── 4. Scan         (Trivy — blocks on CRITICAL CVEs)
        ├── 5. Push         (AWS ECR)
        └── 6. Deploy       (Helm upgrade → EKS)
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB |
| Containerization | Docker + Docker Compose |
| Container Registry | AWS ECR |
| Infrastructure | Terraform (VPC, EKS, ECR, EBS CSI) |
| Orchestration | Kubernetes (EKS) |
| Package Manager | Helm |
| Ingress | Nginx Ingress Controller + AWS NLB |
| CI/CD | GitHub Actions |
| Security Scan | Trivy |

---

## Repository Structure

```
mern-cicd-pipeline/
├── backend/                    # Express API
│   ├── src/
│   │   ├── models/Todo.js
│   │   ├── routes/todos.js
│   │   └── index.js
│   ├── tests/todos.test.js
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── nginx/                      # Local dev reverse proxy
│   └── nginx.conf
├── helm/mern-app/              # Helm chart for EKS deployment
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── mongo-deployment.yaml
│       ├── mongo-pvc.yaml
│       ├── mongo-service.yaml
│       └── ingress.yaml
├── terraform/                  # AWS infrastructure
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars
├── k8s/
│   └── storageclass.yaml       # gp2-csi EBS storage class
├── docker-compose.yml          # Local development
├── .github/workflows/
│   └── pipeline.yaml           # CI/CD pipeline
└── README.md
```

---

## Local Development

Prerequisites: Docker, Docker Compose

```bash
# Clone the repo
git clone https://github.com/Rashed00/mern-cicd-pipeline.git
cd mern-cicd-pipeline

# Run locally
docker compose up --build

# App available at http://localhost:8080
```

---

## Infrastructure Setup (Terraform)

Prerequisites: Terraform, AWS CLI configured

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

This provisions: VPC, 2 public subnets, IGW, EKS cluster, EKS node group (t3.small), ECR repository, EBS CSI driver addon, and all required IAM roles.

After apply, configure kubectl:
```bash
aws eks update-kubeconfig --region eu-west-1 --name mern-cluster
```

---

## Kubernetes Setup (one-time)

```bash
# Install Nginx Ingress Controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace

# Create EBS storage class
kubectl apply -f k8s/storageclass.yaml

# Initial app deploy
helm install mern-app helm/mern-app
```

---

## CI/CD Pipeline

### Required GitHub Secrets

```
AWS_ACCESS_KEY_ID        # AWS IAM access key
AWS_SECRET_ACCESS_KEY    # AWS IAM secret key
```

### Pipeline Flow

On every push to `main`:

1. **Lint** — ESLint on frontend and backend source files
2. **Test** — Vitest (frontend) and Jest (backend) with coverage
3. **Build** — Docker multi-stage builds tagged with `<service>-<commit-sha>`
4. **Scan** — Trivy scans both images, blocks on any CRITICAL CVE
5. **Push** — Images pushed to AWS ECR
6. **Deploy** — `helm upgrade` deploys new image tags to EKS, waits for rollout

### Teardown (to save costs)

```bash
helm uninstall mern-app
helm uninstall ingress-nginx -n ingress-nginx
kubectl delete namespace ingress-nginx
sleep 120
cd terraform && terraform destroy
```

---

## Roadmap

- [x] MERN app (React + Express + MongoDB)
- [x] Dockerfiles with multi-stage builds
- [x] Docker Compose for local development
- [x] Nginx reverse proxy (local)
- [x] Terraform — VPC, EKS, ECR, EBS CSI
- [x] Helm chart for Kubernetes deployment
- [x] Nginx Ingress Controller + AWS NLB
- [x] GitHub Actions pipeline (lint → test → build → scan → push → deploy)
- [x] Trivy security scan (blocks on CRITICAL)
- [ ] HTTPS / SSL termination
- [ ] Horizontal Pod Autoscaler

---

## Author

**Rashed Wahdan** — [LinkedIn](https://www.linkedin.com/in/rashed-wahdan-a4b124145/) · [GitHub](https://github.com/Rashed00)
