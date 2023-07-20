import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';
import classes from './JobsList.module.css';

function Suggestions() {

    const { user } = useContext(UserContext);

    const { data: friends } = useQuery('friends',
      () => { return axios.get(process.env.REACT_APP_SERVER_URL + `/friend/getbyuserid/${user.id}`);}
    );

    //console.log(friends);

    return (
        friends?.data && (
            <div className={classes.friends}>
                <h1>Your Friends List</h1>
                <ul className={classes.list}>
                    {friends.data?.map((friend) => (
                        <li key={uuidv4()} className={classes.item}>
                            <Link to={{ pathname: `/friends/${friend.id}` }}>
                                <div className={classes.content}>
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