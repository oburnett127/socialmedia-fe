import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';

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

    const { data: friends } = useQuery<IFriend[], Error>(
        'friends',
        async () => {
            const response = await axios.get<IFriend[]>(
            process.env.REACT_APP_SERVER_URL + `/friend/getbyuserid/${user.id}`, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
              }
            }
            );
            return response.data;
        }
    );

    if (!userContext || !user) return null;

    return (
        friends ? (
          <div>
            <h1>Your Friends List</h1>
            <ul>
              {friends.map((friend: IFriend) => (
                <li key={uuidv4()}>
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
