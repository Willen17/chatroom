import { useEffect, useState } from "react";
import { ContextType, useSocket } from "./SocketContext";

const ListOfRooms = () => {
  const { rooms, currentRoom, socket, setCurrentRoom } =
    useSocket() as ContextType;
  const [doesRoomExist, setDoesRoomExist] = useState<boolean>(false);

  useEffect(() => {
    setDoesRoomExist(true);
  }, [rooms]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.innerText);
    let theRoom = e.currentTarget.innerText;
    if (theRoom) {
      socket!.emit("leave", currentRoom);
      socket!.emit("join", theRoom);
      console.log("från under room");
      setCurrentRoom(theRoom);
    }
  };

  return (
    <div style={{ height: "100vh", width: "20vw", backgroundColor: "red" }}>
      <ul>
        {doesRoomExist ? (
          rooms.map((room, index) => (
            <li key={index}>
              <button onClick={handleSubmit}>{room}</button>
            </li>
          ))
        ) : (
          <li>There are no rooms</li>
        )}
      </ul>
    </div>
  );
};

export default ListOfRooms;
