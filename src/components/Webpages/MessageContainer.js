import React, { useState, useEffect, useContext, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext'; // Import useSocketContext here
import config from '../config';
import { TiMessages } from 'react-icons/ti';
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import PinkNavigationBar from './PinkNavigationBar';

const MessageContainer = ({ onBackUser }) => {
    const { user } = useContext(AuthContext);
    const { socket } = useSocketContext(); // Use the hook to get the socket
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sendData, setSendData] = useState("");
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false); 
    const [selectedConversation, setSelectedConversation] = useState(null); 
    const lastMessageRef = useRef();
    const navigate = useNavigate();

    // Fetch user profile similar to Account.js
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${config.address}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log(response.data.user);  // Log to verify structure
                setProfileData(response.data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Fetch conversations and set selectedConversation to 'sheltersa'
    useEffect(() => {
        const fetchConversation = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(`${config.address}/api/conversations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const shelterConversation = response.data.find(
                    (conversation) => conversation.username === 'sheltersa'
                );

                if (shelterConversation) {
                    setSelectedConversation(shelterConversation);

                    // Fetch messages using getMessages with senderId and receiverId
                    const messageResponse = await axios.get(`${config.address}/api/messages/${shelterConversation._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setMessages(messageResponse.data); // Load messages for the conversation
                } else {
                    // If no conversation exists, create a new one
                    const newConversation = await axios.post(`${config.address}/api/new/conversation`, {
                        participants: [user._id, 'sheltersa'], // Create with 'sheltersa'
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setSelectedConversation(newConversation.data);

                    // Optionally, fetch the messages for this new conversation
                    const messageResponse = await axios.get(`${config.address}/api/messages/${newConversation.data._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setMessages(messageResponse.data);
                }
            } catch (error) {
                console.error('Error fetching conversations or messages:', error);
            }
        };

        fetchConversation();
    }, [user._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await axios.post(`/api/message/send/${selectedConversation?._id}`, { messages: sendData });
            const data = await res.data;
            if (data.success === false) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSendData('');
            setMessages([...messages, data.message]); // Update messages state with new message
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("newMessage", (newMessage) => {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });

            return () => socket.off("newMessage");
        }
    }, [socket]);

    if (loading) return <p>Loading...</p>;
    if (!profileData) return <p>No profile data available</p>;

    return (
        <div className='md:min-w-[500px] h-[99%] flex flex-col py-2'>
            {selectedConversation === null ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2'>
                        <p className='text-2xl'>Welcome!!👋 {profileData.username}😉</p>
                        <p className="text-lg">Select a chat to start messaging</p>
                        <TiMessages className='text-6xl text-center' />
                    </div>
                </div>
            ) : (
                <>
                    <div className='flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12'>
                        <div className='flex gap-2 md:justify-between items-center w-full'>
                            <div className='md:hidden ml-1 self-center'>
                                <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1 self-center'>
                                    <IoArrowBackSharp size={25} />
                                </button>
                            </div>
                            <div className='flex justify-between mr-2 gap-2'>
                                <div className='self-center'>
                                    <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.profilepic} />
                                </div>
                                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                                    {selectedConversation?.username}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='flex-1 overflow-auto'>
                        {loading && (
                            <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                                <div className="loading loading-spinner"></div>
                            </div>
                        )}
                        {!loading && messages?.length === 0 && (
                            <p className='text-center text-white items-center'>Send a message to start Conversation</p>
                        )}
                        {!loading && messages?.length > 0 && messages?.map((message) => (
                            <div className='text-white' key={message?._id} ref={lastMessageRef}>
                                <div className={`chat ${message.senderId === profileData._id ? 'chat-end' : 'chat-start'}`}>
                                    <div className='chat-image avatar'></div>
                                    <div className={`chat-bubble ${message.senderId === profileData._id ? 'bg-sky-600' : ''}`}>
                                        {message?.message}
                                    </div>
                                    <div className="chat-footer text-[10px] opacity-80">
                                        {new Date(message?.createdAt).toLocaleDateString('en-IN')}
                                        {new Date(message?.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className='rounded-full text-black'>
                        <div className='w-full rounded-full flex items-center bg-white'>
                            <input value={sendData} onChange={(e) => setSendData(e.target.value)} required id='message' type='text' className='w-full bg-transparent outline-none px-4 rounded-full' />
                            <button type='submit'>
                                {sending ? <div className='loading loading-spinner'></div> :
                                    <IoSend size={25} className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1' />}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default MessageContainer;
