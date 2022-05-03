import "./App.css";

import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../types";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});

let connectedNickname: string;
let joinedRoom: string;

window.addEventListener("load", () => {
  renderNameInput();
  //renderRoomInput();
});

const renderNameInput = () => {
  let appContainer = document.getElementById("app") as HTMLDivElement;
  appContainer.innerHTML = "";

  let container = document.createElement("div");
  container.classList.add("inputNameContainer");

  let nameInputHeader = document.createElement("h3");
  nameInputHeader.innerText = "Enter your nickname";

  let nameInput = document.createElement("input");

  let nameInputButton = document.createElement("button");
  nameInputButton.innerText = "Save";
  nameInputButton.addEventListener("click", () => {
    socket.auth = { nickname: nameInput.value };
    socket.connect();
  });

  container.append(nameInputHeader, nameInput, nameInputButton);
  appContainer.append(container);
};

const renderRoomInput = () => {
  let appContainer = document.getElementById("app") as HTMLDivElement;

  appContainer.innerHTML = "";

  let container = document.createElement("div");
  container.classList.add("inputNameContainer");

  let roomInputHeader = document.createElement("h3");
  roomInputHeader.innerText = "Enter your room";

  let roomInput = document.createElement("input");

  let roomInputButton = document.createElement("button");
  roomInputButton.innerText = "Join";
  roomInputButton.addEventListener("click", () => {
    const room = roomInput.value;
    if (!room.length) {
      console.log("Invalid name of room");
      return;
    }
    // joinedRoom = room;
    socket.emit("join", room);
  });

  container.append(roomInputHeader, roomInput, roomInputButton);
  appContainer.append(container);
};

const renderForm = () => {
  let appContainer = document.getElementById("app") as HTMLDivElement;

  appContainer.innerHTML = "";

  let chatList = document.createElement("ul");
  chatList.id = "messages";

  let chatInput = document.createElement("input");
  chatInput.autocomplete = "off";
  chatInput.id = "input";

  let chatForm = document.createElement("form");
  chatForm.id = "form";
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (chatInput.value.length) {
      socket.emit("message", chatInput.value, joinedRoom);
    } else {
      console.log("You cannot send an empty message");
    }
  });

  let sendButton = document.createElement("button");
  sendButton.innerText = "Send";

  chatForm.append(chatInput, sendButton);
  appContainer.append(chatList, chatForm);
};

socket.on("connect_error", (err) => {
  if (err.message === "Invalid nickname") {
    console.log("You have entered an invalid username, try again.");
  }
});

socket.on("_error", (errorMessage) => {
  console.log(errorMessage);
});

socket.on("roomList", (rooms) => {
  console.log(rooms);
});

socket.on("joined", (room) => {
  console.log("Joined room: ", room);
  joinedRoom = room;
  renderForm();
});

socket.on("connected", (nickname) => {
  console.log("Connected: ", nickname);
  connectedNickname = nickname;
  renderRoomInput();
});

socket.on("message", (message, from) => {
  console.log(message, from.nickname);

  const chatItem = document.createElement("li");
  chatItem.textContent = from.nickname + ": " + message;

  const messageList = document.getElementById("messages");
  if (messageList) {
    messageList.append(chatItem);
  }

  window.scrollTo(0, document.body.scrollHeight);
});

function App() {
  return <div id="app"></div>;
}

export default App;
