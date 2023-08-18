import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import PostsList from '../components/PostsList';
import NewPost from '../components/NewPost';

function CurrentUserPage() {
  const userContext = useContext(UserContext);

if (!userContext || !userContext.user) {
    return null;
  }

  const { user } = userContext;

  return (
    <>
      <NewPost profUID={user.id.toString()} />
      <PostsList id={user.id.toString()} />
    </>
  )
}

export default CurrentUserPage;
