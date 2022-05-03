import "./App.css";

import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../types";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input") as HTMLInputElement;

form?.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input?.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

const writeMessage = () => {
  console.log("button pressed");
};

socket.on("welcome", (message) => {
  console.log(message);
});

socket.on("chat message", (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  messages?.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

function App() {
  return (
    <div className="App">
      <ul id="messages"></ul>
      <form id="form" action="" onSubmit={() => writeMessage()}>
        <input id="input" />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
