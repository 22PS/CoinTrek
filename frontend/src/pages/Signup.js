import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(name, email, password);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3 className="text-3xl text-center font-semibold mb-5">Sign Up</h3>

      <label>
        First Name<span className="text-rose-600">*</span>
      </label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <label>
        Email address<span className="text-rose-600">*</span>
      </label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>
        Password<span className="text-rose-600">*</span>
      </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
