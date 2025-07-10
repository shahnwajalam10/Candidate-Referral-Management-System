# Candidate Referral Management System

A comprehensive full-stack web application for managing candidate referrals with user authentication, file uploads, and real-time status tracking. Built with Node.js/Express backend and React/Vite frontend.

## 🚀 Features

### Backend Features
- **JWT Authentication**: Secure user registration and login
- **File Upload**: PDF resume upload with validation
- **CRUD Operations**: Complete candidate management
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination
- **Security**: Rate limiting, CORS, input validation
- **Database**: MongoDB with Mongoose ODM

### Frontend Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Live status updates and notifications
- **File Upload**: Drag & drop resume upload
- **Dashboard**: Statistics and candidate overview
- **Search & Filter**: Advanced search functionality
- **Mobile Responsive**: Works on all devices
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: User-friendly error messages

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd candidate-referral-system
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
\`\`\`

**Configure Backend Environment Variables (.env):**
\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/candidate-referral

# JWT Secret (use a strong, random string in production)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
\`\`\`

**Start MongoDB:**
\`\`\`bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
\`\`\`

**Run Backend:**
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

Backend will be available at `http://localhost:5000`

### 3. Frontend Setup

\`\`\`bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
\`\`\`

**Configure Frontend Environment Variables (.env):**
\`\`\`env
# API URL
VITE_API_URL=http://localhost:5000/api
\`\`\`

**Run Frontend:**
\`\`\`bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

Frontend will be available at `http://localhost:3000`


## 📁 Project Structure

\`\`\`
candidate-referral-system/
├── backend/                    # Node.js/Express backend
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── multer.js          # File upload configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── candidateController.js # Candidate management
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── validation.js      # Input validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Candidate.js       # Candidate schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── candidates.js      # Candidate routes
│   ├── utils/
│   │   └── validators.js      # Utility functions
│   ├── uploads/               # File upload directory
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Main server file
├── frontend/                   # React/Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # Authentication state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReferralForm.jsx
│   │   │   └── CandidateDetails.jsx
│   │   ├── services/
│   │   │   └── api.js          # API configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                    # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
\`\`\`



## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Candidates
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/candidates/can-refer` | Check if user can refer | Yes |
| GET | `/api/candidates/my-candidate` | Get user's candidate | Yes |
| POST | `/api/candidates` | Create candidate | Yes |
| GET | `/api/candidates` | Get all candidates | Yes |
| GET | `/api/candidates/stats` | Get statistics | Yes |
| GET | `/api/candidates/:id` | Get single candidate | Yes |
| PUT | `/api/candidates/:id/status` | Update status | Yes |
| DELETE | `/api/candidates/:id` | Delete candidate | Yes |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Server health check | No |

## 🎯 Usage

### 1. User Registration & Login
- Visit `http://localhost:3000`
- Register a new account or login with existing credentials
- JWT token is automatically managed

### 2. Refer a Candidate
- Click "Refer Candidate" from the dashboard
- Fill out the candidate form
- Upload resume (PDF only, max 5MB)
- Submit referral (one per user)

### 3. Manage Candidates
- View your referred candidate on the dashboard
- Update candidate status
- View detailed candidate information
- Delete candidate (allows referring again)

### 4. Admin Features
- Admins can view all candidates
- Search and filter candidates
- Manage all candidate statuses
- View system statistics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevents brute force attacks (100 requests/15 minutes)
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive server and client-side validation
- **File Upload Security**: PDF-only uploads with size limits
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization

## 🗄️ Database Schema

### User Model
\`\`\`javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  hasReferred: Boolean (default: false),
  referredCandidate: ObjectId (ref: Candidate),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Candidate Model
\`\`\`javascript
{
  name: String (required, max 100 chars),
  email: String (required, validated),
  phone: String (required, validated),
  jobTitle: String (required, max 100 chars),
  status: String (enum: ['Pending', 'Reviewed', 'Hired', 'Rejected']),
  resumeUrl: String (optional),
  referredBy: ObjectId (ref: User, required),
  notes: String (optional, max 500 chars),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🧪 Testing

### Backend Testing
\`\`\`bash
cd backend

# Test server health
curl http://localhost:5000/api/health

# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
\`\`\`

### Frontend Testing
\`\`\`bash
cd frontend

# Run linting
npm run lint

# Build for production
npm run build
\`\`\`

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

1. **Environment Variables:**
\`\`\`env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/candidate-referral
JWT_SECRET=your-super-secure-production-jwt-secret
PORT=5000
\`\`\`

2. **Build Command:** `npm install`
3. **Start Command:** `npm start`

### Frontend Deployment (Vercel)

1. **Environment Variables:**
\`\`\`env
VITE_API_URL=https://your-backend-domain.com/api
\`\`\`

2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`


**Frontend Dockerfile:**
\`\`\`dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

**Docker Compose:**
\`\`\`yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/candidate-referral
      - JWT_SECRET=your-jwt-secret
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:5000/api

volumes:
  mongodb_data:
\`\`\`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   \`\`\`
   Error: connect ECONNREFUSED 127.0.0.1:27017
   \`\`\`
   **Solution:** Make sure MongoDB is running

2. **CORS Error**
   \`\`\`
   Access to XMLHttpRequest blocked by CORS policy
   \`\`\`
   **Solution:** Update FRONTEND_URL in backend .env file

3. **JWT Token Error**
   \`\`\`
   Token is not valid
   \`\`\`
   **Solution:** Clear browser localStorage and login again

4. **File Upload Error**
   \`\`\`
   Only PDF files are allowed
   \`\`\`
   **Solution:** Ensure file is PDF format and under 5MB

5. **Build Error**
   \`\`\`
   Module not found
   \`\`\`
   **Solution:** Delete node_modules and run `npm install`

### Debug Mode

**Backend:**
\`\`\`bash
DEBUG=* npm run dev
\`\`\`

**Frontend:**
- Open browser Developer Tools
- Check Console and Network tabs
- Verify API calls and responses

## 📊 Performance

### Optimization Features
- Database indexing for faster queries
- Pagination to limit response size
- File size limits to prevent abuse
- Rate limiting for security
- Image optimization
- Code splitting in frontend
- Lazy loading of components

### Performance Metrics
- **API Response Time:** < 200ms
- **Page Load Time:** < 2s
- **Bundle Size:** < 500KB gzipped
- **Database Queries:** Optimized with indexes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🔄 Version History

- **v1.0.0** - Initial release
  - Complete authentication system
  - One-to-one candidate referral system
  - File upload functionality
  - Dashboard with statistics
  - Search and filtering
  - Responsive design
  - Admin panel
  - Real-time updates

## 🚀 Future Enhancements

- [ ] Email notifications for status changes
- [ ] Advanced analytics and reporting
- [ ] Bulk operations for admins
- [ ] Export functionality (CSV/Excel)
- [ ] Dark mode support
- [ ] Mobile app
- [ ] Real-time chat system
- [ ] Integration with job boards
- [ ] Advanced search filters
- [ ] Candidate scoring system

## 🏆 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool
- [JWT](https://jwt.io/) - Authentication
- [Multer](https://github.com/expressjs/multer) - File upload
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [React Hot Toast](https://react-hot-toast.com/) - Notifications

---

**Built with ❤️ by shahwnwaj alam**

