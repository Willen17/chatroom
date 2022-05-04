import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ChatInput from "./ChatInput";
import Layout from "./Layout";
import NameInput from "./NameInput";
import RoomInput from "./RoomInput";
import SocketProvider from "./SocketContext";

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<NameInput />} />
          <Route path="/room" element={<RoomInput />} />
          <Route path="/chat" element={<ChatInput />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
