import React, { useEffect, useState } from 'react'
import { useFirebase } from '../Firebase'

const ChatRoom = ({ createdAt, messages }) => {
  const firebase = useFirebase();



  return (
    <div className="flex flex-col min-w-3xl bg-white shadow-lg rounded-md overflow-hidden">
      {/* Message Container with Scroll and Custom Scrollbar */}
      <div
        className="p-6 flex flex-col space-y-2 overflow-y-scroll"
        style={{
          maxHeight: '317px',
          minHeight: '317px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#a0e3ff #f0f0f0',
        }}
      >

        {/* Timestamp  */}
        <div className="p-4 bg-gray-50  text-gray-500 text-center">
          <p className="text-sm">Created At: {createdAt}</p>
        </div>
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${firebase.user.email === message.email
                ? "justify-end"
                : "justify-start"
              } mb-2`}
          >
            <div
              className={`${firebase.user.email === message.email ? "bg-blue-100" : "bg-gray-100"
                } text-gray-900 p-4 rounded-lg min-w-[160px] max-w-[600px]`}
            >
              <p className="text-sm font-semibold mb-1">
                {firebase.user.email === message.email ? "You" : message.email}
              </p>
              <p className="text-lg mb-2">{message.content}</p>
              <p className="text-xs text-gray-500 text-right">
                {message.sentAt} {/* Displaying the timestamp here */}
              </p>
            </div>
          </div>

        ))}
      </div>

    </div>
  );
}

export default ChatRoom
