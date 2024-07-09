import './App.css';
import React, { useState } from 'react';
import { Login } from './components/Login';
import { Balance } from './components/Balance';
import { Calculator } from './components/Calculator';

function App() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0); 

    const handleLogout = () => {
        setUser(null);
        setBalance(0);
    };

    const updateBalance = (newBalance) => {
      setBalance(newBalance);
    };

    return (
      <div className="App">
        {user ? 
          (
              <div className='p-3 mb-2 bg-secondary-subtle text-secondary-emphasisbg-primary-subtle text-primary-emphasis'>
                  <nav class='navbar navbar-inverse navbar-dark bg-dark'>
                  <ul class="nav navbar-nav"/>
                        <ul class="nav justify-content-end">
                          <li class="nav-item">
                            <a class="navbar-brand">User: {user.username}</a>
                          </li>
                          <li class="nav-item">
                            <Balance user={user} balance={balance} updateBalance={updateBalance}/>
                          </li>
                          <li class="nav-item">
                          <button className='btn btn-success btn-block' onClick={handleLogout}>Logout</button>
                          </li>
                        </ul>
                      </nav>
                  <div>
                    <Calculator user={user} balance={balance} updateBalance={updateBalance}/>
                  </div>
              </div>
          ) : (
              <div class="container p-3 mb-2 bg-secondary-subtle text-secondary-emphasisbg-primary-subtle text-primary-emphasis text-center">
                <div class="row align-items-center">
                  <div class="col">
                    <h1>Welcome</h1>
                    <Login setUser={setUser} />
                  </div>
                </div>
              </div>
          )
        }
      </div>
    );
}

export default App;
