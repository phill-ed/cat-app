# CAT App - Computer Assisted Test Platform

<div align="center">

![CAT App](https://img.shields.io/badge/CAT-App-blue?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql)

**Assessment application for Indonesian government workers test (CPNS/CPNS)**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](CONTRIBUTING.md)

</div>

---

## About

CAT App is a comprehensive computer-assisted test platform designed for Indonesian government certification exams (CPNS). Built with modern web technologies, it provides a complete solution for creating, administering, and analyzing assessments.

## Features

### For Test Takers
- 📝 Take timed practice tests
- 📊 Instant results with detailed feedback
- 📈 Performance tracking over time
- 🌙 Dark mode support
- 📱 Fully responsive design

### For Administrators
- 📋 Create and manage test banks
- 👥 User management with role-based access
- 📊 Analytics dashboard with charts
- 📄 PDF export for results
- 🔒 Secure authentication

### Technical Features
- ⚡ Server-side rendering with Next.js 14
- 🔐 Secure authentication with NextAuth.js
- 📦 Type-safe with TypeScript
- 🎨 Modern UI with Tailwind CSS
- 📊 Data visualization with Chart.js

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/phill-ed/cat-app.git
   cd cat-app/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/cat_app"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
cat-app/
├── prisma/
│   └── schema.prisma          # Database schema & models
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── analytics/     # Analytics page
│   │   │   ├── questions/     # Question management
│   │   │   ├── tests/         # Test management
│   │   │   └── users/         # User management
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin endpoints
│   │   │   ├── analytics/     # Analytics API
│   │   │   ├── auth/          # Authentication
│   │   │   ├── export/        # PDF export
│   │   │   ├── questions/      # Questions CRUD
│   │   │   ├── sessions/      # Test sessions
│   │   │   └── tests/         # Tests CRUD
│   │   ├── test/[id]/         # Test taking page
│   │   ├── results/[id]/      # Results page
│   │   ├── auth/              # Authentication pages
│   │   └── page.tsx           # Home page
│   ├── components/             # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── ...
│   ├── lib/                   # Utilities & configs
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── pdf.ts            # PDF generation
│   │   ├── security.ts       # Security utilities
│   │   ├── theme-provider.tsx # Dark/light mode
│   │   ├── utils.ts          # Helper functions
│   │   └── validators.ts      # Zod validation schemas
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
├── .env.example              # Environment template
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/[...nextauth]` | NextAuth.js handler |
| POST | `/api/auth/register` | Register new user |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | List questions (with filters) |
| POST | `/api/questions` | Create question (admin) |
| GET | `/api/questions/[id]` | Get single question |
| PUT | `/api/questions/[id]` | Update question (admin) |
| DELETE | `/api/questions/[id]` | Delete question (admin) |

### Tests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests` | List tests |
| POST | `/api/tests` | Create test (admin) |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Start test session |
| GET | `/api/sessions` | List user's sessions |
| GET | `/api/sessions/[id]` | Get session details |
| POST | `/api/sessions/[id]` | Submit answer |
| PUT | `/api/sessions/[id]` | Complete test |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List users |
| POST | `/api/admin/users` | Create user |
| GET | `/api/analytics` | Analytics data |

## CAT Test Categories

- **TWK** - Tes Wawasan Kebangsaan (National Insight)
- **TKP** - Tes Karakteristik Pribadi (Personal Characteristics)
- **PU** - Tes Intelegensi Umum (General Intelligence)

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -t cat-app .
docker run -p 3000:3000 cat-app
```

### Railway

1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No |

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Security

For security vulnerabilities, please email tendaedwin.et@gmail.com instead of opening a public issue.

See our [Security Policy](SECURITY.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Chart.js](https://www.chartjs.org/)

---

<div align="center">

Made with ❤️ by [phill-ed](https://github.com/phill-ed)

</div>
