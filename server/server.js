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

  // Check if the employee object is present and has all required fields
  if (!employee || !employee.name || !employee.surname || !employee.email || !employee.idNumber) {
    return res.status(400).json({ message: 'Employee data is missing or invalid' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(employee.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate ID number format 
  if (!/^\d{13}$/.test(employee.idNumber)) {
    return res.status(400).json({ message: 'Invalid ID number format' });
  }

  // Validate phone number format
  const phoneRegex = /^(\+27\d{9}|0\d{9})$/;
  if (!phoneRegex.test(employee.phone)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  try {
    // Sanitize the employee data
    const sanitizedEmployee = {
      name: employee.name.trim(),
      surname: employee.surname.trim(),
      email: employee.email.trim().toLowerCase(),
      idNumber: employee.idNumber.trim(),
      position: employee.position.trim(),
      phone: employee.phone.trim(),
      profilePicture: employee.profilePicture || ''
    };

    // Save the sanitized employee data
    const docRef = await db.collection('employees').add(sanitizedEmployee);
    res.status(201).json({ 
      id: docRef.id, 
      employee: sanitizedEmployee, 
      message: 'Employee added successfully' 
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Failed to add employee' });
  }
});

// CHECK EXISTANCE
app.post('/check-employee', async (req, res) => {
  const { email, idNumber, phone } = req.body;

  try {
    const idNumberQuery = await db.collection('employees').where('idNumber', '==', idNumber).get();
    if (!idNumberQuery.empty) {
      return res.json({ exists: true, message: 'An employee with this ID number is already registered' });
    }

    const phoneQuery = await db.collection('employees').where('phone', '==', phone).get();
    if (!phoneQuery.empty) {
      return res.json({ exists: true, message: 'An employee with this phone number is already registered' });
    }

    const emailQuery = await db.collection('employees').where('email', '==', email.toLowerCase()).get();
    if (!emailQuery.empty) {
      return res.json({ exists: true, message: 'An employee with this email is already registered' });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking employee:', error);
    res.status(500).json({ message: 'Failed to check employee' });
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

// Delete employee by ID and move to "deleted_employees" collection
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employeeDoc = db.collection('employees').doc(id); // Reference the employee document
    const docSnapshot = await employeeDoc.get(); // Fetch the document to check if it exists

    if (docSnapshot.exists) {
      const employeeData = docSnapshot.data(); // Get the employee's data
      
      // Delete the employee from the employees collection
      await employeeDoc.delete();

      // Add the deleted employee's data to the "deleted_employees" collection
      await db.collection('deleted_employees').doc(id).set({
        ...employeeData,  // Copy the employee's data
        deletedAt: new Date(),  // Add a timestamp for when the employee was deleted
      });

      res.status(200).json({ message: 'Employee deleted and moved to deleted_employees collection' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

// Get all deleted employees
app.get('/deleted_employees', async (req, res) => {
  try {
    const deletedEmployeesSnapshot = await db.collection('deleted_employees').get(); // Fetch all deleted employees
    const deletedEmployees = deletedEmployeesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(deletedEmployees);
  } catch (error) {
    console.error('Error fetching deleted employees:', error);
    res.status(500).json({ message: 'Failed to fetch deleted employees' });
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
