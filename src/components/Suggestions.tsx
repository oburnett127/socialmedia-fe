import { UserContext } from './UserContext';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface IFriend {
  id: string;
  firstName: string;
  lastName: string;
}

function Suggestions() {
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  if (!user) return null;
  const jwtToken = localStorage.getItem('jwtToken');

  const [friends, setFriends] = useState<IFriend[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<IFriend[]>(
          process.env.REACT_APP_SERVER_URL + `/friend/getbyuserid/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchData();
  }, [user, jwtToken]);

  if (!userContext || !user) return null;

  return (
    friends ? (
      <div>
        <h1>Your Friends List</h1>
        <ul>
          {friends.map((friend: IFriend) => (
            <li key={friend.id}>
              <Link to={{ pathname: `/friends/${friend.id}` }}>
                <div>
                  <h2>{friend.firstName} {friend.lastName}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : null
  );
}

export default Suggestions;
