import { UserContext } from './UserContext';
import React, { useContext, useEffect, useState } from 'react';

function Notifications() {
    const [messages, setMessages] = useState([]);
    const userContext = useContext(UserContext);

    useEffect(() => {
        if (!userContext || !userContext.user) {
            return;
        }

        const { user } = userContext;

        // Initialize WebSocket connection
        const socket = new WebSocket('ws://localhost:15674/ws');

        // Function to handle received messages
        const handleMessage = (event) => {
            console.log('Received a message from the server:', event.data);
            // Your message handling logic here...
        };

        socket.addEventListener('message', handleMessage);

        // Function to handle opening the connection
        const handleOpen = (event) => {
            const login = 'guest';
            const passcode = 'guest';
            socket.send(`CONNECT\nlogin:${login}\npasscode:${passcode}\n\n\0`);
        };

        socket.addEventListener('open', handleOpen);

        // Cleanup: Remove event listeners and close the socket
        return () => {
            socket.removeEventListener('message', handleMessage);
            socket.removeEventListener('open', handleOpen);
            socket.close();
        };
    }, [userContext]);

    if (!userContext || !userContext.user) {
        return (
            <div>
                <h1>Notifications</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Notifications</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications;