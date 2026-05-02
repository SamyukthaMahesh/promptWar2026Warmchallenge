# Google Cloud Run Deployment Guide

This project is deployed using Google Cloud Run, leveraging a containerized architecture for high availability and scalability.

## Deployment Architecture
**GitHub Repository → Docker Build → Nginx Static Server → Google Cloud Run → Public URL**

1. **Source Code**: Stored in a GitHub repository (`SamyukthaMahesh/promptWar2026Warmchallenge`).
2. **Containerization**: A `Dockerfile` utilizes the lightweight `nginx:alpine` image to package the HTML, CSS, and JS files into a secure web server.
3. **Continuous Deployment**: Google Cloud Build listens for changes to the `main` branch, automatically building the Docker image upon every git push.
4. **Cloud Run**: Deploys the built image as a scalable serverless container, routing external internet traffic to Nginx on port 8080.

## Steps to Deploy (If Recreating)
1. Go to Google Cloud Console > **Cloud Run**.
2. Click **Create Service**.
3. Select **Continuously deploy from a repository** and connect GitHub.
4. Select the repository and the `main` branch.
5. Choose **Dockerfile** as the build type.
6. Under Security/Authentication, select **Allow unauthenticated invocations** to make the site public.
7. Click **Create**.

## Health Verification
The application includes a lightweight `/health.html` endpoint to verify the Nginx container is responding correctly without loading the full application logic.
