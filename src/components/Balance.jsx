import React, { useEffect, useState } from 'react'

export const Balance = ({ user, updateBalance }) => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            const response = await fetch(`${process.env.REACT_APP_OPERATIONS_URL}/api/record/balance?userId=${user.id}`);
            const result = await response.json();
            if (response.ok) {
                setBalance(result);
                updateBalance (result);
            }
        };
        fetchBalance();
    }, [user.id, updateBalance]);
    return (
        <a className="navbar-brand">Balance: {balance}</a>
    )
}