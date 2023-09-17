import { UserContext } from './UserContext';
import React, { useContext, useEffect, useState } from 'react';

function Notifications() {
    const [messageSet, setMessageSet] = useState(new Set());
    const [messages, setMessages] = useState([]);
    const userContext = useContext(UserContext);

    useEffect(() => {
        
        if (!userContext || !userContext.user) return;
    
        const { user } = userContext;
        console.log("WebSocket is being set up.");
    
        const socket = new WebSocket('ws://localhost:15674/ws');
    
        const handleMessage = (event) => {
            const rawData = event.data;
            const contentLengthIndex = rawData.lastIndexOf("content-length:");

            if (contentLengthIndex !== -1) {
                const startIndex = rawData.indexOf(" ", contentLengthIndex);
                const lengthString = rawData.substring(contentLengthIndex + "content-length:".length, startIndex).trim();
                const messageBodyLength = parseInt(lengthString, 10) + 2;
                
                const messageBodyStartIndex = rawData.length - messageBodyLength;
                const messageBody = rawData.substring(messageBodyStartIndex);
                
                console.log('Received a message from the server:', messageBody);
                
                if (messageSet.has(messageBody)) {
                    console.log("Ignoring duplicate message", messageBody);
                    return;
                }

                messageSet.add(messageBody);
                setMessageSet(new Set(messageSet));

                setMessages((prevMessages) => [...prevMessages, messageBody]);
            }
        };

        socket.addEventListener('message', handleMessage);
        
        const handleOpen = (event) => {
            const login = 'guest';
            const passcode = 'guest';
            socket.send(`CONNECT\nlogin:${login}\npasscode:${passcode}\n\n\0`);
            socket.send(`SUBSCRIBE\nid:sub-0\ndestination:/queue/user_queue_${user.id}\nack:client\n\n\0`);
        };

        socket.addEventListener('open', handleOpen);
        
        return () => {
            socket.removeEventListener('message', handleMessage);
            socket.removeEventListener('open', handleOpen);
            socket.close();
        };
    }, [userContext, messageSet]);


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
