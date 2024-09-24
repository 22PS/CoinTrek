import { useState, useEffect, useRef } from 'react';
import { GoSearch } from 'react-icons/go';
import TransactionDetails from '../components/TransactionDetails';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useTransactionsContext } from '../hooks/useTransactionsContext.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AllTransactions = () => {
  const { transactions, dispatch } = useTransactionsContext();
  const { user } = useAuthContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(10000);
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);

      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: json });

        const minAmt = Math.min(...json.map((t) => t.amount));
        const maxAmt = Math.max(...json.map((t) => t.amount));

        setMinAmount(minAmt);
        setMaxAmount(maxAmt);
        setAmountRange([minAmt, maxAmt]);
      }

      setIsLoading(false);
    };

    if (user) {
      fetchTransactions();
    }
  }, [dispatch, user]);

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  useEffect(() => {
    if (transactions) {
      const filtered = transactions
        .filter(
          (transaction) =>
            transaction.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.amount.toString().includes(searchTerm)
        )
        .filter(
          (transaction) =>
            selectedTypes.length === 0 ||
            selectedTypes.includes(transaction.type)
        )
        .filter(
          (transaction) =>
            transaction.amount >= amountRange[0] &&
            transaction.amount <= amountRange[1]
        )
        .filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          if (startDate && endDate) {
            return transactionDate >= startDate && transactionDate <= endDate;
          }
          return true;
        });

      setFilteredTransactions(filtered);
    }
  }, [
    searchTerm,
    transactions,
    selectedTypes,
    amountRange,
    startDate,
    endDate,
  ]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current === null) return;
    sliderRef.current.style.right = `${
      100 - ((amountRange[1] - minAmount) / (maxAmount - minAmount)) * 100
    }%`;
    sliderRef.current.style.left = `${
      ((amountRange[0] - minAmount) / (maxAmount - minAmount)) * 100
    }%`;
  }, [amountRange]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col lg:flex-row m-6">
          <div className="flex flex-col lg:w-[25vw] lg:mt-[22px] ml-9 mr-[-24px] lg:m-0 lg:ml-1">
            <div>
              <h2 className="font-semibold text-[20px] mt-3 mb-5 text-center lg:text-left">
                Filters
              </h2>
            </div>
            <div className="flex flex-row lg:flex-col justify-around lg:h-[50vh] lg:justify-between">
              <div>
                <h3 className="font-medium text-[18px] mb-2">
                  Transaction Type
                </h3>
                <div className="flex flex-col">
                  <label>
                    <input
                      type="checkbox"
                      value="expense"
                      onChange={() => handleTypeChange('expense')}
                      className="mr-1"
                    />
                    Expense
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="income"
                      onChange={() => handleTypeChange('income')}
                      className="mr-1"
                    />
                    Income
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="investment"
                      onChange={() => handleTypeChange('investment')}
                      className="mr-1"
                    />
                    Investment
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-[18px] mb-2">Amount Range</h3>
                <div className="mt-6">
                  <div className="range-slider">
                    <span className="range-selected" ref={sliderRef}></span>
                  </div>
                  <div className="range-input">
                    <input
                      type="range"
                      min={minAmount}
                      max={maxAmount}
                      value={amountRange[0]}
                      onChange={(e) => {
                        const newMin = Number(e.target.value);
                        if (newMin <= amountRange[1]) {
                          setAmountRange([newMin, amountRange[1]]);
                        }
                      }}
                    />
                    <input
                      type="range"
                      min={minAmount}
                      max={maxAmount}
                      value={amountRange[1]}
                      onChange={(e) => {
                        const newMax = Number(e.target.value);
                        if (newMax >= amountRange[0]) {
                          setAmountRange([amountRange[0], newMax]);
                        }
                      }}
                    />
                  </div>
                </div>

                <p className="mt-2 w-[95%] text-[18px] text-center">
                  {amountRange[0]} - {amountRange[1]}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-[18px] mb-2">Date Range</h3>
                <div className="w-[70%] ">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/YYYY"
                    placeholderText="Start Date"
                    className="w-[100%] rounded-[4px] pl-1"
                  />
                </div>
                <div className="mt-2 w-[70%]">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={currentDate}
                    dateFormat="dd/MM/YYYY"
                    placeholderText="End Date"
                    className="w-[100%] rounded-[4px] pl-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-3 mb-3 w-[75vw] lg:w-[50vw] ml-auto mr-auto">
            <div className="flex p-5 relative">
              <div className="flex w-[100%] h-10 bg-white rounded-lg rounded-l-xl">
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-[90%] pl-2 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredTransactions &&
              filteredTransactions.map((transaction) => (
                <TransactionDetails
                  transaction={transaction}
                  key={transaction._id}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;
