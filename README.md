# LIMS System

## Setup

### Backend

- Python 3.11, Django, DRF with token authentication.
- SQLite database persisted in Docker volume.

### Frontend

- React app served by nginx.
- Login, sample management, CSV import/export.

## Running locally with Docker

```bash
docker-compose up --build
