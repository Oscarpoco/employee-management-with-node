# Employee Management System - Gamefusion

This project is an **Employee Management System** built using a **Node.js** backend with **Express.js** and a **React.js** frontend. The backend interacts with **Firebase Firestore** for employee data management, and the frontend allows users to interact with the system via a user-friendly interface.

## Features

- Add a new employee
- Check if an employee already exists (by email, ID number, or phone number)
- Get all employees
- Update employee details
- Delete an employee and move them to the `deleted_employees` collection
- Get all deleted employees
- User-friendly React frontend for managing employees

---

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime for building server-side applications
- **Express.js**: Web framework for Node.js
- **Firebase Admin SDK**: Interacts with Firebase Firestore for storing employee data
- **Firestore**: NoSQL cloud database to store employee data
- **dotenv**: Manages environment variables
- **CORS**: Middleware for cross-origin resource sharing

### Frontend

- **React.js**: JavaScript library for building the user interface
- **Axios**: HTTP client for making requests to the backend
- **Firebase**: For client-side Firebase integration
- **React Icons**: For icon usage in the UI

---

## Prerequisites

### General

- **Node.js** (v16+)
- **Firebase Admin SDK**: You’ll need a service account key from Firebase for backend operations.

### Backend Setup

1. Create a Firebase project and download the service account key JSON file.
2. Add the Firebase Admin SDK to the project.
3. Set up Firestore as your database.

### Frontend Setup

- **React.js**: Frontend framework for building the UI.
- **Firebase**: For client-side integration (auth, Firestore data retrieval).

---

## Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/oscarpoco/gamefusion-employee-management.git

2. Navigate to the backend directory:
   cd server

3. Install the required dependencies:
   npm install

4. Create a .env file in the root of the project and add the following:
   FIREBASE_SERVICE_ACCOUNT_PATH=./path-to-your-service-account-key.json
   FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   PORT=5000

5. Start the server
   npm start or node server

## Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/oscarpoco/gamefusion-employee-management.git (if you cloned once , don't reclone it again)

2. Navigate to the backend directory:
   cd client

3. Install the required dependencies:
   npm install

4. Start the app
   npm start

## License
This project is licensed under the MIT License.

Make sure to customize the repo links, Firebase credentials, and paths as needed. Let me know if you'd like any additional details included!


