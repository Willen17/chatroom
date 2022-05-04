import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextType, useSocket } from "./SocketContext";

const NameInput = () => {
  const { socket } = useSocket() as ContextType;
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName.length) {
      socket!.auth = { nickname: userName };
      socket!.connect();
    } else {
      console.log("Username cannot be empty");
    }
  };

  useEffect(() => {
    //If the connection is succeded then this part runs
    socket?.on("connected", (nickname) => {
      console.log("Connected: ", nickname);
      navigate("/room");
    });
  }, [socket]);

  //If the connection part fails, this code runs, i.e the nickname is shorter than 3 characters.
  socket?.on("connect_error", (err) => {
    if (err.message === "Invalid nickname") {
      console.log("You have entered an invalid username, try again.");
    }
  });

  return (
    <div className="inputNameContainer">
      <h3>Enter your nickname</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          onChange={updateName}
          placeholder="Enter a username"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default NameInput;
