import React, { useState, useEffect } from 'react'; 
import { io } from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';

// Make sure the URL matches your server
const socket = io('https://sales-force.onrender.com', {
    transports: ['websocket'], // Optional: You can specify transport options
    withCredentials: true, // Important if you're using credentials
    cors: {
        origin: 'https://deft-hamster-48555e.netlify.app', // Frontend origin (optional if already handled server-side)
    }
});

const Conversation = ({ chatSale }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [sent, setSent] = useState(false);
    const [newSale, setNewSale] = useState(chatSale);
    const [newDate, setNewDate] = useState(new Date());
    const [showHr, setShowHr] = useState(false);

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userName = userDetails.email.slice(0, userDetails.email.indexOf('@'));

    // Listen for incoming messages from the backend
    useEffect(() => {
        axios.get('https://sales-force.onrender.com/api/chat/messages')
            .then((res) => {
                setMessages(res.data);
            })
            .catch((err) => console.log(err));
    }, [sent]);

    useEffect(() => {
        setShowHr(true);
    }, [newSale, newDate]);

    const handleSendMessage = () => {
        // Emit the message to the backend
        socket.emit('send_message', { user: userName, discuss: newSale, message: message, date: newDate });
        setSent(true);
        setMessage('');
        setTimeout(() => {
            setSent(false);
        }, 500);
    };

    setTimeout(() => {
        setNewSale('');
        setNewDate('');
    }, 30000);

    return (
        <>
            <div className="conversation-container">
                <div className="message-input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="message-input"
                    />
                    <button onClick={handleSendMessage} className="send-button">Send</button>
                </div>

                <div className="messages-container">
                    {messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`message-item ${message.user === userName ? 'sent' : 'received'}`}
                        >
                            <div className="message-header">
                                <h3>{message?.date.slice(0, message?.date.indexOf('T'))}</h3>
                                <h3>{message.user}</h3>
                                <h3>{message?.discuss}</h3>
                                <h3>{message.message}</h3>
                                <h3>{format(new Date(message.timestamp), 'HH:mm')}</h3>
                            </div>
                            {showHr && <hr />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add internal CSS below */}
            <style jsx>{`
                .conversation-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                }

                .message-input-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .message-input {
                    width: 80%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                    outline: none;
                }

                .send-button {
                    padding: 10px 15px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .send-button:hover {
                    background-color: #0056b3;
                }

                .messages-container {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 10px;
                }

                .message-item {
                    margin-bottom: 15px;
                    display: flex;
                    flex-direction: column;
                }

                .message-item.sent {
                    align-items: flex-start;
                    background-color: #e0f7fa;
                    padding: 10px;
                    border-radius: 10px;
                    margin-left: 20px;
                    margin-right: 50px;
                }

                .message-item.received {
                    align-items: flex-end;
                    background-color: #f1f1f1;
                    padding: 10px;
                    border-radius: 10px;
                    margin-right: 20px;
                    margin-left: 50px;
                }

                .message-header h3 {
                    margin: 3px 0;
                    font-size: 14px;
                    color: #555;
                }

                hr {
                    margin-top: 10px;
                    border: none;
                    border-top: 1px solid #ccc;
                }

                .message-input:focus {
                    border-color: #007bff;
                    outline: none;
                }
            `}</style>
        </>
    );
};

export default Conversation;
