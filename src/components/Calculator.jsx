import React, { useState, useEffect } from 'react'

export const Calculator = ({ user, balance, updateBalance }) => {
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [random, setRandom] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [lstOperations, setLstOperations] = useState([])
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRecords = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_OPERATIONS_URL}/api/record?userId=${user.id}&page=${page}&size=${size}`);
            const data = await response.json();
            setRecords(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const fetchBalance = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_OPERATIONS_URL}/api/record/balance?userId=${user.id}`);
            const result = await response.json();
            updateBalance(result);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const fetchRandom = async () => {
        try {
            const response = await fetch(`https://www.random.org/integers/?num=1&min=1&max=1000000&col=1&base=10&format=plain&rnd=new`);
            const result = await response.json();
            setRandom(result);
        } catch (error) {
            console.error('Error fetching fetchRandom:', error);
        }
    };

    useEffect(() => {
        const fetchOperationsList = async () => {
            let operationsLst = await fetch(`${process.env.REACT_APP_OPERATIONS_URL}/api/operation`);
            const resultLst = await operationsLst.json();
            console.log("result", resultLst)
            if (operationsLst.ok) {
                setLstOperations(resultLst)
            }
        };
        fetchOperationsList();
        fetchRecords();
    }, [page, size]);

    useEffect(() => {
        if (records.length > 0) {
            sortRecords(sortBy, sortDir);
        }
    }, [sortBy, sortDir]);

    const handleCalculation = async (operation) => {
        try {
            setError('')
            if(!number1 && operation!=='randomString'){
                setError("Insert number 1")
                return
            }
            if(!number2 && (operation!=='sqrt' && operation!=='randomString')){
                setError("Insert number 2")
                return
            }
            console.log("lstOperations", lstOperations)
            let cost = lstOperations.filter(item => item.type===operation).map(item => item.cost)
            console.log("opr", cost)
            console.log("Balance", balance)
            if(cost>balance){
                setError("Credit not enougth")
                return
            }
            if(operation==='randomString'){
                fetchRandom()
            }
            if (operation === 'division' && number2 === '0') {
                setError('Division by zero is not allowed.');
                return;
            }
            if (operation === 'sqrt' && number1 < 0) {
                setError('Square root of a negative number is not allowed.');
                return;
            }
            let response = await fetch(`${process.env.REACT_APP_OPERATIONS_URL}/api/operation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operationType:operation, n1:(operation==='randomString'?random:number1), n2:number2, userId: user.id })
            });
            const resultData = await response.json();
            console.log("resultData", resultData)
            if (response.ok) {
                setResult(resultData.result);
                updateBalance(resultData.balance);
                fetchRecords();
            } else {
                setError(resultData.message?resultData.message:resultData.msg?resultData.msg:"Error");
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleDelete = async (recordId) => {
        try {
            await fetch(`${process.env.REACT_APP_OPERATIONS_URL}/api/record/${recordId}`, {
                method: 'DELETE',
            });
            fetchRecords();
            fetchBalance();
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleSort = (column) => {
        const newSortDir = sortBy === column && sortDir === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDir(newSortDir);
    };

    const sortRecords = (column, direction) => {
        const sortedRecords = [...records].sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setRecords(sortedRecords);
    };

    const filterRecords = (records) => {
        return records.filter(record => {
            return (
                record.id.toString().includes(searchTerm) ||
                record.amount.toString().includes(searchTerm) ||
                record.userBalance.toString().includes(searchTerm)
            );
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <h2>Calculator</h2>
            <div className='row mt-3'>
                <div class="col-sm-3"></div>
                <div class="col-sm-3">
                    <input
                        type="number"
                        className='form-control'
                        value={number1}
                        onChange={(e) => setNumber1(e.target.value)}
                        placeholder="Number 1"
                    />
                </div>
                <div class="col-sm-3">
                    <input
                        type="number"
                        className='form-control '
                        value={number2}
                        onChange={(e) => setNumber2(e.target.value)}
                        placeholder="Number 2"
                    />
                </div>
                <div class="col-sm-3"></div>
            </div>
            <div></div>
            <div className='col mt-3'>
                <button class="btn btn-outline-secondary" onClick={() => handleCalculation('addition')}>Add</button>
                <button class="btn btn-outline-secondary" onClick={() => handleCalculation('subtraction')}>Subtract</button>
                <button class="btn btn-outline-secondary" onClick={() => handleCalculation('multiplication')}>Multiply</button>
                <button class="btn btn-outline-secondary" onClick={() => handleCalculation('division')}>Divide</button>
                <button class="btn btn-outline-secondary" onClick={() => handleCalculation('sqrt')}>Square Root</button>
                <button class="btn btn-outline-secondary" onClick={() => handleCalculation('randomString')}>Random String</button>
            </div>
            {result !== null && <div><label class="col-form-label">Result: {result}</label></div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <h2>Records</h2>
            <div className='row mt-3 justify-content-md-right'>
                <div class="col-md-4 col-md-offset-2">
                    <div class="d-flex">
                        <input
                            type="text"
                            className='form-control'
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search records..."
                        />
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div class="col">
                    <table class="table table-hover table-striped-columns">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')} scope="col">ID</th>
                                <th onClick={() => handleSort('amount')} scope="col">Amount Spent</th>
                                <th onClick={() => handleSort('userBalance')} scope="col">Current Balance</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterRecords(records).map(record => (
                                <tr key={record.id}>
                                    <th scope="row">{record.id}</th>
                                    <td>{record.amount}</td>
                                    <td>{record.userBalance}</td>
                                    <td>
                                        <button class="btn btn-danger" onClick={() => handleDelete(record.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <button class="btn btn-outline-secondary" onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
                            Previous
                        </button>
                        <span>{page + 1} / {totalPages}</span>
                        <button class="btn btn-outline-secondary" onClick={() => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev))} disabled={page + 1 >= totalPages}>
                            Next
                        </button>
                    </div>
                    <div>
                        <label>
                            Page Size:
                            <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
                                <option value={2}>2</option>
                                <option value={4}>4</option>
                                <option value={6}>6</option>
                                <option selected value={10}>10</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
