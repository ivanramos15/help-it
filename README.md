# Help It! — Lost & Found

Web app for reporting and finding lost items. Users create an account, post items
they found or lost, upload a photo, and browse or search everyone's posts.

Live site: https://help-it----firebase-project.web.app

## What it does

- Register and log in with email and password
- Post a found or missing item with a photo, description, and last seen location
- Browse the feed of found items and missing items
- Search posts by item name, description, or owner name
- Sort by oldest or latest, and change how many posts show per page
- Edit or update your own posts

## Built with

- React 19 + Vite
- Firebase Authentication (email and password accounts)
- Firebase Realtime Database (posts)
- Firebase Storage (item photos)
- Firebase Hosting

## Run it locally

Needs Node.js installed.

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually http://localhost:5173.

## Build and deploy

Changes go live only when they are built and deployed:

```bash
npm run build
firebase deploy
```

`npm run build` creates the `dist` folder, and `firebase deploy` uploads it to
Firebase Hosting.
