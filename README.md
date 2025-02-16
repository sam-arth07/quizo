# Quizo: Quiz Management System

Quizo is a Quiz Management System where teachers can log in, create, edit, delete, and view quizzes. The project is divided into two parts:

- **Backend:** Built with Express, TypeScript, and MySQL. Deployed as Netlify Functions.
- **Frontend:** Built with React and ShadCN UI components. Deployed on Vercel.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

## Features

- Teacher login with static credentials
- Quiz CRUD operations (Create, Read, Update, Delete)
- Responsive design using ShadCN UI components
- Backend deployed as serverless functions on Netlify
- MySQL database integration

## Tech Stack

- **Frontend:** React, TypeScript, ShadCN UI, Axios
- **Backend:** Node.js, Express, TypeScript, Netlify Functions
- **Database:** MySQL (managed service in production)

## Project Setup

### Backend Setup

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd quizo-backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the backend directory with the following variables:

   ```env
   PORT=3001
   MYSQL_HOST=localhost
   MYSQL_USER=your_mysql_username
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DB=quizo_db
   ```

   *Note:* For production, update these variables in your Netlify dashboard to point to your managed MySQL instance.

4. **Database Initialization:**

   The backend automatically creates the database (if it doesn’t exist) and initializes the required tables on startup using SQL statements in the initialization module.

5. **Run the Backend Locally:**

   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd quizo-frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the frontend directory with the following variables:

   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_WS_URL=ws://localhost:3000/ws  # if using WebSockets in development
   ```

4. **Run the Frontend Locally:**

   ```bash
   npm start
   ```

## API Documentation

### Base URL

For local development, the API is available at: `http://localhost:3001/api`  
For production, the base URL is set in your Netlify configuration and accessed via the redirect (e.g., `https://quizo-backend.netlify.app/api`).

### Endpoints

#### 1. **POST /api/login**

- **Description:** Authenticates a teacher using static credentials.
- **Request Body:**

  ```json
  {
    "username": "teacher",
    "password": "password123"
  }
  ```

- **Response:**
  - **Success (200):**

    ```json
    {
      "success": true,
      "teacherId": 1,
      "message": "Login successful"
    }
    ```

  - **Error (401):**

    ```json
    {
      "success": false,
      "message": "Invalid credentials"
    }
    ```

#### 2. **POST /api/quizzes**

- **Description:** Creates a new quiz.
- **Request Body:**

  ```json
  {
    "title": "Quiz Title",
    "description": "Quiz Description",
    "teacherId": 1
  }
  ```

- **Response:**
  - **Success (200):**

    ```json
    {
      "success": true,
      "message": "Quiz created successfully",
      "quizId": 123
    }
    ```

  - **Error (400/500):**

    ```json
    {
      "success": false,
      "message": "Missing fields"  // or "Database error"
    }
    ```

#### 3. **GET /api/quizzes**

- **Description:** Retrieves all quizzes for a given teacher.
- **Query Parameter:**
  - `teacherId`: Teacher's ID (e.g., `/api/quizzes?teacherId=1`)
- **Response:**
  - **Success (200):**

    ```json
    {
      "success": true,
      "quizzes": [
        {
          "id": 123,
          "title": "Quiz Title",
          "description": "Quiz Description",
          "teacher_id": 1,
          "created_at": "2025-02-15T12:34:56Z"
        }
      ]
    }
    ```

  - **Error (400/500):**

    ```json
    {
      "success": false,
      "message": "Missing teacherId query parameter"  // or "Database error"
    }
    ```

#### 4. **GET /api/quizzes/:id**

- **Description:** Retrieves details of a specific quiz.
- **URL Parameter:**
  - `id`: Quiz ID

- **Response:**
  - **Success (200):**

    ```json
    {
      "success": true,
      "quiz": {
        "id": 123,
        "title": "Quiz Title",
        "description": "Quiz Description",
        "teacher_id": 1,
        "created_at": "2025-02-15T12:34:56Z"
      }
    }
    ```

  - **Error (404/500):**

    ```json
    {
      "success": false,
      "message": "Quiz not found"  // or "Database error"
    }
    ```

## Deployment

### Frontend (Vercel)

- **Steps:**
  1. Import your frontend repository into Vercel.
  2. Deploy and verify your frontend.

### Backend (Netlify)

- **Steps:**
  1. Import your backend repository into Netlify.
  2. Deploy and verify your backend by checking the API endpoints.


