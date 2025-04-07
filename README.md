# Employee Management System - Gamefusion

This project is an **Employee Management System** built using a **Node.js** backend with **Express.js** and a **React.js** frontend. The backend interacts with **Firebase Firestore** for employee data management, and the frontend allows users to interact with the system via a user-friendly interface.

## Features

- Add a new employee
- Add a new admin
- Check if an employee/admin already exists (by email, ID number, or phone number)
- Get all employees/admins
- Update employee/admin details
- Delete an employee/admin and move them to the `deleted_employees/admins` collection
- Get all deleted employees/admins
- User-friendly React frontend for managing employees

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for building server-side applications
- **Express.js**: Web framework for Node.js
- **Firebase Admin SDK**: Interacts with Firebase Firestore for storing employee data
- **Firestore**: NoSQL cloud database to store employee data
- **CORS**: Middleware for cross-origin resource sharing

### Frontend
- **React.js**: JavaScript library for building the user interface
- **Axios**: HTTP client for making requests to the backend
- **Firebase**: For client-side Firebase integration
- **React Icons**: For icon usage in the UI

## Prerequisites

- **Node.js** (v16+)
- **Firebase Account**: You'll need a service account key from Firebase for backend operations

## Project Setup

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/oscarpoco/gamefusion-employee-management.git
   ```

2. Navigate to the server directory:
   ```bash
   cd gamefusion-employee-management/server
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```


4. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to the client directory from the project root:
   ```bash
   cd gamefusion-employee-management/client
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

4. Access the application at: http://localhost:3000


## Author

Oscar Poco - [GitHub Profile](https://github.com/oscarpoco)
