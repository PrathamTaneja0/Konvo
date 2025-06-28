# Konvo Project

This is a full-stack application with a Spring Boot backend and React frontend.

## Requirements

- Java 21 (JDK) - **Required**
- Maven (or use the provided Maven wrapper)
- Docker and Docker Compose

## Quick Start (Single Command)

**To run the entire application with a single command:**

```bash
cd konvo
docker-compose up -d
```

This will start:
- MariaDB database container named `db` (port 3306)
- Spring Boot backend (port 8080) - **accessible at http://localhost:8080/**
- React frontend (port 80) - **accessible at http://localhost:80/**

**Access the application:**
- Frontend: http://localhost:80
- Backend API: http://localhost:8080
- Database: localhost:3306

## Manual Setup

### Backend (Spring Boot)

#### Building with Maven

The project can be built using Maven with the provided `pom.xml` file:

```bash
cd konvo-backend
./mvnw clean compile
./mvnw clean package -DskipTests
```

#### Running Locally

**Note**: The application is configured to connect to an external MariaDB container named `db`. For local development, you'll need to:

1. Start MariaDB container:
   ```bash
   docker run -d --name db -e MYSQL_ROOT_PASSWORD=asdf1234 -e MYSQL_DATABASE=konvo -p 3306:3306 mariadb:latest
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend (React)

#### Development Mode

```bash
cd konvo-frontend
npm install
npm run dev
```

#### Production Build

```bash
cd konvo-frontend
npm install
npm run build
```

## Docker Setup

### Backend Dockerfile

- Uses **Java 21** base image (required)
- Builds with Maven
- **Entrypoint configured** to connect to external MariaDB container named `db`
- Exposes port 8080
- **Accessible at http://localhost:8080/** from host

### Frontend Dockerfile

- Uses Node.js 18 for building
- Uses Nginx for serving
- Proxies API calls to backend
- Exposes port 80 (mapped to 80)
- **Accessible at http://localhost:80/** from host

### Docker Compose

The `docker-compose.yml` orchestrates all services:
- **db**: MariaDB database container (external)
- **konvo-backend**: Spring Boot application (connects to `db`)
- **konvo-frontend**: React application

## Database Configuration

The application is configured to connect to an **external MariaDB container named `db`**:
- **Host**: `db` (container name)
- **Port**: 3306
- **Database**: `konvo`
- **Username**: `root`
- **Password**: `asdf1234`

## Stopping Services

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```

## Development Notes

- **Java 21 is required** for the backend
- The application.properties is configured to connect to external MariaDB container `db`
- Frontend proxies API calls to backend through Nginx
- All containers are on the same Docker network for communication
- Backend is accessible at http://localhost:8080/ when container is running
- Frontend is accessible at http://localhost:80/ when container is running 