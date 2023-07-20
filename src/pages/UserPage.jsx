import React from 'react';
import PostsList from '../components/PostsList';
import NewPost from '../components/NewPost';

function UserPage() {
  return (
    <>
      <NewPost />
      <PostsList />
    </>
  )
}

export default UserPage;
