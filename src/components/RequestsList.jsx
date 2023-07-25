import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from './UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';
import SearchUser from '../components/SearchUser';

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

    const handleAcceptFriend = (senderUserId) => {
        const acceptFriend = async () => {
          try {
            const requestData = {
              fromUserId: senderUserId,
              toUserId: user.id
            };
    
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friend/accept`, {
              method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
          } catch (error) {
            console.error('Error accepting friend request:', error);
          }
        };
        
        acceptFriend();
      }

    return (
        <>
            {requestsIncomingUsers?.data && (
                <div>
                    <h1>Incoming Friend Requests</h1>
                    <ul>
                        {requestsIncomingUsers?.data?.map((requestIncomingUser) => (
                            <li key={uuidv4()}>
                                    <div>
                                        <p>{requestIncomingUser.firstName} {requestIncomingUser.lastName}</p>
                                    </div>
                                    <button onClick={() => handleAcceptFriend(requestIncomingUser.id)}>Accept</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {requestsOutgoingUsers?.data && (
                <div>
                    <h1>Outgoing Friend Requests</h1>
                    <ul>
                        {requestsOutgoingUsers?.data?.map((requestOutgoingUser) => (
                            <li key={uuidv4()}>
                                    <div>
                                        <p>{requestOutgoingUser.firstName} {requestOutgoingUser.lastName}</p>
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
