import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from './UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';
import SearchUser from '../components/SearchUser';
import classes from './JobsList.module.css';

function RequestsList() {

    const { user } = useContext(UserContext);

    const { data: requestsIncomingUsersData, loading: isLoadingIncoming } = useQuery('incomingRequestsList',
      () => { return axios.get(process.env.REACT_APP_SERVER_URL + `/friend/getincomingrequests/${user.id}`);}
    );

    const { data: requestsOutgoingUsersData, loading: isLoadingOutgoing } = useQuery('outgoingRequestsList',
      () => { return axios.get(process.env.REACT_APP_SERVER_URL + `/friend/getoutgoingrequests/${user.id}`);}
    );

    const requestsIncomingUsers = isLoadingIncoming ? [] : requestsIncomingUsersData;
    const requestsOutgoingUsers = isLoadingOutgoing ? [] : requestsOutgoingUsersData;

    //console.log(requests);

    return (
        <>
            {requestsIncomingUsers?.data && (
                <div className={classes.requests}>
                    <h1>Incoming Friend Requests</h1>
                    <ul className={classes.list}>
                        {requestsIncomingUsers?.data?.map((requestIncomingUser) => (
                            <li key={uuidv4()} className={classes.item}>
                                    <div className={classes.content}>
                                        <h2>{requestIncomingUser.firstName} {requestIncomingUser.lastName}</h2>
                                    </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {requestsOutgoingUsers?.data && (
                <div className={classes.requests}>
                    <h1>Outgoing Friend Requests</h1>
                    <ul className={classes.list}>
                        {requestsOutgoingUsers?.data?.map((requestOutgoingUser) => (
                            <li key={uuidv4()} className={classes.item}>
                                    <div className={classes.content}>
                                        <h2>{requestOutgoingUser.firstName} {requestOutgoingUser.lastName}</h2>
                                    </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <SearchUser />
        </>
        )
}

export default RequestsList;
