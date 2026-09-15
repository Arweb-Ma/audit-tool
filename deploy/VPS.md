# VPS deployment

This deployment runs the public Next.js application, PostgreSQL, and Caddy on one VPS. Caddy obtains and renews TLS certificates automatically once the DNS A/AAAA record for `AUDIT_DOMAIN` points to the server.

## First deployment

1. Install Docker Engine and Docker Compose Plugin on the VPS.
2. Clone the `enhancement_dev` branch, then enter the project directory.
3. Copy `.env.example` to `.env` and set every placeholder, especially `AUDIT_DOMAIN` and `POSTGRES_PASSWORD`.
4. Point the audit subdomain at the VPS and allow inbound ports 80 and 443.
5. Start the stack:

   ```sh
   docker compose -f docker-compose.vps.yml up -d --build
   ```

6. Check the application and database:

   ```sh
   docker compose -f docker-compose.vps.yml ps
   docker compose -f docker-compose.vps.yml logs -f app
   ```

The database schema initializes only when the PostgreSQL data volume is first created. For existing installations, apply `lib/db/schema.sql` with `psql` before deploying this version.

## Backups

Run a daily backup from the VPS and copy it off-server:

```sh
docker compose -f docker-compose.vps.yml exec -T db pg_dump -U arweb arweb_audit > arweb_audit.sql
```

The next architecture phase can add a separate worker for multi-page crawls and headless browser rendering. Keep that worker on the same private Docker network and limit its concurrency so it cannot exhaust the VPS.
