# CalorieCompany

This repository has two apps: a Vite React client in `client/` and a Node/Express API in `server/`.

## Quick start

1. Install dependencies for both apps

```bash
cd client && npm install
cd ../server && npm install
```

2. Start each app in separate terminals

Terminal 1 (client):

```bash
cd client
npm run dev
```

Terminal 2 (server):

```bash
cd server
npm run dev
```

The client defaults to `http://localhost:5173` and expects the API at `http://localhost:4000/api`.

## Environment

- Client: set `VITE_API_URL` in `client/.env` to point to a different API if needed
- Server: set `MONGODB_URI` in `server/.env`

## Project layout

- `client/` React + TypeScript + Tailwind
- `server/` Express + Mongoose (TypeScript)

## Git commits

## Pushing This Project to GitHub

Since this repository already exists remotely and contains files like `.gitignore` and `package.json`, here are the commands used to push the local project to GitHub:

```bash
# Navigate to the project root (contains package.json and .gitignore)
cd path/to/your/project

# Initialize Git if not already done
git init

# Link local repo to the existing GitHub repo
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Stage all changes
git add .

# Commit the changes
git commit -m "Adding full project files"

# Push to the remote repository
git push -u origin main
```

## Screenshots

### Home Page
![Home Page](./docs/MainDash.png)

### Add Entry Form
![Add Entry](./docs/AddedEntriesMainDash.png)

### Weight Progress Chart
![Weight Progress](./docs/WeightChart.png)
