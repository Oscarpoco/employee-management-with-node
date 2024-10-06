require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors'); 

// Initialize Firebase Admin SDK
var serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT;

// Add employee (equivalent to Firestore addDoc)
app.post('/employees', async (req, res) => {
  const { employee } = req.body;

  // Check if the employee object is present and has required fields
  if (!employee || !employee.name || !employee.surname || !employee.email || !employee.idNumber) {
    return res.status(400).json({ message: 'Employee data is missing or invalid' });
  }

  try {
    const docRef = await db.collection('employees').add(employee);
    res.status(200).json({ id: docRef.id, employee, message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Failed to add employee' });
  }
});

// Get all employees (equivalent to Firestore getDocs)
app.get('/employees', async (req, res) => {
  try {
    const employeesSnapshot = await db.collection('employees').get();
    const employees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

// Delete employee by ID (equivalent to Firestore deleteDoc)
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employeeDoc = db.collection('employees').doc(id); // Reference the document
    const docSnapshot = await employeeDoc.get(); // Fetch the document to check if it exists

    if (docSnapshot.exists) {
      await employeeDoc.delete();
      res.status(200).json({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).json({ message: 'Employee not found' }); 
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});



// Update employee by ID (equivalent to Firestore updateDoc)
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const updatedEmployee = req.body;

  // Validate that the updatedEmployee object is present and not empty
  if (!updatedEmployee || Object.keys(updatedEmployee).length === 0) {
    return res.status(400).json({ message: 'No data provided to update' });
  }

  try {
    await db.collection('employees').doc(id).update(updatedEmployee);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Failed to update employee' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
