# Digital Growth Platform - Backend API

A comprehensive backend API for a Digital Growth & Online Marketing Services Platform built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality
- **Lead Management System** - Capture, score, and manage leads with advanced filtering
- **User Authentication & Authorization** - JWT-based auth with role-based permissions
- **Email Automation** - Automated lead notifications and confirmations
- **Contact Form Handling** - Multiple form types with validation and rate limiting
- **Service Management** - CRUD operations for service offerings
- **Case Study Management** - Showcase client success stories
- **Analytics & Reporting** - Lead statistics and performance metrics

### Security Features
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers
- JWT token authentication
- Role-based access control

### Email Features
- Lead notification emails to business
- Confirmation emails to leads
- Consultation booking notifications
- Newsletter subscription handling
- Beautiful HTML email templates

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Gmail account for email service (or other SMTP provider)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd growth-partner-hub/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/digital-growth-platform
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Email (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   BUSINESS_EMAIL=dilshadimam21@gmail.com
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User (Admin Only)
```http
POST /api/auth/register
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sales",
  "department": "Sales"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Lead Management Endpoints

#### Create Lead (Public)
```http
POST /api/leads
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "ABC Corp",
  "message": "Interested in your services",
  "industry": "SaaS",
  "businessStage": "Growing SME",
  "servicesInterested": ["Web Development", "Lead Generation"],
  "budget": "$15K-$30K",
  "timeline": "1-3 months"
}
```

#### Get All Leads
```http
GET /api/leads?page=1&limit=20&status=New&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

#### Update Lead
```http
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Qualified",
  "priority": "High",
  "assignedTo": "user_id",
  "nextFollowUp": "2024-02-15T10:00:00Z"
}
```

#### Add Note to Lead
```http
POST /api/leads/:id/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Called client, very interested in our services"
}
```

### Contact Form Endpoints

#### Contact Form Submission
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Tech Startup",
  "message": "Need help with digital marketing",
  "servicesInterested": ["Online Advertising"],
  "budget": "$5K-$15K",
  "timeline": "ASAP"
}
```

#### Free Consultation Booking
```http
POST /api/contact/consultation
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Growing Business",
  "preferredDate": "2024-02-15",
  "preferredTime": "14:00",
  "timezone": "EST",
  "goals": "Increase online sales by 50%"
}
```

#### Newsletter Subscription
```http
POST /api/contact/newsletter
Content-Type: application/json

{
  "email": "subscriber@example.com",
  "name": "Newsletter Subscriber"
}
```

### Analytics Endpoints

#### Lead Statistics
```http
GET /api/leads/stats/overview?timeframe=30d
Authorization: Bearer <token>
```

## 🗄️ Database Models

### Lead Model
- Contact information (name, email, phone, company)
- Business details (industry, stage, revenue)
- Service interests and budget
- Lead scoring and status tracking
- Notes and communication history
- Conversion tracking
- UTM and analytics data

### User Model
- Authentication (email, password)
- Role-based permissions
- Profile information
- Activity tracking

### Service Model
- Service details and descriptions
- Pricing and packages
- Process and requirements
- Media and SEO data
- Analytics tracking

### Case Study Model
- Client information
- Project details and timeline
- Results and metrics
- Testimonials and media

## 🔐 Security Features

### Rate Limiting
- General API: 100 requests per 15 minutes
- Contact forms: 3 requests per 15 minutes
- Newsletter: 5 requests per hour

### Input Validation
- All inputs are validated and sanitized
- Email format validation
- Phone number validation
- XSS protection with HTML escaping

### Authentication & Authorization
- JWT tokens with configurable expiration
- Role-based access control (admin, manager, sales, marketing)
- Permission-based endpoint protection

## 📧 Email Templates

The system includes beautiful HTML email templates for:

1. **Lead Notifications** - Sent to business when new leads arrive
2. **Lead Confirmations** - Sent to leads confirming receipt
3. **Consultation Bookings** - For free consultation requests
4. **Newsletter Welcome** - Welcome new subscribers
5. **Lead Updates** - When existing leads submit new information

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-super-secure-production-secret
EMAIL_USER=your-production-email@domain.com
EMAIL_PASS=your-production-email-password
BUSINESS_EMAIL=dilshadimam21@gmail.com
FRONTEND_URL=https://your-domain.com
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start src/server.js --name "digital-growth-api"
pm2 startup
pm2 save
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

- Request logging with Morgan
- Error handling with detailed stack traces in development
- Health check endpoint at `/health`
- Database connection monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: dilshadimam21@gmail.com
- Create an issue in the repository

## 🔄 API Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors array (if applicable)
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 100,
      "limit": 20
    }
  }
}
```

This backend provides a solid foundation for your Digital Growth Platform with all the features outlined in your PRD!