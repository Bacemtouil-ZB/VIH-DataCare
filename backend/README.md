# Backend

The utils (utilities) folder is meant for reusable helper functions that don't belong to a specific layer (controller, service, model, etc.). These functions can be used across different parts of the backend to avoid code duplication and improve maintainability.

## Why migrations are

- To **create and modify tables in a controlled and versioned way**
- To keep the database schema **independent from application runtime**
- To ensure the schema can be **reproduced on any environment** (development, testing, production)
- To safely track database changes over time

### Why table creation is NOT done in models

Models are responsible only for:

- Executing SQL queries
- Reading and writing.

### Exemple of a migration

001_create_users.sql
 ├── 002_add_role_to_users.sql
 └── 003_add_indexes.sql .

### jwt Authentication middleware flow

POST /login → no token needed, user logs in → backend returns JWT in cookie.

POST /register → no token needed, creates user.

GET /profile → JWT middleware (protect) checks cookie or header:

Valid → route runs, req.user is available.

Invalid/missing → 401 error .
