# Deployment Guide

This document describes the deployment setup for the voder.ai website, including configuration, monitoring, and troubleshooting.

## Overview

The website is deployed using **Vercel** with automatic deployment from the main branch. This setup provides:

- ✅ Automatic deployment on main branch pushes
- ✅ Custom domain support
- ✅ Automatic SSL certificates
- ✅ Global CDN distribution
- ✅ Deploy previews for pull requests
- ✅ Performance monitoring
- ✅ Security headers

## Deployment Configuration

### Vercel Configuration (`vercel.json`)

The project includes a `vercel.json` file that configures:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Framework**: Vite (automatic detection)
- **Security Headers**: Content security, frame options, XSS protection
- **Caching**: Optimized asset caching for performance
- **SPA Routing**: Fallback to index.html for client-side routing

### GitHub Actions (`deploy.yml`)

The deployment workflow:

1. **Build and Test**: Runs complete verification pipeline
2. **Screenshot Tests**: Validates visual consistency
3. **Build Production**: Creates optimized production build
4. **Deploy Status**: Provides deployment notifications

## npm Scripts

### Deployment Commands

```bash
# Check deployment readiness (full verification + screenshots)
npm run deploy:check

# Preview production build locally
npm run deploy:preview

# Check current deployment status
npm run deploy:status

# Production deployment (handled automatically by Vercel)
npm run deploy:production
```

### Pre-deployment Verification

The `deploy:check` script runs:

- Security audit (`npm audit`)
- Linting (ESLint, Stylelint, HTMLHint, Markdownlint)
- Type checking (TypeScript)
- Formatting verification (Prettier)
- Production build
- Unit tests with coverage
- Screenshot tests across all viewports

## Deployment Process

### Automatic Deployment

1. **Push to main**: Triggers Vercel deployment
2. **Build Process**: Vercel runs `npm run build`
3. **Deploy**: Static files deployed to global CDN
4. **Notification**: GitHub Actions provides status updates

### Manual Deployment Check

```bash
# Verify everything is ready for deployment
npm run deploy:check

# Check current deployment status
npm run deploy:status

# Test production build locally
npm run deploy:preview
```

## Custom Domain Configuration

### Vercel Dashboard Setup

1. **Add Domain**: Configure custom domain in Vercel dashboard
2. **DNS Configuration**: Point domain to Vercel nameservers
3. **SSL Certificate**: Automatic Let's Encrypt certificate
4. **Domain Verification**: Verify domain ownership

### DNS Configuration

```
# Example DNS settings (replace with actual domain)
CNAME www.voder.ai -> cname.vercel-dns.com
A     voder.ai     -> 76.76.19.61 (Vercel IP)
```

## Monitoring and Status

### Deployment Status

```bash
# Check deployment status
npm run deploy:status
```

Provides information about:

- Git branch and commit
- Build status and date
- Deployment configuration
- Readiness for production

### Performance Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **GitHub Actions**: Build and test status
- **Screenshot Tests**: Visual regression detection
- **Lighthouse**: Performance, accessibility, SEO metrics

## Security

### Security Headers

Configured in `vercel.json`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### SSL/TLS

- **Automatic SSL**: Vercel provides Let's Encrypt certificates
- **HTTPS Redirect**: Automatic redirect from HTTP to HTTPS
- **HSTS**: HTTP Strict Transport Security enabled

## Troubleshooting

### Build Failures

```bash
# Check build locally
npm run build

# Full verification pipeline
npm run verify

# Check for issues
npm run deploy:check
```

### Common Issues

1. **Build Errors**: Check TypeScript compilation and linting
2. **Test Failures**: Ensure all tests pass locally
3. **Screenshot Mismatches**: Update screenshots if intentional changes
4. **Performance Issues**: Check bundle size and asset optimization

### Rollback

Vercel provides automatic rollback capabilities:

1. **Vercel Dashboard**: Select previous deployment
2. **Git Revert**: Revert problematic commit
3. **Emergency**: Use Vercel CLI for immediate rollback

## Development Workflow

### Pre-deployment Checklist

- [ ] All tests passing (`npm run test:ci`)
- [ ] Screenshots updated (`npm run screenshots`)
- [ ] Build successful (`npm run build`)
- [ ] No linting errors (`npm run lint:check`)
- [ ] Security audit clean (`npm audit`)
- [ ] Ready for deployment (`npm run deploy:check`)

### Branch Protection

Recommended GitHub branch protection rules:

- Require pull request reviews
- Require status checks (GitHub Actions)
- Require up-to-date branches
- Include administrators in restrictions

## Performance Targets

### Loading Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

Validated by screenshot tests measuring page load times (currently 507-530ms).

### Asset Optimization

- **Gzip Compression**: Automatic via Vercel
- **Asset Caching**: 1 year cache for immutable assets
- **Bundle Size**: Monitored via build output
- **Image Optimization**: Vercel automatic image optimization
