# How to Deploy OpenDiscover on Google Cloud

Since this is a client-side React application (Vite), the best and key way to host it on Google Cloud is using **Firebase Hosting**.

It is free, fast (global CDN), and includes SSL automatically.

## Option 1: Firebase Hosting (Recommended)

### 1. Prerequisites
You need Node.js installed. Then install the Firebase CLI:
```bash
npm install -g firebase-tools
```

### 2. Login
Log in to your Google Account:
```bash
firebase login
```

### 3. Initialize
Run this command in your project folder (`new project`):
```bash
firebase init hosting
```

**Answer the questions:**
1.  **Project:** Select "Create a new project" (or select an existing one).
2.  **Public directory:** Type `dist` (Vite builds to this folder).
3.  **Configure as a single-page app:** Type `Yes`.
4.  **Set up automatic builds and deploys with GitHub:** `No` (for now).

### 4. Build & Deploy
Build your app for production:
```bash
npm run build
```

Deploy to Google Cloud:
```bash
firebase deploy
```

**Done!** You will get a link like `https://opendiscover-app.web.app`.

---

## Option 2: Google Cloud Run (Docker)

If you prefer a Docker container (e.g., if you add a backend later):

### 1. Create a `Dockerfile`
Create a file named `Dockerfile` in the root:

```dockerfile
# Stage 1: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create `nginx.conf`
Required for SPA routing:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Deploy
```bash
gcloud run deploy opendiscover --source . --region us-central1 --allow-unauthenticated
```
