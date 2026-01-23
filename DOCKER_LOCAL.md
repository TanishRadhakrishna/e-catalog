# Docker Guide – E-commerce Catalog (Next.js)

This document explains how Docker is used in the **E-commerce Catalog** project, how to run the container, and why Docker Compose is not required for this setup.

---

## 1. Overview

* **Framework**: Next.js (App Router)
* **Containerization**: Docker (multi-stage build)
* **Runtime Port**: `3000`
* **Database**: SQLite (file-based, inside container)
* **Deployment Goal**: Single-command, portable deployment

This project is packaged as **one self-contained Docker image**.

---

## 2. Why Docker Is Used

Docker is used to:

* Ensure the same runtime environment on all machines
* Avoid local dependency and OS issues
* Package the app, Node.js runtime, and dependencies together
* Allow deployment without sharing source code

With Docker, the application runs the same on:

* Developer laptops
* Other team members’ systems
* Cloud servers

---

## 3. Project Structure (Relevant to Docker)

Key Docker-related files in this project:

```
ecommerce-catalog/
├─ Dockerfile          # Defines how the image is built
├─ .dockerignore       # Excludes unnecessary files from image
├─ next.config.mjs     # Uses output: 'standalone'
├─ data/
│  └─ db.sqlite        # SQLite database
```

There is **only one service**: the Next.js application.

---

## 4. Build the Docker Image

Run this from the project root (where the Dockerfile exists):

```bash
docker build -t tanishr/ecommerce-catalog:latest .

```

This command:

* Installs dependencies as mentioned in the Dockerfile
* Builds the Next.js production bundle
* Creates a lightweight production image

---

## 5. Run the Container

```bash
docker run -d -p 3000:3000 --name ecommerce tanishr/ecommerce-catalog
```

Access the application at:

```
http://localhost:3000
```

---

## 6. Useful Docker Commands

Check running container:

```bash
docker ps
```

View logs:

```bash
docker logs ecommerce
```

Stop and remove container:

```bash
docker stop ecommerce
docker rm ecommerce
```

---
## 7.Push to Docker Hub

### 1. Login to Docker Hub
docker login
Username: tanishr
Password: [access token]

### 2. Tag image with Docker Hub username
docker tag ecommerce-catalog:latest tanishr/ecommerce-catalog:latest

### 3. Push images
docker push tanishr/ecommerce-catalog:latest

## 7. Running on Another System

On any system with Docker installed:

```bash
docker pull tanishr/ecommerce-catalog:latest
docker run -d -p 3000:3000 --name ecommerce tamishr/ecommerce-catalog:latest
```

No project folder or source code is required.

Access the application at:

```
http://localhost:3000
```

---

## 8. Why There Is NO docker-compose.yml File

### What Docker Compose Is

Docker Compose is used when an application has **multiple containers** that must run together, such as:

* Frontend (React / Next.js)
* Backend (Node / Java / Python)
* Database (PostgreSQL / MySQL)
* Cache (Redis)
* Message queues, etc.

Compose helps define and start all services together using one file.

---

### Why This Project Does NOT Use Docker Compose

This project:

* Has **only one service** (Next.js app)
* Uses **SQLite**, not a separate database container
* Does not depend on Redis, queues, or background workers
* Can be started with a single `docker run` command

Because of this:

* Docker Compose would add unnecessary complexity
* A `docker-compose.yml` file is **not required**

Using plain Docker commands is simpler and clearer for this architecture.

---

## 9. When Docker Compose SHOULD Be Used

Docker Compose would be added if:

* SQLite is replaced with PostgreSQL/MySQL
* A separate backend service is introduced
* Redis or other services are added
* Multiple containers must communicate with each other

Example future use case:

* `frontend` container
* `backend` container
* `database` container

At that point, Docker Compose becomes useful.

---
## 10. Summary

* Docker is used to package and deploy the app consistently
* The project runs as a **single container**
* Docker Compose is **not used because it is unnecessary**
* The setup is production-ready and portable

---
