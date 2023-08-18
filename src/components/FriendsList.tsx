import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import classes from './FriendsList.module.css';

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
}

function FriendsList() {
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const queryClient = useQueryClient();
  const { data: friendsData, isLoading: isLoadingFriends } = useQuery<{ data: Friend[] }>(
    "friends",
    () => {
      if (!userContext || !userContext.user) {
        return Promise.reject("User context not available");
      }
      const { user } = userContext;
      return axios.get(`${process.env.REACT_APP_SERVER_URL}/friend/getbyuserid/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  );
  
  const removeFriendMutation = useMutation(
    (friendId: string) => {
      if (!userContext || !userContext.user) {
        return Promise.reject("User context not available");
      }
      const { user } = userContext;
      return axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friend/delete`,
        { userId1: user.id, userId2: friendId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("friends");
      },
    }
  );
  
  const friends = isLoadingFriends ? [] : friendsData?.data;

  const handleRemoveFriend = (friendId: string) => {
    removeFriendMutation.mutate(friendId);
  }

  return (
    !isLoadingFriends && friends ? (
      <div>
        <h1>Your Friends</h1>
        <ul>
          {friends.map((friend: Friend) => (
            <li key={uuidv4()}>
              <div className={classes.friendContainer}>
                <Link to={{ pathname: `/otheruserprofile/${friend.id}` }}>
                  <div>
                    <p>{friend.firstName} {friend.lastName}</p>
                  </div>
                </Link>
                <button onClick={() => handleRemoveFriend(friend.id)}>Remove Friend</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : null
  );
}

export default FriendsList;
