import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import PostsList from '../components/PostsList';
import NewPost from '../components/NewPost';

function CurrentUserPage() {
  const { user } = useContext(UserContext);
  //console.log("user.id is: ", user.id)

  return (
    <>
      <NewPost profUID={user.id} />
      <PostsList id={user.id} />
    </>
  )
}

export default CurrentUserPage;
