import React, { useState } from 'react'

export const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(`${process.env.REACT_APP_OPERATIONS_URL}`)
        const response = await fetch(`${process.env.REACT_APP_OPERATIONS_URL}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (response.ok) {
            setUser(result.user);
        } else {
            setError(result.message);
        }
    };
    return (
        <div>
            <div class="container text-center">
                <div class="col">
                    <form className='form-group' onSubmit={handleLogin}>
                        <div className='row align-items-center mt-5'>
                            <div class="col"></div>
                            <div class="col-5">
                                <input className='form-control' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                            </div>
                            <div class="col"></div>
                        </div>
                        <div className='row align-items-center mt-2'>
                            <div class="col"></div>
                            <div class="col-5">
                                <input className='form-control' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                            </div>
                            <div class="col"></div>
                        </div>
                        <div className='row mt-2'>
                            <div class="col"></div>
                            <div className='col-1'>
                                <button className='btn btn-dark mt-4' type="submit">Login</button>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </div>
                            <div class="col"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
