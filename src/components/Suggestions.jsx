import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';

function Suggestions() {

    const { user } = useContext(UserContext);

    const { data: friends } = useQuery('friends',
      () => { return axios.get(process.env.REACT_APP_SERVER_URL + `/friend/getbyuserid/${user.id}`);}
    );

    //console.log(friends);

    return (
        friends?.data && (
            <div>
                <h1>Your Friends List</h1>
                <ul>
                    {friends.data?.map((friend) => (
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
        )
    )
}

export default Suggestions;