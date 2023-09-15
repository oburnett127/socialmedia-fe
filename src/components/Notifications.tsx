import { UserContext } from './UserContext';
import React, { useContext, useEffect, useState } from 'react';

function Notifications() {
    const [messages, setMessages] = useState<string[]>([]);
    
    const userContext = useContext(UserContext);
    
    if(!userContext || !userContext.user) {
        return (
            <div>
                <h1>Notifications</h1>
                <p>Loading...</p>
            </div>
        );
    }

    const { user } = userContext;

    const socket = new WebSocket("ws://localhost:15674/ws");
    const login = "guest";
    const passcode = "guest";

    socket.addEventListener('open', function (event) {
        socket.send(`CONNECT\nlogin:${login}\npasscode:${passcode}\n\n\0`);
    });

    socket.addEventListener('message', function (event) {
        console.log('Received a message from the server:', event.data);
        socket.send(`SUBSCRIBE\nid:sub-1\ndestination:/queue/user.${user.id}\n\n\0`);
    });

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
