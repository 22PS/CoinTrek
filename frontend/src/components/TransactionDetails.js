import { useTransactionsContext } from '../hooks/useTransactionsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { FaRegTrashAlt } from 'react-icons/fa';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const TransactionDetails = ({ transaction }) => {
  const { dispatch } = useTransactionsContext();

  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }
    // console.log(user);
    const response = await fetch(
      'http://localhost:5000/api/transactions/' + transaction._id,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: json });
    }
  };

  return (
    <div className="bg-white border-r-4 m-5 p-5 relative shadow-[2px_2px_5px_0px_rgba(0,0,0,0.05)] ">
      <h4
        className={`${
          transaction.type === 'expense'
            ? 'text-red-600'
            : transaction.type === 'income'
            ? 'text-green-600'
            : 'text-blue-600'
        }  mb-2  text-[22px] font-medium`}
      >
        {transaction.title}
      </h4>
      <p>
        <strong>Amount: </strong>
        {transaction.amount}
      </p>
      {transaction.note.length > 0 ? (
        <p>
          <strong>Note: </strong>
          {transaction.note}
        </p>
      ) : (
        ''
      )}

      <p>
        {formatDistanceToNow(new Date(transaction.createdAt), {
          addSuffix: true,
        })}
      </p>
      <span
        onClick={handleClick}
        className="absolute top-5 right-5 cursor-pointer text-rose-800"
      >
        <FaRegTrashAlt />
      </span>
    </div>
  );
};

export default TransactionDetails;
