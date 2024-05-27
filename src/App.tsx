import React, {useEffect, useState } from 'react';
import { Auth, UserDocs } from './pages';
import { isUserAuthorized, logout } from './api/auth/auth';
import './App.css';

function App() {
    const [authorized, setAuthorized] = useState(false);
    useEffect(() => {
        const isAuthorized = isUserAuthorized();
        setAuthorized(isAuthorized);
    }, []);
    const handleLogout = async () => {
        console.log('==handleLogout');
        await logout();
        window.location.reload();
    }
  return (
      <div className="App">
          {authorized && (
              <div className="authorized-wrapper">
                  <a onClick={handleLogout}>Выйти</a>
              </div>
          )}
          {authorized ? <UserDocs /> : <Auth />}
      </div>
  );
}

export default App;
