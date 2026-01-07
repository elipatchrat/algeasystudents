# Algeasy - Algebra Learning App

An interactive web application with MongoDB backend designed to help Year 8-10 students master algebra through practice problems, progress tracking, and achievements.

## Features

- **User Authentication**: Secure signup/login with MongoDB storage
- **Algebra Practice**: Four types of algebra problems:
  - Linear Equations
  - Quadratic Equations  
  - Inequalities
  - Systems of Equations
- **Progress Tracking**: Real-time statistics stored in database
- **User Profiles**: Personalized dashboard with persistent data
- **Achievement System**: Unlock rewards as you master concepts
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with bcrypt password hashing
- **Development**: npm, nodemon, live-server

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/elipatchrat/algeasystudents.git
   cd algeasystudents
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/algeasy
   
   # JWT Secret (change this in production!)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Server Port
   PORT=3001
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   This starts the Express server on port 3001 with auto-restart.

2. **Start the frontend** (in a new terminal)
   ```bash
   npm run client
   ```
   This opens the frontend at http://localhost:8000

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/algeasy`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login existing user

### User Data
- `GET /api/user/profile` - Get user profile and stats
- `PUT /api/user/stats` - Update user statistics

## Project Structure

```
algeasystudents/
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── index.html            # Frontend HTML
├── styles.css            # Complete styling
├── script.js             # Frontend JavaScript
└── .github/workflows/    # GitHub Actions for deployment
```

## Development Scripts

- `npm run dev` - Start backend server with nodemon
- `npm start` - Start backend server in production mode
- `npm run client` - Start frontend development server
- `npm run build` - Build for production (placeholder)
- `npm run deploy` - Deploy instructions (placeholder)

## How It Works

### Authentication Flow
1. User signs up with email, password, name, and grade
2. Password is hashed with bcrypt before storing
3. JWT token is generated for session management
4. Token is stored in localStorage for persistent login

### Problem Generation
- Dynamic problem generation for each algebra topic
- Problems are appropriate for Year 8-10 difficulty level
- Immediate feedback with correct solutions shown

### Data Persistence
- All user data stored in MongoDB
- Statistics sync automatically after each problem
- Progress preserved across sessions

### Topics Covered

1. **Linear Equations**: Basic equations in the form ax + b = c
2. **Quadratic Equations**: Simple quadratics with integer solutions
3. **Inequalities**: Linear inequalities with various operators
4. **Systems of Equations**: Two-variable linear systems

## Deployment

### Frontend (GitHub Pages)
The frontend is automatically deployed to GitHub Pages via GitHub Actions:
- https://elipatchrat.github.io/algeasystudents/

### Backend (Production)
For production deployment:
1. Deploy to services like Heroku, Vercel, or DigitalOcean
2. Set production environment variables
3. Update frontend API_BASE URL to production backend
4. Configure MongoDB Atlas for production database

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation
- Environment variable protection

## Contributing

This is a student learning project. Feel free to:
- Add new problem types
- Improve the UI/UX
- Add more achievements
- Implement additional features
- Report bugs or issues

## License

This project is open source and available under the MIT License.
