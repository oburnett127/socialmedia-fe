import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext'
import classes from './FriendsList.module.css'

function FriendsList() {
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  const [friendsData, setFriendsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userContext || !userContext.user) {
          throw new Error("User context not available");
        }
        const { user } = userContext;
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friend/getbyuserid/${user.id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        //console.log('response.data: ', response.data);
        setFriendsData(response.data);  
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchData();
  }, [userContext, jwtToken]);

  const removeFriend = async (friendId) => {
    try {
      if (!userContext || !userContext.user) {
        throw new Error("User context not available");
      }
      const { user } = userContext;
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friend/delete`,
        { userId1: user.id, userId2: friendId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const friends = friendsData;

  console.log('friends is: ', friends);

  return (
    friends ? (
      <div>
        <h1>Your Friends</h1>
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              <div className={classes.friendContainer}>
                <Link to={{ pathname: `/otheruserprofile/${friend.id}` }}>
                  <div>
                    <p>{friend.firstName} {friend.lastName}</p>
                  </div>
                </Link>
                <button onClick={() => removeFriend(friend.id)}>Remove Friend</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : null
  );
}
export default FriendsList;
