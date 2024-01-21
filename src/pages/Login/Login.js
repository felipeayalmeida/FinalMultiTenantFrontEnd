// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import EasterEgg from '../Eastenant/EasterEgg';

const Login = () => {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [creatingTenant, setCreatingTenant] = useState(false);

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // var urlLocal = "http://localhost:5108/api";
  // var urlDocker = "http://localhost:8088/api";
  var urlDocker = "http://localhost:8088/api";

  const storeToken = (token) => {
    localStorage.clear();
    localStorage.setItem('authToken', token);
  };
  const handleCloseModalTenant = () => {
    setCreatingTenant(null);
    setEasterEggOpen(false);
  };
  const handleLogin = (value) => {

    const postData = {
      tenant: tenant,
      email: email,
      password: password,
    };

    axios.post(`${urlDocker}/Auth/login`, postData, axiosConfig)
      .then(response => {
        console.log('Login successful:', response.data);
        if (response.data.token) {
          storeToken(response.data.token)
          navigate('/lists');
        }
      })
      .catch(error => {
        setError(error.message)
        console.error('Login failed:', error);
      });

  };

  function handleCreateTenant(creatingTenant) {
    console.log("creatingTenant", creatingTenant)
    // const postData = {
    //   tenant: tenant,
    //   email: email,
    //   password: password,
    // };

    axios.post(`${urlDocker}/admin`, creatingTenant, axiosConfig)
      .then(response => {
        if (response.data) {
          setEasterEggOpen(false)
          window.alert('Tenant Criado')
        }
      })
      .catch(error => {
      });
  }
  return (
    <>
      <h1>Calendar Scheduler</h1>
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <label >
            Tenant:
            <input type="text" value={tenant} style={{marginLeft:'27px'}} onChange={(e) => setTenant(e.target.value)} />
          </label>
          <br />
          <label>
            Email:
            <input type="text" value={email} style={{marginLeft:'35px'}} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button type="button" onClick={() => handleLogin()}>
            Login
          </button>
          {error.length > 1 ? <p style={{color:'red'}}>{error}</p> : ''}
        </form>
      </div>

      <EasterEgg setEasterEggOpen={setEasterEggOpen}></EasterEgg>

      {easterEggOpen && (
        <div className="modal">
          <h2>Create Tenant</h2>
          <label>Tenant Id:</label>
          <input
            type="text"
            onChange={(e) => setCreatingTenant({ ...creatingTenant, id: e.target.value })}
          />
          <label>Name:</label>
          <input
            type="text"
            onChange={(e) => setCreatingTenant({ ...creatingTenant, name: e.target.value })}
          />
          <label>Email:</label>
          <input
            type="text"
            onChange={(e) => setCreatingTenant({ ...creatingTenant, email: e.target.value })}
          />
          <label>Password:</label>
          <input
            type="text"
            onChange={(e) => setCreatingTenant({ ...creatingTenant, paswword: e.target.value })}
          />
          {/* <div className='showedUp'>
            <label>DATE:</label>
            <input
              type="datetime-local"
              onChange={(e) => setCreatingTenant({ ...creatingTenant, schedule: e.target.value })}
            />
          </div> */}
          <div>

            <button onClick={() => handleCreateTenant(creatingTenant)}>Save Changes</button>
            <button onClick={handleCloseModalTenant}>Cancel</button>
          </div>

        </div>
      )}
    </>
  );
};

export default Login;
