import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure correct path
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const provider = new GoogleAuthProvider(); // Initialize once

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User Info:', result.user);
      alert(`Welcome ${result.user.displayName}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      alert(`Error: ${error.code} - ${error.message}`);
    }
  };

  // Email/Password Sign-In
  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('User Info:', result.user);
      alert(`Welcome ${result.user.email}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during email sign-in:', error);
      alert(`Error: ${error.code} - ${error.message}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login Page</h1>

      {/* Email and Password Form */}
      <form onSubmit={handleEmailPasswordSignIn} style={{ display: 'inline-block' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{ display: 'block', margin: '10px', padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          style={{ display: 'block', margin: '10px', padding: '10px' }}
        />
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>Login with Email</button>
      </form>

      {/* Google Sign-In Button */}
      <button onClick={handleGoogleSignIn} style={{ marginTop: '20px', padding: '10px 20px' }}>Login with Google</button>
      
      {/* Navigate to Signup Page */}
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
};

export default Login;
