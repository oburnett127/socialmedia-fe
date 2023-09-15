import React, { useContext, useEffect, useState } from 'react';
import { Client, Stomp } from 'stompjs';
import SockJS from 'sockjs-client';
import { UserContext } from './UserContext';

const NotifStompjs = () => {
    const [messages, setMessages] = useState<string[]>([]);

    const userContext = useContext(UserContext);

    useEffect(() => {
        if(!userContext || !userContext.user) {
            return;
        }

        const { user } = userContext;

        var url = "ws://localhost:15674/ws";
        var client = Stomp.Client(url);

        //const socket = new SockJS('http://localhost:15674/stomp');

       // console.log("SockJS:", SockJS);
        //console.log("Client:", Client);
        //console.log("Socket:", socket);
        
        //const client = Client.over(socket);

        client.connect('guest', 'guest', () => { 
            client.subscribe(`/queue/user.${user.id}`, (message: any) => {
                if (message.body) {
                    console.log("Received message:", message.body);
                    setMessages((prevMessages) => [...prevMessages, message]);
                }
            });
        });

        return () => {
            client.disconnect();
        };
    }, [userContext]);

    if(!userContext || !userContext.user) {
        return null;
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
};

export default NotifStompjs;
