# DEPLOY — elijemejor.shop (Hostinger compartido) + Postgres (VPS)

## 1. VPS Postgres nativo (una vez, por SSH)
```sql
-- como postgres:
CREATE USER elijo WITH PASSWORD 'GENERA_UNO_LARGO';
CREATE DATABASE afiliados OWNER elijo;
-- en db/schema.sql ya está el resto:
```
```bash
psql "postgresql://elijo:...@localhost:5432/afiliados" -f db/schema.sql
# edita db/plantilla_rankings_es.csv con ASIN reales (amazon.es/gp/bestsellers, copiar a mano)
DATABASE_URL="postgresql://elijo:...@IP_VPS:5432/afiliados?sslmode=require" node db/import.mjs db/plantilla_rankings_es.csv
```
Hardening mínimo (Postgres nativo): en `postgresql.conf` `listen_addresses='localhost,IP_PRIVADA'`; en `pg_hba.conf` solo `hostssl afiliados elijo IP_HOSTINGER/32 scram-sha-256`; UFW `5432` solo desde IP Hostinger; `pg_dump afiliados` diario en cron VPS.

## 2. Hostinger hPanel → Websites → Node.js → Next.js
- Repo: sube `web/` (o conecta GitHub). Build: `npm install && npm run build`. Start: `npm start`.
- Node 20. Envs: `DATABASE_URL`, `PARTNER_TAG=tecnologiaspe-21`.
- Dominio `elijemejor.shop` → `/` . SSL on.

## 3. Sin Creators API (ahora)
`/api/sync` devuelve 503 a propósito. La web sirve Postgres tal cual + fecha `Actualizado:`. Genera tráfico/3 ventas y solicita keys en Associates Central → Creators API.

## 4. Cuando aprueben keys
Añade `AMZ_ACCESS_KEY/SECRET/CRON_SECRET` en hPanel, avísame y implemento la firma + SearchItems (72 req/día ES). Cron hPanel: `0 3 * * * curl -H "Authorization: Bearer $CRON_SECRET" https://elijemejor.shop/api/sync?country=es`.
