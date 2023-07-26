import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import classes from './FriendsList.module.css'

function FriendsList() {
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();

    const { data: friendsData, isLoading: isLoadingFriends } = useQuery(
        'friends',
        () => {
            return axios.get(`${process.env.REACT_APP_SERVER_URL}/friend/getbyuserid/${user.id}`);
        }
    );

    const removeFriendMutation = useMutation(
        (friendId) => axios.post(`${process.env.REACT_APP_SERVER_URL}/friend/delete`, { userId1: user.id, userId2: friendId }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('friends')
            },
        }
    )

    const friends = isLoadingFriends ? [] : friendsData?.data;

    const handleRemoveFriend = (friendId) => {
        removeFriendMutation.mutate(friendId);
    }

    return (
        !isLoadingFriends && friends && (
          <div>
            <h1>Your Friends</h1>
            <ul>
              {friends.map((friend) => (
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
        )
      );      
}

export default FriendsList;
