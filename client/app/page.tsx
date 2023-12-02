"use client";

import Chat from "@/components/chat";
import React, { useEffect, useState } from "react";
import * as io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function page() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 font-sans">
      {!showChat ? (
        <div className="flex flex-col items-center">
          <h3 className="text-2xl mb-4">Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            className="w-56 h-10 border-2 border-green-600 rounded px-2 text-lg mb-2"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            className="w-56 h-10 border-2 border-green-600 rounded px-2 text-lg mb-2"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button
            onClick={joinRoom}
            className="w-56 h-12 border-none rounded bg-green-600 text-white text-lg cursor-pointer hover:bg-green-700"
          >
            Join A Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default page;
