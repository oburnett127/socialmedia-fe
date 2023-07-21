import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import PageContent from '../components/PageContent';

function HomePage() {
  const { isLoggedIn } = useContext(UserContext);
  const { user } = useContext(UserContext);

  return (
    <PageContent />
  );
}

export default HomePage;
