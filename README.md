# CalorieCompany

CalorieCompany is a full-stack web application for tracking daily calorie intake, monitoring progress toward weight goals, and visualizing health data. The app is designed for athletes, college students, and health-conscious users who want an easy way to log meals, review nutrition trends, and track weight changes over time.


This repository contains two main components:
- **Client**: Vite + React + TypeScript + Tailwind (located in `client/`)
- **Server**: Node.js + Express + Mongoose (located in `server/`)

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

## Features
- User-Friendly Dashboard – Displays total calories and nutritional breakdown.

- Add Entry Form – Quickly log meals with calorie counts.

- Weight Progress Chart – View weight changes over time with interactive charts.

- Responsive Design – Works on desktop and mobile devices.

- Data Persistence – All data stored securely in MongoDB via the backend API.

## Future Development Roadmap
- Add user authentication for personalized data.

- Implement nutrition macros tracking (protein, carbs, fat).

- Introduce goal-setting and progress notifications.

- Add mobile app version using React Native.

## Technology Stack

- Frontend (client): Vite, React, TypeScript, Tailwind CSS

- Backend (server): Node.js, Express.js, Mongoose

- Database: MongoDB

- Other Tools: Git, npm

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

## Contact 
- Developer: Vraj Patel
- Email: vrajp@vt.edu
- Github: https://github.com/camelCase5
