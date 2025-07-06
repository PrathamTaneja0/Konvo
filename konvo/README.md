# NOTE
Before running any Docker commands, make sure to run:

```bash
cd konvo
```

This is required because the 'konvo-frontend' and 'konvo-backend' folders are placed inside another directory named 'konvo'.

-----------------------------------------------------------------------------------------

# Konvo - Modern Microblogging Platform

A full-stack social media platform built with Spring Boot backend, React frontend, and MariaDB database. Features comprehensive test coverage (80%+) and Docker containerization.

This Project was built with ❤️

## Extra Features
• **Un-liking posts** - Users can unlike posts they previously liked (beyond F-L1 requirement)
• **Repost/Retweet functionality** - Users can repost content from other users
• **News API integration** - Trending news feed from external API
• **Dark/Light mode toggle** - Responsive theme switching
• **Custom 404 page** - User-friendly error handling
• **Commenting on posts** - Users can reply to posts (ReplyModal functionality)
• **Deleting one's own posts** - Users can delete their own posts
• **Managing one's own user profile** - Update profile with multiple attributes (full name, bio, location, birth date)
• **Displaying the user profile of a different user** - View other users' profiles
• **Cloudinary integration** - Profile and cover image upload functionality

## 📁 Project Structure
```
konvo/
├── konvo-backend/                    # Spring Boot backend
│   ├── src/main/java/
│   │   ├── controller/               # REST controllers
│   │   ├── service/                  # Business logic
│   │   ├── repository/               # Data access
│   │   ├── model/                    # JPA entities
│   │   ├── dto/                      # Data transfer objects
│   │   ├── config/                   # JWT authentication
│   │   └── util/                     # Utility classes
│   └── src/test/                     # Tests (80% coverage)
├── konvo-frontend/                   # React frontend
│   ├── src/
│   │   ├── Components/               # React components
│   │   ├── Store/                    # Redux store
│   │   └── theme/                    # Theme provider
│   └── Dockerfile
├── docker-compose.yml                # Multi-container setup
└── README.md
```

## 🛠 Prerequisites
• Docker & Docker Compose
• Java 21 (for development)
• Node.js 20+ (for development)

## 📚 Technologies & Libraries

### Frontend
• **React 19** - UI framework
• **Redux Toolkit** - State management
• **React Router DOM** - Client-side routing
• **Material-UI (MUI)** - Component library
• **Tailwind CSS** - Utility-first CSS framework
• **Formik** - Form handling
• **Yup** - Form validation
• **Axios** - HTTP client
• **Date-fns** - Date manipulation
• **Vite** - Build tool and dev server

### Backend
• **Spring Boot 3.5** - Application framework
• **Spring Security** - Authentication & authorization
• **Spring Data JPA** - Data persistence
• **MariaDB** - Primary database
• **H2 Database** - In-memory database for testing
• **JWT (JSON Web Tokens)** - Stateless authentication
• **Maven** - Build tool
• **JUnit 5** - Unit testing
• **JaCoCo** - Code coverage
• **Lombok** - Boilerplate reduction
• **News API Java** - External news integration
• **OpenAPI/Swagger** - API documentation

### External Services
• **Cloudinary** - Image upload and management
• **News API** - Trending news feed

## 🚀 Quick Start with Docker
1. **Clone and Run**
```bash
cd konvo
docker-compose up -d
```

2. **Access the Application**
• Frontend: http://localhost
• Backend API: http://localhost:8080
• Swagger UI: http://localhost:8080/swagger-ui/index.html

3. **Stop Services**
```bash
docker-compose down
```

## 🧪 Testing
**Backend Tests**
```bash
cd konvo-backend
mvn test                    # Run all tests
mvn clean test jacoco:report # Generate coverage report
```

## 📚 API Endpoints

### Required Features (F-U1, F-U2, F-U3)
• `POST /auth/signup` - Register user with username and password
• `POST /auth/signin` - User login with credentials
• `GET /auth/check-username` - Check username availability
• `GET /auth/check-email` - Check email availability

### Required Features (F-P1, F-L1)
• `POST /api/posts/create` - Create post with text message and timestamp
• `POST /api/posts/{postId}/like` - Like post (cannot like own posts)

### Required Features (F-V1, F-V2, F-V3)
• `GET /api/posts/my-posts` - Get current user posts (reverse chronological, max 20)
• `GET /api/posts/user/{userId}/posts` - Get specific followed user's posts
• `GET /api/posts/timeline` - Get aggregated timeline of all followed users' posts

### Required Features (F-F1, F-F2, F-F3)
• `GET /api/users/search` - Search users by username with follow status
• `PUT /api/users/{userId}/follow` - Follow/unfollow user

### Extra Features
• `POST /api/posts/reply` - Reply to post (commenting)
• `DELETE /api/posts/{postId}/like` - Unlike post
• `DELETE /api/posts/{postId}` - Delete own posts
• `PUT /api/posts/{postId}/repost` - Repost content
• `DELETE /api/posts/{postId}/repost` - Undo repost
• `GET /api/posts/{postId}/likes` - Get post likes
• `GET /api/users/profile` - Get current user profile
• `PUT /api/users/update` - Update profile (managing own profile)
• `GET /api/users/{userId}` - Get user by ID (displaying different user profile)
• `GET /api/users/followers/{userId}` - Get user followers
• `GET /api/users/followings/{userId}` - Get user followings
• `GET /api/news` - Get trending news (News API integration)

## 🔧 Development

### Backend Development
```bash
cd konvo-backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd konvo-frontend
npm install
npm run dev
```

## 🐳 Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build

# Stop all services
docker-compose down
```

## 🔍 Troubleshooting
**Common Issues**
1. Port conflicts: Check `lsof -i :8080` and kill processes if needed
2. Database issues: Restart with `docker-compose restart db`
3. Frontend not loading: Check logs with `docker-compose logs frontend`

## 📝 Sources & Prompts

### Documentation & Resources Used
• **ChatGPT** - General coding assistance and debugging
• **Gemini** - Alternative AI assistance for complex problems
• **Material-UI Documentation** - Component usage and theming
• **Tailwind CSS Documentation** - Utility classes and responsive design
• **Spring Boot Documentation** - Framework setup and best practices
• **Spring Security Documentation** - Authentication and authorization
• **Formik Documentation** - Form handling patterns
• **Yup Documentation** - Validation schemas and error handling
• **Redux Toolkit Documentation** - State management patterns
• **News API Documentation** - External API integration
• **Cloudinary Documentation** - Image upload and transformation
• **JWT.io** - Token structure and validation
• **React Router Documentation** - Navigation and routing
• **Axios Documentation** - HTTP client configuration

### General Prompts Used
• "Why is this code not working?"
• "What's the error in this code?"
• "Why am I getting this error?"
• "How do I fix this authentication issue?"
• "What's wrong with my API call?"
• "How do I implement this feature?"
• "Why is my component not rendering?"
• "How do I debug this database issue?"
• "What's causing this validation error?"
• "How do I optimize this code?"
• "Why is my test failing?"
• "How do I handle this edge case?"
• "What's the best practice for this?"
• "How do I fix this CORS issue?" 