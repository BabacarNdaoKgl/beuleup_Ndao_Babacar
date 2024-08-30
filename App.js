import React from 'react';
import UsersList from './UsersList';
import './App.css';
import RegistrationForm from './RegistrationForm'; // Assurez-vous que le fichier existe et est correctement nommé

function App() {
  return (
    <div className="App">
      <h1>Registration Form</h1>
      <RegistrationForm />
    </div>
  );
}

export default App;
