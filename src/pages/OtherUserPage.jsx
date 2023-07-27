import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PostsList from '../components/PostsList';
import NewPost from '../components/NewPost';
import { UserContext } from '../components/UserContext';

function OtherUserPage() {
  const { id: searchedUserId } = useParams();
  const { user } = useContext(UserContext);
  const [isFriend, setIsFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);


  useEffect(() => {
    const getFriendStatus = async () => {
      try {
        const requestData = {
          loggedInUserId: user.id,
          otherUserId: searchedUserId
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friend/getfriendstatus`, {
          method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        const result = await response.json();
        setIsFriend(result);
        console.log(result);
      } catch (error) {
        console.error('Error getting friend status:', error);
      }
    };

    const getBlockedStatus = async () => {
      try {
        const requestData = {
          blockerUserId: user.id,
          blockedUserId: searchedUserId
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/block/getblockedstatus`, {
          method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        const result = await response.json();
        setIsBlocked(result);
        console.log(result);
      } catch (error) {
        console.error('Error getting blocked status:', error);
      }
    };
    
    getFriendStatus();
    getBlockedStatus();
  }, [user.id, searchedUserId]);

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
        const requestData = {
          blockerUserId: user.id,
          blockedUserId: searchedUserId
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

  const handleUnblockUser = () => {
    const unblockUser = async () => {
      try {
        const requestData = {
          blockerUserId: user.id,
          blockedUserId: searchedUserId
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/block/delete`, {
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
      
    unblockUser();
  }

  return (
    <>
      <NewPost profUID={searchedUserId} />

      <PostsList id={searchedUserId} />

      {!isFriend && (<button onClick={() => handleRequestFriend()}>Send Request</button>)}
      {isFriend && (<button onClick={() => handleRemoveFriend()}>Remove Friend</button>)}

      {/* {!isBlocked && (<button onClick={() => handleBlockUser()}>Block User</button>)}
      {isBlocked && (<button onClick={() => handleUnblockUser()}>Unblock User</button>)} */}
    </>
  )
}

export default OtherUserPage;
