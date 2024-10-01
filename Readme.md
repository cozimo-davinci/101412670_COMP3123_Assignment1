

---

# 🚀 Node.js API with JWT Authentication & Swagger Documentation

Welcome to the **Node.js API** project! This project features user authentication with **JWT tokens**, employee management, and comprehensive **Swagger** API documentation.

## 📚 Features

- **JWT Authentication**: Secure your routes using JSON Web Tokens.
- **User Sign-up & Login**: Create and authenticate users.
- **Employee Management**: CRUD operations for employee data.
- **Swagger Documentation**: Complete API documentation with Swagger UI.
- **MongoDB Integration**: Store user and employee data using MongoDB.
  
## 🛠️ Tech Stack

- **Node.js** & **Express**: Backend framework and routing.
- **MongoDB** & **Mongoose**: Database and ORM.
- **JWT**: Authentication with JSON Web Tokens.
- **Swagger**: API documentation.
- **bcrypt**: Password hashing.

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/node-api-auth.git
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following content:
```env
JWT_SECRET=yourSecretKey
JWT_REFRESH_SECRET=yourRefreshSecretKey
MONGO_URI=yourMongoDBConnectionString
```

### 4. Run the application
```bash
npm start
```

Your server will be running at `http://localhost:3002` 🎉.

### 5. View the API Documentation
Visit the Swagger UI at:
```
http://localhost:3002/api-docs
```

## 🛠️ API Endpoints

### 👤 **User Routes**

- **POST** `/api/v1/user/signup`: Create a new user.
- **POST** `/api/v1/user/login`: Authenticate user and get access & refresh tokens.
- **POST** `/api/v1/user/refresh-token`: Refresh your access token.

### 👥 **Employee Routes**

- **GET** `/api/v1/emp/employees`: Get all employees.
- **POST** `/api/v1/emp/employees`: Create a new employee.
- **GET** `/api/v1/emp/employees/:eid`: Get employee details by ID.
- **PUT** `/api/v1/emp/employees/:eid`: Update employee details.
- **DELETE** `/api/v1/emp/employees/:eid`: Delete employee by ID.

## 🔑 Authentication Flow

1. **Sign up**: Create a new user.
2. **Login**: Get `accessToken` and `refreshToken`.
3. **Access protected routes** using the `accessToken` in the Authorization header.
4. **Refresh your token** when it expires by sending the `refreshToken` to `/api/v1/user/refresh-token`.

## 🧪 Testing

You can test the endpoints directly using **Postman** or **Swagger UI** at `http://localhost:3002/api-docs`. For example:

- **Authorization**: Use the `accessToken` in the Authorization header as `Bearer <token>`.

---

## 📜 License

This project is licensed under the **MIT License**.

---

👨‍💻 **Happy Coding!** ✨
