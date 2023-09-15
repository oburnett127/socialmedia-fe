import React, { useState, useEffect } from 'react';

//Leaving this here in case a conversion to using WebSockets is made
const NotifWebSockets = () => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        let socket = new WebSocket("ws://localhost:8080/myHandler");
        
        socket.addEventListener('open', function (event) {
            console.log('WebSocket is open now.');
        });
        
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);
        });
    }, []);

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

export default NotifWebSockets;
