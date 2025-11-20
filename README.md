## Project Structure

- `resort-booking-fe/` - Next.js frontend
- `resort-booking-be/` - Express backend API

## Quick Start

### Frontend
Create .env file in the frontend folder with these fieds:
NEXT_PUBLIC_API_URL=your_frontend_url

```bash
cd resort-booking-fe
npm install
npm run dev
```

### Backend
Create .env file in the backend folder with these fields:
MONGO_URI=your_mongo_db_uri
PORT=5000
NODE_ENV=development
FRONTEND_URL=your_frontend_url

```bash
cd resort-booking-be
npm install
npm run dev
```

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Node.js
- Express
- MongoDB
- TypeScript

## URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

