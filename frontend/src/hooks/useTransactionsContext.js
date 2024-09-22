import { TransactionsContext } from '../context/TransactionContext';
import { useContext } from 'react';

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw Error(
      'useTransactionContext must be used inside an TransactionsContextProvider'
    );
  }
  return context;
};
