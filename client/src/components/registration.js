import React, { useState } from 'react';
import './registration.css';

function Registration({ onAddEmployee, setCurrentView }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setId] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);

  // HANDLE SUBMITTING FORM
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newEmployee = { name, surname, email, idNumber, position, phone };
    console.log('Employee data from form:', newEmployee);  // Add this line
    onAddEmployee(newEmployee, image);
  
    // Clear the form after submission
    setName('');
    setSurname('');
    setEmail('');
    setId('');
    setPosition('');
    setPhone('');
    setImage(null);
    setCurrentView('employees');
  };
  

  return (
    <div className='registration-box'>
      <div className='form-title'>REGISTER EMPLOYEE</div>
      <form onSubmit={handleSubmit}>
        <input type="text" id='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" id='surname' placeholder='Surname' value={surname} onChange={(e) => setSurname(e.target.value)} required />
        <input type="email" id='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" id='id' pattern="(\d{13})" maxLength="13" placeholder='ID number' value={idNumber} onChange={(e) => setId(e.target.value)} required />
        <input type="text" id='position' placeholder='Position' value={position} onChange={(e) => setPosition(e.target.value)} required />
        <input type="tel" pattern="(\+27\d{9}|0\d{9})" placeholder='Eg. +27 660 850 741 / 066 0850 741' maxLength="12" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="file" name='image' id='image' accept='image/*' onChange={(e) => setImage(e.target.files[0])} required />
        <button type='submit'>SUBMIT</button>
      </form>
    </div>
  );
}

export default Registration;
