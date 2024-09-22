import { useEffect } from 'react';
import { GoSearch } from 'react-icons/go';
import TransactionDetails from '../components/TransactionDetails';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useTransactionsContext } from '../hooks/useTransactionsContext.js';
const AllTransactions = () => {
  const { transactions, dispatch } = useTransactionsContext();
  const { user } = useAuthContext();

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

  return (
    <div>
      {transactions && transactions.length > 0 ? (
        <div className="flex flex-col lg:flex-row m-6">
          <div className="flex lg:w-[25vw] lg:mt-[22px]">
            <h2 className="font-semibold text-[20px] mt-3 ml-3">Filters</h2>
          </div>

          <div className="grid grid-cols-1 mt-3 mb-3 w-[75vw] lg:w-[50vw] ml-auto mr-auto">
            <div className="flex p-5 relative">
              <div className="flex w-[100%] h-10 bg-white rounded-lg rounded-l-xl">
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-[90%] pl-2 rounded-lg"
                />
                <GoSearch
                  style={{
                    fontSize: '25px',
                    fontWeight: '600',
                    width: '10%',
                    margin: 'auto',
                  }}
                />
              </div>
            </div>
            {transactions.map((transaction) => (
              <TransactionDetails
                transaction={transaction}
                key={transaction._id}
              />
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default AllTransactions;
