import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { v4 as uuidv4 } from 'uuid';
import SearchUser from './SearchUser';

function RequestsList() {
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const jwtToken = localStorage.getItem('jwtToken');

  const [requestsIncomingUsers, setRequestsIncomingUsers] = useState({ data: [] });
  const [isLoadingIncoming, setIsLoadingIncoming] = useState(true);

  const [requestsOutgoingUsers, setRequestsOutgoingUsers] = useState({ data: [] });
  const [isLoadingOutgoing, setIsLoadingOutgoing] = useState(true);

  const fetchIncomingRequests = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friend/getincomingrequests/${user.id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      setRequestsIncomingUsers({ data: response.data });
      setIsLoadingIncoming(false);
    } catch (error) {
      console.error('Error fetching incoming friend requests:', error);
      setIsLoadingIncoming(false);
    }
  };

  const fetchOutgoingRequests = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friend/getoutgoingrequests/${user.id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      setRequestsOutgoingUsers({ data: response.data });
      setIsLoadingOutgoing(false);
    } catch (error) {
      console.error('Error fetching outgoing friend requests:', error);
      setIsLoadingOutgoing(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
    fetchOutgoingRequests();
  }, [user, jwtToken]);

  const handleAcceptFriend = async (senderUserId) => {
    try {
      const requestData = {
        fromUserId: senderUserId,
        toUserId: user.id,
      };

      await axios.post(`${process.env.REACT_APP_SERVER_URL}/friend/accept`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      fetchIncomingRequests();
      fetchOutgoingRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <>
      {isLoadingIncoming ? null : (
        <div>
          <h1>Incoming Friend Requests</h1>
          <ul>
            {requestsIncomingUsers.data.map((requestIncomingUser) => (
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

      {isLoadingOutgoing ? null : (
        <div>
          <h1>Outgoing Friend Requests</h1>
          <ul>
            {requestsOutgoingUsers.data.map((requestOutgoingUser) => (
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
  );
}

export default RequestsList;
