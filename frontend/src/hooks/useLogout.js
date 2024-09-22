import { useAuthContext } from './useAuthContext';
import { useTransactionsContext } from './useTransactionsContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchTransactions } = useTransactionsContext();

  const logout = () => {
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
    dispatchTransactions({ type: 'SET_TRANSACTIONS', payload: null });
  };

  return { logout };
};
