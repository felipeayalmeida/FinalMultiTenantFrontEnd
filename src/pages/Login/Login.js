// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed
    },
  };
  var urlLocal = "http://localhost:5108/api/Auth/login";
  var urlDocker = "http://localhost:8088/api/Auth/login";

  const storeToken = (token) => {
    localStorage.clear();
    localStorage.setItem('authToken', token);
  };

  const handleLogin = (value) => {
 
    const postData = {
      tenant: tenant,
      email: email,
      password: password,
    };

    axios.post(urlLocal, postData, axiosConfig)
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

  return (
    <>
      <h1>Calendar Scheduler</h1>
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <label>
            Tenant:
            <input type="text" value={tenant} onChange={(e) => setTenant(e.target.value)} />
          </label>
          <br />
          <label>
            '   'Email:
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
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
          {error.length>1 ?<p>{error}</p>:''}
        </form>
      </div>
    </>
  );
};

export default Login;
