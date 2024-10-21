# This Repository

This is the completed take home challenge.

The `api` is a basic Express application and uses Prisma for data access with a SQLite database.

The `client` is a basic Vite + React application.

## Setup

1. Install dependencies
```
$> npm install
```
2. Provision local database
```
$> npx prisma generate --schema ./api/prisma/schema.prisma 
```

## Start the full stack application

```
$> npm start
```

### Backend

1. `POST http://localhost:8000/api/applications` route that starts a new insurance application and initializes it with the provided data.
2. `GET http://localhost:8000/api/applications/{id}` route that can retrieve the current insurance application.
3. `PUT http://localhost:8000/api/applications/{id}` route that will update the insurance application with provided data.
4. `POST http://localhost:8000/api/applications/{id}`route that validates the entire application and returns a price.

### Frontend

1. `http://localhost:5173/` route that starts a new insurance application.
2. `http://localhost:5173/{id}` route that loads a saved insurance application.
