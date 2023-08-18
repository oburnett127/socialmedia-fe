import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';

function LogoutPage() {
  const userContext = useContext(UserContext);
  if (!userContext) return null;
  const { setIsLoggedIn } = userContext;
   
  localStorage.removeItem('jwtToken');
  setIsLoggedIn(false); 
  
  return (
    <p style={{ textAlign: 'center'}}>You have successfully logged out</p>
  )
}

export default LogoutPage;
