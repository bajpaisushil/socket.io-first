// components/Chat.tsx
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

interface Message {
  room: string;
  author: string;
  message: string;
  time: string;
}

interface ChatProps {
  socket: any
  username: string;
  room: string;
}

const Chat: React.FC<ChatProps> = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: Message = {
        room: room,
        author: username,
        message: currentMessage,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="w-72 h-96">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="w-full h-full overflow-y-scroll overflow-x-hidden">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`message ${
                username === messageContent.author ? "justify-start" : "justify-end"
              }`}
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p className="bg-green-300 w-fit p-2 rounded-md">{messageContent.message}</p>
                </div>
                <div className="flex mb-4">
                  <p id="time">{messageContent.time}</p>
                  <p id="author" className="mx-4 font-bold">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
          className="flex-85 px-4 text-lg border-2 rounded-md h-8 border-solid border-gray-700 font-sans"
        />
        <button
          onClick={sendMessage}
          className="flex-15 h-full bg-transparent text-3xl text-lightgray outline-none"
        >
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default Chat;
