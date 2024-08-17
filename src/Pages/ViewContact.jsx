import React, { useEffect, useState } from 'react';
import { useFirebase } from '../Firebase';
import ChatRoom from '../components/ChatRoom';

const ViewContact = ({ contactEmail }) => { // Accept contactEmail as a prop
    const firebase = useFirebase();
    const [data, setData] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatRoomdata, setCHatRoomData] = useState([]);

    //create Chat Room
    useEffect(() => {
        const createChat = async () => {
            const response = await firebase.createChatRoom(contactEmail);
        }
        createChat();
    }, [contactEmail, firebase]);

    //fetch Chat Room data
    useEffect(() => {
        const fetchChatData = async () => {
            const result = await firebase.fetchChatRoomData(contactEmail);
            if (result) {
                setCHatRoomData(result);
                console.log("result:", JSON.stringify(result));
            }
        };
        fetchChatData();
    }, [contactEmail, firebase]);

    //fetch contacts data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await firebase.getContactByEmail(contactEmail);
                setData(response);
            } catch (error) {
                console.error("Error fetching contact: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [contactEmail]);

    //send message
    const handleSend = async () => {
        console.log("message: " + message);
        console.log("ChatId: " + chatRoomdata.chatId);
        await firebase.sendMessage(chatRoomdata.chatId, message);
    };

    //fetch messages
    useEffect(() => {
        if (chatRoomdata.chatId) {
            console.log("ChatId: " + chatRoomdata.chatId)
          const unsubscribe = firebase.fetchMessagesData(chatRoomdata.chatId, (messages) => {
            setMessages(messages);
            console.log(messages)
          });
      
          return () => unsubscribe && unsubscribe();
        }
      }, [chatRoomdata.chatId]);

      const navbarHeight = 70; // 65px
      const ViewContactHeight = `calc(100vh - ${navbarHeight}px)`;


    return (
        <div style={{height: ViewContactHeight}} className=" bg-gray-100 flex flex-col items-center py-2">
            {loading ? (
                <div className="text-center text-gray-500 text-lg">Loading...</div>
            ) : (
                <div className="bg-white shadow-md rounded-md px-6 py-4 w-full max-w-4xl mb-1">
                <h1 className="text-2xl font-semibold mb-4 text-center">Contact Details</h1>
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-700 text-base"><strong>Name:</strong> {data.name}</p>
                  <p className="text-gray-700 text-base"><strong>Email:</strong> {contactEmail}</p>
                </div>
              </div>
            )}

            <div className="w-full max-w-4xl mt-1 mb-1">
                <ChatRoom createdAt={chatRoomdata.createdAt} messages={messages} />
            </div>

            <div className="w-full max-w-4xl mt-auto">
                <div className="bg-white shadow-md rounded-md p-6 flex items-center space-x-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewContact;
