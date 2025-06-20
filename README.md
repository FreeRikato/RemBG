# Image Background Removal API

A Node.js API to upload an image and remove its background asynchronously using a background worker.

**Tech:** Node.js, TypeScript, Express, PostgreSQL, Redis, BullMQ, TypeORM, AWS S3

## Prerequisites

*   [Node.js](https://nodejs.org/) & npm
*   [Docker](https://www.docker.com/)
*   [Python](https://www.python.org/) & pip
*   `rembg` CLI: `pip install rembg`

## Quick Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    # From project root
    (cd backend && npm install) && (cd worker && npm install)
    ```

3.  **Create `.env` file** in the root directory with your credentials:
    ```env
    # Application & Auth
    PORT=3000
    JWT_SECRET=your_secret_key

    # Database & Redis
    POSTGRES_USER=<Username> # Make sure to change in data-source.ts
    POSTGRES_PASSWORD=<Password> # Make sure to change in data-source.ts
    POSTGRES_DB=<DB_Name> # Make sure to change in data-source.ts

    # AWS S3
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    AWS_REGION=your_s3_bucket_region
    AWS_BUCKET_NAME=your_s3_bucket_name
    ```

---

## Running the App

Run the backend and the worker in two separate terminals.

**1. Start the API Server:**
```bash
cd backend
npm run dev
```

**2. Start the Worker:**
```bash
cd worker
npx ts-node index.ts
```

---

## Core API Endpoints

*   `POST /auth/register` - Create a new user.
*   `POST /auth/login` - Get a JWT for an existing user.
*   `POST /png/upload` - Upload an image to start background removal (Auth required).
*   `GET /png/:jobID` - Check the status of an image processing job (Auth required).
