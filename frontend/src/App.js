import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllTransactions from './pages/AllTransactions';
const { useAuthContext } = require('./hooks/useAuthContext');
const { useTransactionsContext } = require('./hooks/useTransactionsContext');

function App() {
  const { user } = useAuthContext();
  const { transactions } = useTransactionsContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/transactions"
              element={
                !user && !transactions ? <Signup /> : <AllTransactions />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
