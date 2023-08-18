import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { UserContext } from './UserContext';
import { v4 as uuidv4 } from 'uuid';
import SearchUser from './SearchUser';

interface RequestUser {
  id: string;
  firstName: string;
  lastName: string;
}

interface RequestData {
  data?: RequestUser[];
}

function RequestsList() {
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const jwtToken = localStorage.getItem('jwtToken');

  const fetchIncomingRequests = () => {
    if (!user) return Promise.resolve({ data: [] });
    return axios.get(process.env.REACT_APP_SERVER_URL + `/friend/getincomingrequests/${user.id}`, {
      headers:{
        Authorization: `Bearer ${jwtToken}`,
      }
    });
  };

  const fetchOutgoingRequests = () => {
    if (!user) return Promise.resolve({ data: [] });
    return axios.get(process.env.REACT_APP_SERVER_URL + `/friend/getoutgoingrequests/${user.id}`, {
      headers:{
        Authorization: `Bearer ${jwtToken}`,
      }
    });
  };

  const { data: requestsIncomingUsersData, isLoading: isLoadingIncoming } = useQuery<RequestData>(
    'incomingRequestsList',
    fetchIncomingRequests
  );

  const { data: requestsOutgoingUsersData, isLoading: isLoadingOutgoing } = useQuery<RequestData>(
    'outgoingRequestsList',
    fetchOutgoingRequests
  );

  if (!userContext || !user) return null;

  const requestsIncomingUsers = isLoadingIncoming ? {} : requestsIncomingUsersData;
  const requestsOutgoingUsers = isLoadingOutgoing ? {} : requestsOutgoingUsersData;

  //console.log(requests);

  const handleAcceptFriend = (senderUserId: string) => {
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
  };

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

