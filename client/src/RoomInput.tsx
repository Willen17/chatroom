import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextType, useSocket } from "./SocketContext";

const RoomInput = () => {
  const { socket } = useSocket() as ContextType;
  const [roomName, setRoomName] = useState<string>("");
  const navigate = useNavigate();

  const updateRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomName.length) {
      socket!.emit("join", roomName);
      console.log("från under room");
    } else {
      console.log("Room name cannot be empty");
    }
  };

  useEffect(() => {
    socket?.on("joined", (room) => {
      console.log("Joined room: ", room);
      navigate("/chat", { state: room });
    });
  }, [socket]);

  return (
    <div className="inputNameContainer">
      <h3>Enter your room</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomName}
          onChange={updateRoomName}
          placeholder="Enter a room"
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default RoomInput;