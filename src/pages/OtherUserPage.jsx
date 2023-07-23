import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import PostsList from '../components/PostsList';
import NewPost from '../components/NewPost';
import { UserContext } from '../components/UserContext';

function OtherUserPage() {
  const { id: searchedUserId } = useParams();
  const { user } = useContext(UserContext);

  const handleRequestFriend = () => {
    const requestFriend = async () => {
      try {
        const requestData = {
          fromUserId: user.id,
          toUserId: searchedUserId
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friend/request`, {
          method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
      } catch (error) {
        console.error('Error requesting friend:', error);
      }
    };
    
    requestFriend();
  }

  const handleRemoveFriend = () => {
    const removeFriend = async () => {
      try {
        const requestData = {
          userId1: user.id,
          userId2: searchedUserId
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friend/delete`, {
          method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
      } catch (error) {
        console.error('Error removing friend:', error);
      }
    };
      
    removeFriend();
  }

  const handleBlockUser = () => {
    const blockUser = async () => {
      try {

        console.log("user.id ", user.id);
        console.log("searchedUserId ", searchedUserId);

        const requestData = {
          blockerUserId: Number(user.id),
          blockedUserId: Number(searchedUserId)
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/block/create`, {
          method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    };
      
    blockUser();
  }

  return (
    <>
      <NewPost />

      <PostsList id={searchedUserId} />

      <button onClick={() => handleRequestFriend()}>Request Friend</button>

      <button onClick={() => handleRemoveFriend()}>Remove Friend</button>

      <button onClick={() => handleBlockUser()}>Block User</button>
    </>
  )
}

export default OtherUserPage;
