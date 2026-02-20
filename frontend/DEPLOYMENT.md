# Deployment Guide - EBASI STORE

This guide covers deployment options and configurations for the EBASI STORE e-commerce platform.

## 🚀 Quick Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ebasi-store)

### Manual Vercel Deployment

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

## 🔧 Environment Configuration

### Required Environment Variables

Create these environment variables in your deployment platform:

\`\`\`env
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="EBASI STORE"

# Authentication (if using external auth)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# Database (if using external database)
DATABASE_URL=your-database-connection-string

# Email Service (if using email notifications)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# Payment Gateway (if integrating payments)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
\`\`\`

### Vercel Environment Variables Setup

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add each variable with appropriate values

## 🏗 Build Configuration

### Next.js Configuration

The project includes optimized `next.config.mjs`:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  images: {
    domains: ['placeholder.svg', 'api.dicebear.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Additional optimizations
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
\`\`\`

### Build Scripts

\`\`\`json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
\`\`\`

## 🐳 Docker Deployment

### Dockerfile

\`\`\`dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    restart: unless-stopped
\`\`\`

## ☁️ Alternative Deployment Platforms

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **netlify.toml**
   \`\`\`toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   \`\`\`

### Railway

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`

## 🔍 Performance Monitoring

### Vercel Analytics

Already integrated in the project:

\`\`\`tsx
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### Additional Monitoring

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for user session recording
- **Hotjar** for user behavior analytics

## 🚦 Health Checks

### API Health Check

Create `app/api/health/route.ts`:

\`\`\`typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
}
\`\`\`

### Monitoring Endpoints

- `/api/health` - Basic health check
- `/api/metrics` - Application metrics (if implemented)

## 🔐 Security Considerations

### Production Security Checklist

- [ ] Environment variables properly set
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] Authentication secured
- [ ] Database connections encrypted
- [ ] API endpoints protected

### Security Headers

Add to `next.config.mjs`:

\`\`\`javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
\`\`\`

## 📊 Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   \`\`\`bash
   npm install --save-dev @next/bundle-analyzer
   \`\`\`

2. **Image Optimization**
   - Use Next.js Image component
   - Configure image domains
   - Enable WebP/AVIF formats

3. **Code Splitting**
   - Automatic with Next.js App Router
   - Dynamic imports for heavy components

### Runtime Optimization

- Enable compression
- Configure caching headers
- Use CDN for static assets
- Implement service worker (if needed)

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
\`\`\`

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Review import paths

2. **Runtime Errors**
   - Check browser console
   - Review server logs
   - Verify API endpoints

3. **Performance Issues**
   - Analyze bundle size
   - Check image optimization
   - Review database queries

### Debug Mode

Enable debug logging:

\`\`\`env
DEBUG=true
NODE_ENV=development
\`\`\`

## 📞 Support

For deployment issues:
1. Check the deployment logs
2. Review environment variables
3. Verify build configuration
4. Contact support team

---

**Happy Deploying!** 🚀
