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


function App() {
  const [currentView, setCurrentView] = useState('signIn');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
      try {
        const response = await axios.get(`http://localhost:5000/employees`);
        setEmployees(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Handle add employee
  const handleAddEmployee = async (employee) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/employees`, { employee });
      setEmployees([...employees, { ...employee, id: response.data.id }]);
      setNotification('Successfully added');
    } catch (error) {
      console.error('Error adding employee:', error);
      setNotification('Failed to add employee');
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setNotification('Successfully deleted');
    } catch (error) {
      console.error('Error deleting employee:', error);
      setNotification('Failed to delete employee');
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
        prevEmployees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
      setNotification('Successfully updated');
    } catch (error) {
      console.error('Error updating employee:', error);
      setNotification('Failed to update employee');
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // Handle login
  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setCurrentView('employees');
      setIsLoading(false);
    }, 2000);
  };

  // Handle sign-out
  const handleSignOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      setCurrentView('signIn');
      setIsLoading(false);
    }, 2000);
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
            onViewEmployee={setSelectedEmployee}
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
      {notification && <Notification message={notification} type="error" />}
    </div>
  );
}

export default App;
