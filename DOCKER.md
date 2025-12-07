# Docker Setup for korli

This guide explains how to run korli using Docker and Docker Compose. Caddy must be installed separately on the host for SSL/HTTPS.

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)
- Caddy installed on the host (for SSL/HTTPS)
- A domain name pointing to your VPS (for SSL)

## Quick Start

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Create and configure `.env` file:**
   ```bash
   # Database Configuration
   DATABASE_URL=mysql://root:password@localhost:3306/korli
   # Or if using Docker MySQL:
   # DATABASE_URL=mysql://korli:korli@database:3306/corelink
   
   MYSQL_ROOT_PASSWORD=rootpassword
   MYSQL_DATABASE=corelink
   MYSQL_USER=korli
   MYSQL_PASSWORD=korli
   
   # Better Auth Configuration
   BETTER_AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
   BETTER_AUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
   
   # Domain Configuration
   DOMAIN=yourdomain.com
   
   # Site URL (for SEO and metadata)
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```
   
   **Important:**
   - Generate `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`
   - Replace `yourdomain.com` with your actual domain
   - If using external MySQL, use `localhost` in `DATABASE_URL`
   - If using Docker MySQL, use `database` as hostname

3. **Install Caddy on the host:**
   ```bash
   # Ubuntu/Debian
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy
   
   # Or use the official installer
   # https://caddyserver.com/docs/install
   ```

4. **Configure Caddy:**
   ```bash
   # Copy the example Caddyfile
   sudo cp Caddyfile.example /etc/caddy/Caddyfile
   
   # Edit it with your domain
   sudo nano /etc/caddy/Caddyfile
   # Replace "korli.fr" with your domain
   ```

5. **Build and start the Docker services:**
   ```bash
   docker compose up -d --build
   ```

6. **Start Caddy:**
   ```bash
   sudo systemctl enable caddy
   sudo systemctl start caddy
   ```

7. **Verify everything is running:**
   ```bash
   # Check Docker containers
   docker compose ps
   
   # Check Caddy status
   sudo systemctl status caddy
   
   # Check Caddy logs
   sudo journalctl -u caddy -f
   ```

## Services

### Frontend (Next.js)
- **Container:** `korli-frontend`
- **Port:** `3000` (exposed on localhost only, accessed by Caddy)
- **Health Check:** `/api/health`

### Database (MySQL)
- **Container:** `korli-database`
- **Port:** `3306` (exposed on host)
- **Default Database:** `corelink`
- **Default User:** `korli`

### Caddy (on host)
- **Ports:** `80` (HTTP), `443` (HTTPS)
- **Config:** `/etc/caddy/Caddyfile`
- **Auto SSL:** Let's Encrypt (automatic)

## Configuration

### Using External MySQL

If you have MySQL already installed on your VPS:

1. **Comment out the database service** in `docker-compose.yml`:
   ```yaml
   # database:
   #   image: mysql:8.0
   #   ...
   ```

2. **Update `.env`** to use `localhost`:
   ```bash
   DATABASE_URL=mysql://root:password@localhost:3306/korli
   ```

3. **Remove database dependency** from frontend:
   ```yaml
   # depends_on:
   #   - database
   ```

4. **Ensure MySQL accepts connections:**
   ```bash
   # Check MySQL is running
   sudo systemctl status mysql
   
   # Create database and user
   mysql -u root -p
   CREATE DATABASE korli;
   CREATE USER 'korli'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON korli.* TO 'korli'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Caddy Configuration

The `Caddyfile.example` shows a basic configuration. Caddy will automatically:
- Obtain SSL certificate from Let's Encrypt
- Handle ACME challenges
- Redirect HTTP to HTTPS
- Renew certificates automatically

**Important:** Make sure:
- Your domain DNS points to your VPS IP
- Ports 80 and 443 are open in your firewall
- No other web server (nginx, apache) is using ports 80/443

## Troubleshooting

### Caddy can't obtain SSL certificate

1. **Check DNS:**
   ```bash
   dig yourdomain.com +short
   # Should return your VPS IP
   ```

2. **Check ports are open:**
   ```bash
   sudo ufw status
   # Ports 80 and 443 should be allowed
   ```

3. **Check no other service uses ports 80/443:**
   ```bash
   sudo ss -tlnp | grep -E ':(80|443)'
   # Should only show Caddy
   ```

4. **Check Caddy logs:**
   ```bash
   sudo journalctl -u caddy -f
   ```

### Frontend not accessible

1. **Check frontend is running:**
   ```bash
   docker compose ps
   docker compose logs frontend
   ```

2. **Test localhost connection:**
   ```bash
   curl http://localhost:3000/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

3. **Check Caddy can reach frontend:**
   ```bash
   # From the host, test:
   curl http://localhost:3000
   ```

### Database connection issues

1. **Check database is running:**
   ```bash
   docker compose ps database
   docker compose logs database
   ```

2. **Test connection:**
   ```bash
   # If using Docker MySQL:
   docker compose exec database mysql -u korli -p corelink
   
   # If using external MySQL:
   mysql -u korli -p -h localhost korli
   ```

3. **Check DATABASE_URL in .env:**
   - Format: `mysql://user:password@host:port/database`
   - Use `localhost` for external MySQL
   - Use `database` for Docker MySQL

## Maintenance

### Update the application

```bash
git pull
docker compose build
docker compose up -d
```

### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f database
```

### Backup database

```bash
# Docker MySQL
docker compose exec database mysqldump -u korli -p corelink > backup.sql

# External MySQL
mysqldump -u korli -p -h localhost korli > backup.sql
```

### Restart services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart frontend
```

## Production Checklist

- [ ] Domain DNS points to VPS IP
- [ ] Ports 80 and 443 are open
- [ ] Caddy is installed and configured
- [ ] SSL certificate is obtained (check with `curl -I https://yourdomain.com`)
- [ ] Database is configured and accessible
- [ ] Environment variables are set correctly
- [ ] Firewall is configured
- [ ] Regular backups are set up
- [ ] Monitoring is configured (optional)
