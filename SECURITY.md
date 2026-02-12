# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅ Yes    |
| Previous| ❌ No     |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly by:

1. **Do NOT** open a public issue
2. Email: tendaedwin.et@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Your contact information

We will respond within 24-48 hours.

## Security Measures

### Authentication
- Session-based authentication with JWT
- Password hashing (bcrypt)
- OAuth support (Google)
- Two-factor authentication (planned)

### Data Protection
- All data encrypted in transit (HTTPS)
- Password hashing with salt
- Sensitive data masked in logs

### API Security
- Rate limiting on all endpoints
- Stricter limits on auth endpoints
- Input validation and sanitization
- CORS configuration

### Infrastructure
- HTTPS enforced
- Security headers (HSTS, XSS protection)
- Regular dependency updates
- Automated security scanning

## Best Practices for Users

1. **Use strong passwords** - At least 12 characters
2. **Enable 2FA** - When available
3. **Keep credentials private** - Never share API keys
4. **Regular updates** - Keep the app updated
5. **Monitor activity** - Review logs regularly

## Dependencies

We use:
- `npm audit` for vulnerability scanning
- Dependabot for automatic updates
- Snyk for additional security checks

Run `npm audit` regularly to check for vulnerabilities.
