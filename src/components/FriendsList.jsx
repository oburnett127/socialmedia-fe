import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import classes from './JobsList.module.css';

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
            <div className={classes.friends}>
                <h1>Your Friends List</h1>
                <ul className={classes.list}>
                    {friends.map((friend) => (
                        <li key={uuidv4()} className={classes.item}>
                            <Link to={{ pathname: `/otheruserprofile/${friend.id}` }}>
                                <div className={classes.content}>
                                    <h2>{friend.firstName} {friend.lastName}</h2>
                                </div>
                            </Link>
                            <button onClick={() => handleRemoveFriend(friend.id)}>Remove Friend</button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    )
}

export default FriendsList;
