# Local Docker Workflow

This branch uses local Docker builds instead of GitHub Actions.

## Quick Start

### Build Image
```bash
docker build -t tanishr/ecommerce-catalog:latest .
```

### Test Locally
```bash
docker run -d -p 3000:3000 --name test tanishr/ecommerce-catalog:latest
# Open http://localhost:3000
docker stop test && docker rm test
```

### Push to Docker Hub
```bash
docker login
docker push tanishr/ecommerce-catalog:latest
```

### With Docker Compose
```bash
docker-compose up -d --build
docker-compose logs -f
docker-compose down
```

## Daily Workflow
1. Make code changes
2. `npm run dev` - test locally
3. `docker build -t tanishr/ecommerce-catalog:latest .` - build image
4. `docker run -d -p 3000:3000 --name test tanishr/ecommerce-catalog:latest` - test
5. `docker push tanishr/ecommerce-catalog:latest` - deploy
6. `git commit && git push` - save code