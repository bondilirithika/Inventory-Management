import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ProductManagement from '../components/ProductManagement/ProductManagement';


const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logout Successful!');
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <ProductManagement />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
