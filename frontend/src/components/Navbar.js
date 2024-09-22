import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  console.log(user);
  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1 className="text-4xl font-bold">CoinTrek</h1>
        </Link>
        <nav>
          {user ? (
            <div className="grid grid-cols-2">
              <div className="mt-[6px]">
                <span className="text-[24px]">
                  Hi, <span className=" font-medium">{user?.name}</span>
                </span>
              </div>

              <button onClick={handleClick}>Logout</button>
            </div>
          ) : (
            <div className="text-xl font-medium">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
