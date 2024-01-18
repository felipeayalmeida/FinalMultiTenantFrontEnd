// src/App.js
import React from 'react';
import Login from '../src/pages/Login/Login'
import Lists from '../src/pages/Lists/Lists'
import AppRoutes from './routes/Route/AppRoutes';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppRoutes />
      </header>
    </div>
  );
}

export default App;
