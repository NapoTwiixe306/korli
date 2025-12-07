# Docker Setup for korli

This guide explains how to run korli using Docker and Docker Compose with Caddy for automatic SSL.

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)
- A domain name pointing to your VPS (for SSL)

## Quick Start

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Create and configure `.env` file:**
   ```bash
   # Copy this template to .env and fill in your values
   
   # Database Configuration
   DATABASE_URL=mysql://korli:korli@database:3306/corelink
   MYSQL_ROOT_PASSWORD=rootpassword
   MYSQL_DATABASE=corelink
   MYSQL_USER=korli
   MYSQL_PASSWORD=korli
   
   # Better Auth Configuration
   BETTER_AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
   BETTER_AUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
   
   # Domain Configuration (for Caddy SSL)
   DOMAIN=yourdomain.com
   
   # Site URL (for SEO and metadata)
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```
   
   **Important:**
   - Generate `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`
   - Replace `yourdomain.com` with your actual domain
   - The `DATABASE_URL` uses `database` as hostname (Docker service name)

3. **Set your domain:**
   - Set `DOMAIN=yourdomain.com` in your `.env` file (Caddy will auto-configure)

4. **Build and start the services:**
   ```bash
   docker-compose up -d --build
   ```

5. **Run database migrations:**
   ```bash
   docker-compose exec frontend npx prisma migrate deploy
   ```

6. **Generate Prisma Client (if needed):**
   ```bash
   docker-compose exec frontend npx prisma generate
   ```

7. **Access the application:**
   - **Production (with domain):** https://yourdomain.com (SSL automatique via Caddy)
   - **Development:** http://localhost (si DOMAIN=localhost)
   - **Database:** Accessible only from within Docker network

## Services

### Caddy (Reverse Proxy & SSL)
- **Container:** `korli-caddy`
- **Ports:** 80 (HTTP), 443 (HTTPS)
- **Image:** `caddy:2-alpine`
- **Features:**
  - Automatic SSL certificates via Let's Encrypt
  - HTTP to HTTPS redirect
  - Reverse proxy to Next.js
  - Security headers
  - Gzip compression
- **Volumes:** `caddy-data` (certificats SSL), `caddy-config` (configuration)
- **Configuration:** Générée automatiquement dans docker-compose.yml (pas de fichier Caddyfile externe)

### Frontend
- **Container:** `korli-frontend`
- **Port:** 3000 (internal only, proxied by Caddy)
- **Image:** Built from `Dockerfile`

### Database
- **Container:** `korli-database`
- **Port:** 3306 (internal only)
- **Image:** `mysql:8.0`
- **Data:** Persisted in `mysql-data` volume

## Useful Commands

### View logs
```bash
docker-compose logs -f caddy
docker-compose logs -f frontend
docker-compose logs -f database
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes database data)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
docker-compose up -d --build frontend
```

### Access database
```bash
docker-compose exec database mysql -u korli -p corelink
```

### Run Prisma commands
```bash
docker-compose exec frontend npx prisma studio
docker-compose exec frontend npx prisma migrate dev
```

## Production Deployment

The Docker setup includes:

✅ **Caddy reverse proxy** with automatic SSL/TLS via Let's Encrypt
✅ **Security headers** configured
✅ **HTTP to HTTPS redirect**
✅ **Network isolation** (database not exposed publicly)

### Additional Production Considerations:

1. **Use environment-specific `.env` files**
2. **Set up monitoring** and logging (Caddy logs are in `caddy-logs` volume)
3. **Configure backups** for the database
4. **Use secrets management** (Docker secrets, AWS Secrets Manager, etc.)
5. **Set up firewall** on your VPS (only ports 80 and 443 should be open)
6. **Regular updates** of Docker images

### SSL Certificate

Caddy automatically obtains and renews SSL certificates from Let's Encrypt. Make sure:
- Your domain DNS points to your VPS IP
- Ports 80 and 443 are open in your firewall
- The `DOMAIN` environment variable is set correctly

## Troubleshooting

### Database connection errors
- Ensure the database container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs database`
- Verify `DATABASE_URL` in `.env` matches the service name `database`

### Build failures
- Clear Docker cache: `docker-compose build --no-cache`
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`

### Port conflicts
- Change ports in `docker-compose.yml` if 80 or 443 are already in use
- Frontend (3000) and database (3306) are internal only and shouldn't conflict

### SSL certificate issues
- Ensure your domain DNS points to your VPS
- Check Caddy logs: `docker-compose logs caddy`
- Verify ports 80 and 443 are open: `sudo ufw status`
- For staging, you can use `DOMAIN=localhost` (no SSL)

