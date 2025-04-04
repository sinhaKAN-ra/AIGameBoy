# AIGameBoy Platform

A modern gaming platform for AI-created games, featuring leaderboards, model showcases, and a vibrant community.

## Project Structure

This project is structured as a monorepo with separate frontend and backend packages:

```
/AIGameMaster
  /client        - React/Vite frontend
  /server        - Express backend API
  /shared        - Shared types and utilities
  /scripts       - Build and utility scripts
```

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use the included in-memory implementation)

### Frontend Development

```bash
cd client
npm install
npm run dev
```

The frontend will be available at http://localhost:5173

### Backend Development

```bash
cd server
npm install
npm run dev
```

The API server will be available at http://localhost:5001

### Shared Package

The shared package contains common types and utilities used by both frontend and backend.

```bash
cd shared
npm install
npm run build
```

## Production Deployment

### Frontend

```bash
cd client
npm install
npm run build
```

Deploy the `client/dist` directory to your hosting provider (Vercel, Netlify, etc.)

### Backend

```bash
cd server
npm install
npm run build
```

Deploy the `server/dist` directory to your server hosting provider.

## SEO Optimization

The project includes several SEO optimizations:

1. Dynamic meta tags via the `SeoMeta` component
2. Structured data with JSON-LD
3. Auto-generated sitemap.xml
4. Canonical URLs

To generate a new sitemap:

```bash
npm run generate-sitemap
```

## Environment Variables

### Frontend (.env in client directory)
```
VITE_API_URL=http://localhost:5001
```

### Backend (.env in server directory)
```
PORT=5001
DATABASE_URL=postgresql://user:password@localhost:5432/aigameboy
SESSION_SECRET=your-secret-key
```

## License

MIT
