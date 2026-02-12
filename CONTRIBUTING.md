# Contributing to CAT App

Thank you for your interest in contributing to the CAT App! This document outlines the process for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/cat-app.git
   cd cat-app
   ```

3. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
cat-app/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── admin/       # Admin dashboard
│   │   │   ├── api/         # API routes
│   │   │   └── test/        # Test taking pages
│   │   ├── components/       # React components
│   │   ├── lib/             # Utilities & configurations
│   │   ├── types/           # TypeScript types
│   │   └── data/            # Static data
│   ├── prisma/              # Database schema
│   └── public/              # Static assets
└── README.md
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type
- Use interfaces for object shapes
- Prefer functional components with hooks

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first approach
- Support dark mode
- Use consistent spacing (4px base unit)

### Git Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```
feat(admin): add user management dashboard

- Add user list with pagination
- Implement user search
- Add role-based access control

Fixes #123
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Place tests alongside the code they test
- Use `.test.tsx` or `.test.ts` extension
- Follow the AAA pattern (Arrange, Act, Assert)

## Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run linting and tests:
   ```bash
   npm run lint
   npm test
   ```

4. Commit your changes following conventional commits

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request against the `main` branch

7. Address review feedback

8. Once approved, your PR will be merged

## Code Review Guidelines

Reviewers will check for:
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance is considered
- [ ] Accessibility is maintained

## Security

- Never commit sensitive data
- Use environment variables for secrets
- Sanitize all user inputs
- Follow OWASP security guidelines

## Questions?

If you have questions, feel free to open an issue for discussion.
