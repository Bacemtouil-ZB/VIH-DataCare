# Docker - VIHDataCare

Ce setup Docker est concu pour etre simple, suffisant et robuste:
- `db`: PostgreSQL 17
- `backend`: API Node.js/Express
- `frontend`: build Vite puis service statique Nginx

## 1) Utilite de chaque fichier

- `docker-compose.yml`
  - orchestre les 3 conteneurs
  - definit les `healthcheck`
  - connecte les services sur le reseau compose
  - monte `docker-share/init.sql` au demarrage initial de Postgres
- `.env` (racine)
  - variables lues par `docker-compose.yml` (ports, DB, JWT, URL)
- `backend/Dockerfile`
  - image de prod backend
  - `npm ci` avec retry/timeouts pour contourner les erreurs reseau (`EIDLETIMEOUT`)
  - demarrage via `node server.js`
- `backend/.dockerignore`
  - evite d'envoyer fichiers inutiles au build (plus rapide, plus propre)
- `docker-share/init.sql`
  - cree le schema SQL complet base sur la sauvegarde PostgreSQL de reference
  - cree les comptes initiaux (admin/pharmacien/medecin)
  - injecte les donnees de base (ex: stock medicaments)
- `frontend/Dockerfile`
  - build multi-stage:
    - stage build: `node:20-bookworm-slim`
    - stage runtime: `nginx:1.27-alpine`
  - execute `npm run check:imports-case` avant `npm run build`
- `frontend/nginx.conf`
  - config SPA React (`try_files $uri /index.html`)
- `frontend/.dockerignore`
  - reduit le contexte de build frontend
- `frontend/scripts/check-import-case.mjs`
  - detecte les imports sensibles a la casse (important sous Linux/Docker)
- `frontend/package.json`
  - expose la commande `check:imports-case`

## 2) Prerequis

- Docker Desktop actif
- Ports disponibles:
  - `5173` frontend
  - `3000` backend
  - `5432` postgres

## 3) Demarrage standard

Depuis `D:\\final VIH`:

```bash
docker compose down -v
docker compose build --no-cache backend
docker compose build --no-cache frontend
docker compose up -d
docker compose ps
```

Acces:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/health`

## 4) Comptes de connexion

- `admin@vih.tn` / `password`
- `pharmacien@vih.tn` / `password`
- `medecin@vih.tn` / `password`

## 5) Expressions necessaires pour contourner les problemes

- Affichage detaille du build compose:
```bash
docker compose --progress=plain build --no-cache
```
Important: `--progress` est un flag global de `compose`, pas un flag de `build` seul.

- Si `npm EIDLETIMEOUT` pendant build backend:
```bash
docker compose build --no-cache backend
```
Le Dockerfile backend est deja prepare pour retenter automatiquement.

- Si erreur BuildKit snapshot (`parent snapshot ... does not exist`):
```bash
docker compose down -v
docker buildx prune -af
docker builder prune -af
docker system prune -af --volumes
wsl --shutdown
```
Puis redemarrer Docker Desktop et rebuilder service par service.

- Si vous modifiez `init.sql` mais la base existe deja:
```bash
docker compose down -v
docker compose up -d --build
```
Rappel: `init.sql` est execute uniquement sur une base vide.

## 6) Commandes utiles

- Logs:
```bash
docker compose logs -f
```

- Restart backend:
```bash
docker compose restart backend
```

- Build d'un seul service:
```bash
docker compose build --no-cache backend
docker compose build --no-cache frontend
```

- Arret:
```bash
docker compose down
```

## 7) Signaux importants

- Les erreurs de casse de fichiers (`UsersPageUI` vs `UsersPageUi`) cassent le build uniquement en environnement Linux/Docker. Le check automatique est la pour bloquer ce risque avant production.
- Les valeurs sensibles (`JWT_SECRET`, SMTP, mots de passe) doivent etre remplacees en environnement reel.
