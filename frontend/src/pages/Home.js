import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowRightShort } from 'react-icons/bs';
import { useTransactionsContext } from '../hooks/useTransactionsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import TransactionDetails from '../components/TransactionDetails.js';
import TransactionForm from '../components/TransactionForm.js';
import TransactionChart from '../components/TransactionChart';

const Home = () => {
  const { transactions, dispatch } = useTransactionsContext();
  const { user } = useAuthContext();
  const [data, setData] = useState([0, 0, 0]);
  const [recentTransactions, setRecentTransactions] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: json });
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [dispatch, user]);

  useEffect(() => {
    let transactionData = [0, 0, 0];
    transactions &&
      transactions.forEach((transaction) => {
        if (transaction.type === 'expense') {
          transactionData[0] += transaction.amount;
        } else if (transaction.type === 'income') {
          transactionData[1] += transaction.amount;
        } else if (transaction.type === 'investment') {
          transactionData[2] += transaction.amount;
        }
      });

    console.log(transactions);
    let recentData =
      transactions &&
      transactions.slice(0, transactions.length > 6 ? 6 : transactions.length);

    setRecentTransactions(recentData);
    setData(transactionData);
  }, [transactions]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row m-5 lg:h-[88vh]">
        {transactions && <TransactionChart data={data} />}

        <TransactionForm />
      </div>

      {recentTransactions && recentTransactions.length > 0 ? (
        <div className="flex flex-col m-6">
          <div className="flex ">
            <h2 className="font-bold text-[30px] mt-3 ml-3">
              RECENT TRANSACTIONS
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 grid-cols-1 ml-auto mr-auto mt-3 mb-3 w-[85vw] lg:w-[95vw]">
            {recentTransactions.map((transaction) => (
              <TransactionDetails
                transaction={transaction}
                key={transaction._id}
              />
            ))}
          </div>
          <div className="flex mt-3 justify-center items-center">
            <button
              className="flex flex-row bg-black text-white justify-center items-center w-[300px] h-[70px] text-2xl rounded-xl"
              onClick={() => {
                navigate('/transactions');
              }}
            >
              <span>View All Transaction</span>
              <span className="ml-1 mt-[2px]">
                <BsArrowRightShort />
              </span>
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Home;
