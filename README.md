# CAT (Computer Assisted Test) App

Assessment application for Indonesian government workers test (CPNS/CPNS).

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js
- **State:** Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and configurations
│   └── types/             # TypeScript types
├── public/                # Static assets
└── ...config files
```

## Features

- User authentication (Admin & Test Taker roles)
- Create and manage tests/exams
- Timed test sessions with automatic scoring
- Question bank with multiple choice answers
- Results and analytics dashboard
- Responsive design

## CAT Test Categories

- **TWK** - Tes Wawasan Kebangsaan (National Insight)
- **TKP** - Tes Karakteristik Pribadi (Personal Characteristics)
- **PU** - Tes Intelegensi Umum (General Intelligence)

## License

MIT
