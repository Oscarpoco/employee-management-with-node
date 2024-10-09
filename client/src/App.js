import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SignIn from './components/signIn';
import Employees from './components/employees';
import Registration from './components/registration';
import Profile from './components/profile';
import NavBar from './components/navBar';
import Loader from './components/Loader';
import Notification from './components/notification';
import { storage, ref, uploadBytes, getDownloadURL } from './firebase/FirebaseConfig';

function App() {
  const [currentView, setCurrentView] = useState('signIn');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Check login status on component mount
  useEffect(() => {
    const loggedIn = window.localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setCurrentView(loggedIn ? 'employees' : 'signIn');
  }, []);

  // Load employees from server
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Load deleted employees from server
  useEffect(() => {
    const fetchDeletedEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/deleted_employees`);
        setDeletedEmployees(response.data);
      } catch (error) {
        console.error('Error fetching deleted employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeletedEmployees();
  }, []);


  // HANDLE ADD EMPLOYEE
  const handleAddEmployee = async (employee, file) => {
    setIsLoading(true);
  
    try {
      // Check if employee already exists
      const checkResponse = await axios.post('http://localhost:5000/check-employee', {
        email: employee.email,
        idNumber: employee.idNumber,
        phone: employee.phone
      });
  
      if (checkResponse.data.exists) {
        setNotification({ message: checkResponse.data.message, type: 'error' });
        return;
      }
  
      let imageUrl = '';
  
      // Upload the image to Firebase Storage if a file is provided
      if (file) {
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `employees/${uniqueFilename}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
  
      // Include the image URL in the employee object
      const newEmployee = { ...employee, profilePicture: imageUrl };
  
      // Send the employee data wrapped in an object with the 'employee' key
      const response = await axios.post('http://localhost:5000/employees', { employee: newEmployee });
  
      setEmployees([...employees, { ...newEmployee, id: response.data.id }]);
      setNotification({ message: 'Successfully added', type: 'success' });
    } catch (error) {
      console.error('Error adding employee:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      setNotification('Failed to add employee: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };


  // Handle delete employee
  const handleDeleteEmployee = async (id) => {

    setIsLoading(true);

    try {
      const employeeToDelete = employees.find(emp => emp.id === id);
      await axios.delete(`http://localhost:5000/employees/${id}`);
      setEmployees(employees.filter(employee => employee.id !== id));
      setDeletedEmployees([...deletedEmployees, employeeToDelete]);
      setNotification({ message: 'Successfully deleted', type: 'success' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      setNotification({ message: 'Failed to delete employee', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // Handle update employee
  const handleUpdateEmployee = async (updatedEmployee) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:5000/employees/${updatedEmployee.id}`, updatedEmployee);
      setEmployees((prevEmployees) =>
        prevEmployees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
      setNotification({ message: 'Successfully updated', type: 'success' });
    } catch (error) {
      console.error('Error updating employee:', error);
      setNotification({ message: 'Failed to update employee', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // Handle login
  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setCurrentView('employees');
      
      // Fetch employees after login
      try {
        const response = await axios.get(`http://localhost:5000/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
      
      setIsLoading(false);
    }, 2000);
  };

  // Handle sign-out
  const handleSignOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      setSelectedEmployee(null); // Clear selected employee
      setCurrentView('signIn');
      setIsLoading(false);
    }, 2000);
  };

  // Handle view employee profile
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);  // Set the selected employee
    setCurrentView('profile');      // Switch to the profile view
  };

  const renderContent = () => {
    switch (currentView) {
      case 'signIn':
        return <SignIn onLogin={handleLogin} />;
      case 'employees':
        return (
          <Employees
            employees={employees}
            onDeleteEmployee={handleDeleteEmployee}
            onViewEmployee={handleViewEmployee}
            deletedEmployees={deletedEmployees}
          />
        );

      case 'registration':
        return <Registration onAddEmployee={handleAddEmployee} setCurrentView={setCurrentView} />;

      case 'profile':
        return <Profile employee={selectedEmployee} onUpdateEmployee={handleUpdateEmployee} />;

      default:
        return <SignIn onLogin={handleLogin} />;
    }
  };

  const handleNavigate = (currentView) => {
    setIsLoading(true);
    setCurrentView(currentView);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="App">
      <main>
        <nav>
          <div className='name'>
            <div className='gamefusion'><p>GAME<span>FUXION</span></p></div>
          </div>
          {isLoggedIn && (
            <NavBar onNavigate={handleNavigate} onSignOut={handleSignOut} setIsLoading={setIsLoading} currentView={currentView}/>
          )}
        </nav>
        <div className='content'>
          {renderContent()}
        </div>
      </main>
      {isLoading && <Loader />}
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
}

export default App;
