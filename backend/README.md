# Mongo FastAPI Backend Project

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) (v20.10+)
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- [VS Code](https://code.visualstudio.com/) (recommended)

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
uv sync
```

2. Activate Virtual Environment

```bash
source .venv/bin/activate
```

3. Configure environment variables:
   Create a `.env` file and the following environment variables.:

```bash
# Domain
# Environment: local, staging, production
ENVIRONMENT=local

PROJECT_NAME=MongoDb FastAPI Backend Project
STACK_NAME=mongodb-fastapi-backend-project

# Backend
BACKEND_CORS_ORIGINS="http://localhost,http://localhost:5173,https://localhost,https://localhost:5173,http://localhost.tiangolo.com"

SECRET_KEY=<your_secret_key>
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=<your_password>

# Emails
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_EMAIL=info@example.com
SMTP_TLS=True
SMTP_SSL=False
SMTP_PORT=587

SENTRY_DSN=

# Configure these with your own Docker registry images
MONGODB_URI=<your_mongodb_uri>
MONGODB_DB_NAME=<your_db_name>

```

4. Start Development Environment

```bash
docker compose watch
```

🏃 Running the Application Locally

Start the development server:

```bash
$ fastapi run --reload app/main.py
```

## Backend tests

To test the backend run:

```bash
pytest
```

in watch mode:

```bash
ptw -- -s
```
