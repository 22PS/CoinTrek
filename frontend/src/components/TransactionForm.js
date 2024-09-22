import { useState } from 'react';
import { useTransactionsContext } from '../hooks/useTransactionsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

const TransactionForm = () => {
  const { dispatch } = useTransactionsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in!');
      return;
    }
    const transaction = { title, amount, type, note };

    const response = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle('');
      setAmount('');
      setType('');
      setNote('');
      setError(null);
      setEmptyFields([]);
      console.log('new transaction added:', json);
      dispatch({ type: 'CREATE_TRANSACTION', payload: json });
    }
  };

  return (
    <div className="flex flex-col lg:w-[50%] p-10">
      <form
        className="h-[100%] flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="text-[26px] lg:text-[32px] font-semibold mb-4  ">
          <h3>Add a New Transaction</h3>
        </div>
        <div className="w-[75%] mt-1 mb-1">
          <label className="text-[20px] font-medium">
            Title<span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes('title') ? 'error' : ''}
          />
        </div>
        <div className="w-[75%] mt-1 mb-1">
          <label className="text-[20px] font-medium">
            Amount<span className="text-rose-600">*</span>
          </label>
          <input
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            className={emptyFields.includes('amount') ? 'error' : ''}
          />
        </div>
        <div className="w-[75%] mt-1 mb-1">
          <label className="text-[20px] font-medium">
            Type<span className="text-rose-600">*</span>
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="investment">Investment</option>
          </select>
        </div>
        <div className="w-[75%] mt-1 mb-1">
          <label className="text-[20px] font-medium">Note</label>
          <input
            type="text"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
        </div>

        <button>Add Transaction</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default TransactionForm;
